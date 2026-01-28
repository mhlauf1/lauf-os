"use client";

import { format, isSameDay } from "date-fns";
import { Plus, Clock } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeBlock } from "./TimeBlock";
import { TIME_SLOTS, getSlotTimeRange } from "@/config/time-slots";
import { cn } from "@/lib/utils";
import type { Task } from "@prisma/client";

interface DailyTimelineProps {
  date: Date;
  tasks: Task[];
  onAddTask?: (slotIndex: number) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (id: string) => void;
  onCompleteTask?: (id: string) => void;
}

// Parse a DB date (Prisma @db.Date returns "2026-01-27T00:00:00.000Z")
// as a local calendar date, ignoring the UTC timezone suffix.
function parseCalendarDate(d: string | Date): Date {
  const s = typeof d === "string" ? d : d.toISOString();
  const [datePart] = s.split("T");
  const [y, m, day] = datePart.split("-").map(Number);
  return new Date(y, m - 1, day);
}

export function DailyTimeline({
  date,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onCompleteTask,
}: DailyTimelineProps) {
  const isToday = isSameDay(date, new Date());

  // Filter to tasks for this day
  const dayTasks = tasks.filter(
    (task) =>
      task.scheduledDate &&
      isSameDay(parseCalendarDate(task.scheduledDate), date),
  );

  // Create a map of slotIndex -> tasks array (multiple tasks per slot)
  const tasksBySlot = new Map<number, Task[]>();
  for (const task of dayTasks) {
    if (task.slotIndex !== null && task.slotIndex !== undefined) {
      const existing = tasksBySlot.get(task.slotIndex) || [];
      tasksBySlot.set(task.slotIndex, [...existing, task]);
    }
  }

  const completedCount = dayTasks.filter((t) => t.status === "DONE").length;
  const scheduledCount = dayTasks.filter((t) => t.slotIndex !== null).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-text-tertiary" />
            <CardTitle className="text-base">
              {isToday ? "Today's Schedule" : format(date, "EEEE, MMMM d")}
            </CardTitle>
          </div>
          <span className="text-sm text-text-secondary">
            {completedCount} / {scheduledCount} completed
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {TIME_SLOTS.map((slot) => {
          const slotTasks = tasksBySlot.get(slot.index) || [];
          return (
            <TimeSlotRow
              key={slot.index}
              slotIndex={slot.index}
              tasks={slotTasks}
              onAddTask={() => onAddTask?.(slot.index)}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onCompleteTask={onCompleteTask}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}

interface TimeSlotRowProps {
  slotIndex: number;
  tasks: Task[];
  onAddTask: () => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (id: string) => void;
  onCompleteTask?: (id: string) => void;
}

function TimeSlotRow({
  slotIndex,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onCompleteTask,
}: TimeSlotRowProps) {
  const slot = TIME_SLOTS[slotIndex];
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${slotIndex}`,
    data: { type: "slot", slotIndex },
  });

  const hasTasks = tasks.length > 0;

  return (
    <div className="flex items-stretch gap-3">
      {/* Time Label */}
      <div className="w-20 py-2 text-xs text-text-secondary shrink-0 text-right pr-2">
        {slot.label}
      </div>

      {/* Slot Content */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 min-h-12 rounded-lg transition-colors",
          isOver && "bg-accent/10 ring-2 ring-accent ring-inset",
        )}
      >
        {hasTasks ? (
          <div className="flex flex-wrap items-center gap-2 py-1">
            {tasks.map((task) => (
              <TimeBlock
                key={task.id}
                task={task}
                compact
                onEdit={() => onEditTask?.(task)}
                onDelete={onDeleteTask}
                onComplete={onCompleteTask}
              />
            ))}
            <button
              onClick={onAddTask}
              className={cn(
                "flex items-center justify-center h-8 w-8 rounded-md border border-dashed border-border text-text-tertiary transition-colors hover:border-text-tertiary hover:text-text-secondary",
                isOver && "border-accent text-accent",
              )}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onAddTask}
            className={cn(
              "flex w-full h-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-3 text-sm text-text-tertiary transition-colors hover:border-text-tertiary hover:text-text-secondary",
              isOver && "border-accent text-accent",
            )}
          >
            <Plus className="h-4 w-4" />
            Add Block
          </button>
        )}
      </div>
    </div>
  );
}
