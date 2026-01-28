"use client";

import { useState, useMemo } from "react";
import { format, startOfWeek, addDays, isSameDay, isSameWeek } from "date-fns";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TaskForm } from "@/components/modules/command/TaskForm";
import { DayColumn } from "@/components/modules/command/DayColumn";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@/hooks/use-tasks";
import { useActivities } from "@/hooks/use-activities";
import { useGoals } from "@/hooks/use-goals";
import type { Task } from "@prisma/client";
import type { TaskFormData } from "@/components/modules/command/TaskForm";

// Parse a DB date (Prisma @db.Date returns "2026-01-27T00:00:00.000Z")
// as a local calendar date, stripping the UTC timezone to avoid off-by-one.
function parseCalendarDate(d: string | Date): Date {
  const s = typeof d === "string" ? d : d.toISOString();
  const [datePart] = s.split("T");
  const [y, m, day] = datePart.split("-").map(Number);
  return new Date(y, m - 1, day);
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const dateFrom = format(weekStart, "yyyy-MM-dd");
  const dateTo = format(weekEnd, "yyyy-MM-dd");

  // Data fetching
  const { data: tasks = [], isLoading } = useTasks({ dateFrom, dateTo });
  const { data: backlogTasks = [] } = useTasks({ scheduled: "false" });
  const { data: activities = [] } = useActivities();
  const { data: goals = [] } = useGoals({ completed: "false" });

  // Mutations
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  // Create form state
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [taskFormInitial, setTaskFormInitial] = useState<
    Partial<TaskFormData>
  >({});

  // Edit form state
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // Group tasks by day
  const tasksByDay = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const task of tasks) {
      if (task.scheduledDate) {
        const dayKey = format(
          parseCalendarDate(task.scheduledDate),
          "yyyy-MM-dd",
        );
        if (!map[dayKey]) map[dayKey] = [];
        map[dayKey].push(task);
      }
    }
    return map;
  }, [tasks]);

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate((prev) => addDays(prev, direction === "prev" ? -7 : 7));
  };

  // Contextual label for the center nav button
  const now = new Date();
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const nextWeekStart = addDays(thisWeekStart, 7);
  const isThisWeek = isSameWeek(weekStart, now, { weekStartsOn: 1 });
  const isNextWeek = isSameWeek(weekStart, nextWeekStart, { weekStartsOn: 1 });

  function getWeekLabel(): string {
    if (isThisWeek) return "This Week";
    if (isNextWeek) return "Next Week";
    const startDay = format(weekStart, "do");
    const endDay = format(weekEnd, "do");
    return `${startDay} – ${endDay}`;
  }

  // Create task flow
  function handleAddTask(date: Date) {
    setTaskFormInitial({
      scheduledDate: format(date, "yyyy-MM-dd"),
    });
    setTaskFormOpen(true);
  }

  function handleCreateSubmit(data: TaskFormData) {
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
        timeBlockMinutes: data.timeBlockMinutes,
        scheduledDate,
        scheduledTime: data.scheduledTime || undefined,
        goalId: data.goalId || undefined,
        activityId: data.activityId || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Task created");
          setTaskFormOpen(false);
        },
        onError: (err) => toast.error(err.message || "Failed to create task"),
      },
    );
  }

  // Schedule existing backlog task
  function handleScheduleExistingTask(
    taskId: string,
    scheduledDate: string,
    scheduledTime: string,
  ) {
    const isoDate = scheduledDate
      ? new Date(scheduledDate + "T00:00:00.000Z").toISOString()
      : null;

    updateTask.mutate(
      {
        id: taskId,
        scheduledDate: isoDate,
        scheduledTime: scheduledTime || null,
      },
      {
        onSuccess: () => {
          toast.success("Task scheduled");
          setTaskFormOpen(false);
        },
        onError: (err) =>
          toast.error(err.message || "Failed to schedule task"),
      },
    );
  }

  // Edit task flow
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
        timeBlockMinutes: data.timeBlockMinutes,
        scheduledDate,
        scheduledTime: data.scheduledTime || null,
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

  // Complete task
  function handleCompleteTask(id: string) {
    const task = tasks.find((t) => t.id === id);
    const newStatus = task?.status === "DONE" ? "TODO" : "DONE";

    updateTask.mutate(
      { id, status: newStatus },
      {
        onSuccess: () =>
          toast.success(
            newStatus === "DONE" ? "Task completed" : "Task reopened",
          ),
        onError: (err) => toast.error(err.message || "Failed to update task"),
      },
    );
  }

  // Delete task flow
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

  // Build edit form initial data from editing task
  const editFormInitial: Partial<TaskFormData> | undefined = editingTask
    ? {
        title: editingTask.title,
        description: editingTask.description || "",
        category: editingTask.category,
        priority: editingTask.priority,
        energyLevel: editingTask.energyLevel,
        timeBlockMinutes: editingTask.timeBlockMinutes || 90,
        scheduledDate: editingTask.scheduledDate
          ? format(parseCalendarDate(editingTask.scheduledDate), "yyyy-MM-dd")
          : "",
        scheduledTime: editingTask.scheduledTime || "",
        activityId: editingTask.activityId || "",
        goalId: editingTask.goalId || "",
      }
    : undefined;

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Calendar</h1>
          <p className="text-sm text-text-secondary">
            Week of {format(weekStart, "MMMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
            {getWeekLabel()}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Week Grid */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-text-tertiary" />
              <p className="mt-2 text-sm text-text-tertiary">
                Loading calendar...
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden flex-1 flex flex-col">
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="grid grid-cols-7 flex-1">
              {weekDays.map((day) => {
                const dayKey = format(day, "yyyy-MM-dd");
                const dayTasks = tasksByDay[dayKey] || [];
                const today = isSameDay(day, new Date());

                return (
                  <DayColumn
                    key={dayKey}
                    date={day}
                    tasks={dayTasks}
                    isToday={today}
                    onAddTask={handleAddTask}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                    onCompleteTask={handleCompleteTask}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Task Form */}
      <TaskForm
        open={taskFormOpen}
        onOpenChange={setTaskFormOpen}
        onSubmit={handleCreateSubmit}
        initialData={taskFormInitial}
        goals={goals}
        activities={activities}
        backlogTasks={backlogTasks}
        onScheduleExistingTask={handleScheduleExistingTask}
      />

      {/* Edit Task Form */}
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
          goals={goals}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete task?"
        description="This will permanently delete this task. This action cannot be undone."
        isPending={deleteTask.isPending}
      />
    </div>
  );
}
