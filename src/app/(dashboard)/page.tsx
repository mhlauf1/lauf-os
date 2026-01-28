"use client";

import { useState } from "react";
import { format, addDays, isSameDay, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DailyTimeline,
  TaskForm,
  GoalFormDialog,
} from "@/components/modules/command";
import { ActivityCardInner } from "@/components/modules/command/ActivityCatalog";
import { CommandSidebar } from "@/components/modules/command/CommandSidebar";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@/hooks/use-tasks";
import { useActivities } from "@/hooks/use-activities";
import { useGoals, useCreateGoal } from "@/hooks/use-goals";
import type { Task, Activity } from "@prisma/client";
import type { TaskFormData } from "@/components/modules/command/TaskForm";

// Parse a DB date (Prisma @db.Date returns "2026-01-27T00:00:00.000Z")
// as a local calendar date, stripping the UTC timezone to avoid off-by-one.
function parseCalendarDate(d: string | Date): Date {
  const s = typeof d === "string" ? d : d.toISOString();
  const [datePart] = s.split("T");
  const [y, m, day] = datePart.split("-").map(Number);
  return new Date(y, m - 1, day);
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DayBuilderPage() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const selectedStr = format(selectedDate, "yyyy-MM-dd");

  // Week days for the day picker
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Data queries — fetch ALL incomplete goals, not just monthly
  const { data: tasks = [], isLoading: tasksLoading } = useTasks({
    date: selectedStr,
  });
  const { data: backlogTasks = [] } = useTasks({ scheduled: "false" });
  const { data: activities = [], isLoading: activitiesLoading, isError: activitiesError, error: activitiesErrorMsg } =
    useActivities();
  const { data: allGoals = [], isLoading: goalsLoading } = useGoals({
    completed: "false",
  });

  // Mutations
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const createGoal = useCreateGoal();

  // UI state — create form
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [taskFormInitial, setTaskFormInitial] = useState<Partial<TaskFormData>>(
    {},
  );
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );
  const [goalFormOpen, setGoalFormOpen] = useState(false);

  // UI state — edit form
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // UI state — delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // Drag state
  const [draggingActivity, setDraggingActivity] = useState<Activity | null>(
    null,
  );
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  // Handlers — create (with slot)
  function handleAddTask(slotIndex: number) {
    setSelectedActivity(null);
    setTaskFormInitial({
      scheduledDate: selectedStr,
      slotIndex,
    });
    setTaskFormOpen(true);
  }

  function handleCreateTask(data: TaskFormData) {
    const scheduledDate = data.scheduledDate
      ? new Date(data.scheduledDate + "T00:00:00.000Z").toISOString()
      : undefined;

    createTask.mutate(
      {
        title: data.title,
        description: data.description || undefined,
        category: data.category,
        priority: data.priority,
        energyLevel: data.energyLevel,
        scheduledDate,
        slotIndex: data.slotIndex,
        activityId: data.activityId || undefined,
        goalId: data.goalId || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Task created");
          setTaskFormOpen(false);
          setSelectedActivity(null);
        },
        onError: (err) => {
          toast.error(err.message || "Failed to create task");
        },
      },
    );
  }

  // Handlers — edit
  function handleEditTask(task: Task) {
    setEditingTask(task);
    setEditFormOpen(true);
  }

  function handleEditSubmit(data: TaskFormData) {
    if (!editingTask) return;

    const scheduledDate = data.scheduledDate
      ? new Date(data.scheduledDate + "T00:00:00.000Z").toISOString()
      : null;

    updateTask.mutate(
      {
        id: editingTask.id,
        title: data.title,
        description: data.description || null,
        category: data.category,
        priority: data.priority,
        energyLevel: data.energyLevel,
        scheduledDate,
        slotIndex: data.slotIndex ?? null,
        goalId: data.goalId || null,
        activityId: data.activityId || null,
      },
      {
        onSuccess: () => {
          toast.success("Task updated");
          setEditFormOpen(false);
          setEditingTask(null);
        },
        onError: (err) => toast.error(err.message || "Failed to update task"),
      },
    );
  }

  // Handlers — status changes
  function handleCompleteTask(id: string) {
    updateTask.mutate(
      { id, status: "DONE" },
      {
        onSuccess: () => toast.success("Task completed"),
        onError: (err) => toast.error(err.message || "Failed to complete task"),
      },
    );
  }

  // Handlers — delete with confirmation
  function handleDeleteTask(id: string) {
    setDeletingTaskId(id);
    setDeleteDialogOpen(true);
  }

  function confirmDelete() {
    if (!deletingTaskId) return;
    deleteTask.mutate(deletingTaskId, {
      onSuccess: () => {
        toast.success("Task deleted");
        setDeleteDialogOpen(false);
        setDeletingTaskId(null);
      },
      onError: (err) => toast.error(err.message || "Failed to delete task"),
    });
  }

  // Handlers — schedule existing backlog task
  function handleScheduleExistingTask(
    taskId: string,
    scheduledDate: string,
    slotIndex: number,
  ) {
    const isoDate = scheduledDate
      ? new Date(scheduledDate + "T00:00:00.000Z").toISOString()
      : new Date(selectedStr + "T00:00:00.000Z").toISOString();

    updateTask.mutate(
      {
        id: taskId,
        scheduledDate: isoDate,
        slotIndex,
      },
      {
        onSuccess: () => {
          toast.success("Task scheduled");
          setTaskFormOpen(false);
        },
        onError: (err) => {
          toast.error(err.message || "Failed to schedule task");
        },
      },
    );
  }

  // Activity selection from sidebar
  function handleSelectActivity(activity: Activity) {
    setSelectedActivity(activity);
    setTaskFormInitial({
      scheduledDate: selectedStr,
    });
    setTaskFormOpen(true);
  }

  function handleAddGoal() {
    setGoalFormOpen(true);
  }

  // Drag and drop handlers
  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    if (active.data.current?.type === "activity") {
      setDraggingActivity(active.data.current.activity as Activity);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setDraggingActivity(null);

    if (!over) return;

    // Handle activity drop onto slot
    if (
      active.data.current?.type === "activity" &&
      over.data.current?.type === "slot"
    ) {
      const activity = active.data.current.activity as Activity;
      const slotIndex = over.data.current.slotIndex as number;

      // Create task from activity in slot
      const scheduledDate = new Date(
        selectedStr + "T00:00:00.000Z",
      ).toISOString();
      createTask.mutate(
        {
          title: activity.title,
          category: activity.category,
          energyLevel: activity.energyLevel,
          scheduledDate,
          slotIndex,
          activityId: activity.id,
        },
        {
          onSuccess: () => toast.success(`Added "${activity.title}" to slot`),
          onError: (err) =>
            toast.error(err.message || "Failed to add activity"),
        },
      );
    }
  }

  // Build edit form initial data from editing task
  const editFormInitial: Partial<TaskFormData> | undefined = editingTask
    ? {
        title: editingTask.title,
        description: editingTask.description || "",
        category: editingTask.category,
        priority: editingTask.priority,
        energyLevel: editingTask.energyLevel,
        scheduledDate: editingTask.scheduledDate
          ? format(parseCalendarDate(editingTask.scheduledDate), "yyyy-MM-dd")
          : "",
        slotIndex:
          editingTask.slotIndex !== null ? editingTask.slotIndex : undefined,
        activityId: editingTask.activityId || "",
        goalId: editingTask.goalId || "",
      }
    : undefined;

  const isLoading = tasksLoading || activitiesLoading || goalsLoading;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 h-full">
        {/* Main content */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-medium tracking-tight">
                {getGreeting()}, Mike
              </h1>
              <p className="text-sm text-text-secondary">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </p>
            </div>
          </div>
          {/* Day picker */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setSelectedDate((d) => addDays(d, -7))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex flex-1 gap-1">
              {weekDays.map((day) => {
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, today);
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "flex flex-1 flex-col items-center rounded-lg py-1.5 transition-colors",
                      isSelected
                        ? "bg-accent/20 text-text-primary"
                        : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[10px] uppercase tracking-wide",
                        isSelected && "font-medium",
                      )}
                    >
                      {format(day, "EEE")}
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        isSelected
                          ? "font-bold"
                          : isToday
                            ? "font-bold"
                            : "font-medium",
                      )}
                    >
                      {format(day, "d")}
                    </span>
                  </button>
                );
              })}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setSelectedDate((d) => addDays(d, 7))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Daily Timeline */}
          {isLoading ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-sm text-text-tertiary">
                  Loading your day...
                </p>
              </CardContent>
            </Card>
          ) : (
            <DailyTimeline
              date={selectedDate}
              tasks={tasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onCompleteTask={handleCompleteTask}
            />
          )}
        </div>

        {/* Right Sidebar — Goals & Activities */}
        <div className="w-80 shrink-0 sticky top-6 h-[calc(100vh-3rem)]">
          {activitiesError ? (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">Failed to load activities</p>
              <p className="text-xs text-red-400/70 mt-1">{activitiesErrorMsg?.message || 'Unknown error'}</p>
            </div>
          ) : (
            <CommandSidebar
              activities={activities}
              goals={allGoals}
              onSelectActivity={handleSelectActivity}
              onAddGoal={handleAddGoal}
            />
          )}
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {draggingActivity && (
          <div className="w-[200px]">
            <ActivityCardInner
              activity={draggingActivity}
              onSelect={() => {}}
              isDragging
            />
          </div>
        )}
      </DragOverlay>

      {/* Create Task Form Dialog */}
      <TaskForm
        open={taskFormOpen}
        onOpenChange={setTaskFormOpen}
        onSubmit={handleCreateTask}
        initialData={taskFormInitial}
        fromActivity={selectedActivity}
        goals={allGoals}
        activities={activities}
        backlogTasks={backlogTasks}
        onScheduleExistingTask={handleScheduleExistingTask}
      />

      {/* Edit Task Form Dialog */}
      {editingTask && (
        <TaskForm
          open={editFormOpen}
          onOpenChange={(open) => {
            setEditFormOpen(open);
            if (!open) setEditingTask(null);
          }}
          onSubmit={handleEditSubmit}
          initialData={editFormInitial}
          isEditing
          goals={allGoals}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete task?"
        description="This will permanently delete this task. This action cannot be undone."
        isPending={deleteTask.isPending}
      />

      {/* Goal Form Dialog */}
      <GoalFormDialog
        open={goalFormOpen}
        onOpenChange={setGoalFormOpen}
        onSubmit={(data) =>
          createGoal.mutate(data, {
            onSuccess: () => {
              toast.success("Goal created");
              setGoalFormOpen(false);
            },
            onError: (err) =>
              toast.error(err.message || "Failed to create goal"),
          })
        }
      />
    </DndContext>
  );
}
