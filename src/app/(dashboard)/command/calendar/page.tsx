"use client";

import { useState, useMemo } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TaskForm } from "@/components/modules/command/TaskForm";
import { useTasks, useCreateTask } from "@/hooks/use-tasks";
import { useGoals } from "@/hooks/use-goals";
import { cn } from "@/lib/utils";
import { getCategoryConfig } from "@/config/categories";
import type { Task, TaskCategory } from "@prisma/client";
import type { TaskFormData } from "@/components/modules/command/TaskForm";

const DAY_START_HOUR = 6;
const DAY_END_HOUR = 23;
const TOTAL_HOURS = DAY_END_HOUR - DAY_START_HOUR; // 17
const HOUR_HEIGHT_PX = 60;
const TOP_OFFSET_PX = 30; // half-hour buffer so 6 AM label isn't clipped

const hours = Array.from(
  { length: TOTAL_HOURS + 1 },
  (_, i) => DAY_START_HOUR + i,
);

function timeToOffset(time: string): number {
  const [h, m] = time.split(":").map(Number);
  const minutesFromStart = (h - DAY_START_HOUR) * 60 + m;
  return (minutesFromStart / 60) * HOUR_HEIGHT_PX + TOP_OFFSET_PX;
}

function durationToHeight(minutes: number): number {
  return (minutes / 60) * HOUR_HEIGHT_PX;
}

function formatHourLabel(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12} ${period}`;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const dateFrom = format(weekStart, "yyyy-MM-dd");
  const dateTo = format(weekEnd, "yyyy-MM-dd");

  const { data: tasks = [], isLoading } = useTasks({ dateFrom, dateTo });
  const { data: goals = [] } = useGoals({ completed: "false" });
  const createTask = useCreateTask();

  // Task form state
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [taskFormInitial, setTaskFormInitial] = useState<Partial<TaskFormData>>(
    {},
  );

  // Parse a DB date (Prisma @db.Date returns "2026-01-27T00:00:00.000Z")
  // as a local calendar date, stripping the UTC timezone to avoid off-by-one.
  function parseCalendarDate(d: string | Date): Date {
    const s = typeof d === "string" ? d : d.toISOString();
    const [datePart] = s.split("T");
    const [y, m, day] = datePart.split("-").map(Number);
    return new Date(y, m - 1, day);
  }

  // Group tasks by day
  const tasksByDay = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const task of tasks) {
      if (task.scheduledDate && task.scheduledTime) {
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

  // Count tasks per day
  const taskCountByDay = useMemo(() => {
    const map: Record<string, number> = {};
    for (const task of tasks) {
      if (task.scheduledDate) {
        const dayKey = format(
          parseCalendarDate(task.scheduledDate),
          "yyyy-MM-dd",
        );
        map[dayKey] = (map[dayKey] || 0) + 1;
      }
    }
    return map;
  }, [tasks]);

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate((prev) => addDays(prev, direction === "prev" ? -7 : 7));
  };

  function handleAddTaskAtSlot(day: Date, time: string) {
    setTaskFormInitial({
      scheduledDate: format(day, "yyyy-MM-dd"),
      scheduledTime: time,
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
        timeBlockMinutes: data.timeBlockMinutes,
        scheduledDate,
        scheduledTime: data.scheduledTime || undefined,
        goalId: data.goalId || undefined,
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

  return (
    <div className="space-y-6">
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
            Today
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
        <Card>
          <CardContent className="p-0">
            {/* Sticky day headers */}
            <div
              className="grid border-b border-border"
              style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
            >
              <div className="border-r border-border p-3" />
              {weekDays.map((day) => {
                const dayKey = format(day, "yyyy-MM-dd");
                const count = taskCountByDay[dayKey] || 0;
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "border-r border-border p-3 text-center last:border-r-0",
                      isSameDay(day, new Date()) && "bg-accent/10",
                    )}
                  >
                    <p className="text-xs text-text-secondary">
                      {format(day, "EEE")}
                    </p>
                    <p
                      className={cn(
                        "text-lg font-medium",
                        isSameDay(day, new Date()) && "text-accent",
                      )}
                    >
                      {format(day, "d")}
                    </p>
                    {count > 0 && (
                      <p className="text-xs text-text-tertiary mt-0.5">
                        {count} task{count !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Scrollable timeline body */}
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 260px)" }}
            >
              <div
                className="grid"
                style={{
                  gridTemplateColumns: "80px repeat(7, 1fr)",
                  height: TOTAL_HOURS * HOUR_HEIGHT_PX + TOP_OFFSET_PX,
                }}
              >
                {/* Time labels column */}
                <div className="relative border-r border-border">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="absolute right-2 text-xs text-text-secondary -translate-y-1/2"
                      style={{
                        top: (hour - DAY_START_HOUR) * HOUR_HEIGHT_PX + TOP_OFFSET_PX,
                      }}
                    >
                      {formatHourLabel(hour)}
                    </div>
                  ))}
                </div>

                {/* 7 day columns */}
                {weekDays.map((day) => {
                  const dayKey = format(day, "yyyy-MM-dd");
                  const dayTasks = tasksByDay[dayKey] || [];
                  const isToday = isSameDay(day, new Date());

                  return (
                    <div
                      key={dayKey}
                      className={cn(
                        "relative border-r border-border last:border-r-0",
                        isToday && "bg-accent/5",
                      )}
                    >
                      {/* Hour gridlines */}
                      {hours.map((hour) => (
                        <div
                          key={hour}
                          className="absolute w-full border-t border-border"
                          style={{
                            top: (hour - DAY_START_HOUR) * HOUR_HEIGHT_PX + TOP_OFFSET_PX,
                          }}
                        />
                      ))}

                      {/* Clickable hour zones */}
                      {hours.slice(0, -1).map((hour) => {
                        const time = `${hour.toString().padStart(2, "0")}:00`;
                        return (
                          <button
                            key={hour}
                            onClick={() => handleAddTaskAtSlot(day, time)}
                            className="absolute w-full opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-text-tertiary"
                            style={{
                              top: (hour - DAY_START_HOUR) * HOUR_HEIGHT_PX + TOP_OFFSET_PX,
                              height: HOUR_HEIGHT_PX,
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        );
                      })}

                      {/* Tasks (absolutely positioned) */}
                      {dayTasks.map((task) => {
                        const catConfig = getCategoryConfig(
                          task.category as TaskCategory,
                        );
                        const minutes = task.timeBlockMinutes || 90;
                        return (
                          <div
                            key={task.id}
                            className="absolute left-0.5 right-0.5 z-10 rounded-sm border border-border px-1.5 py-0.5 text-xs overflow-hidden cursor-default"
                            style={{
                              top: timeToOffset(task.scheduledTime!),
                              height: durationToHeight(minutes),
                              borderLeftWidth: "3px",
                              borderLeftColor: catConfig.color,
                              backgroundColor: "var(--surface)",
                            }}
                          >
                            <p className="font-medium truncate leading-tight">
                              {task.title}
                            </p>
                            {minutes >= 45 && (
                              <p className="text-[10px] text-text-tertiary">
                                {minutes}m
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task Form Dialog */}
      <TaskForm
        open={taskFormOpen}
        onOpenChange={setTaskFormOpen}
        onSubmit={handleCreateTask}
        initialData={taskFormInitial}
        goals={goals}
      />
    </div>
  );
}
