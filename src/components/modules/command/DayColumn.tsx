"use client";

import { format } from "date-fns";
import { Plus, Check, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCategoryConfig } from "@/config/categories";
import { TIME_SLOTS } from "@/config/time-slots";
import type { Task, TaskCategory } from "@prisma/client";

interface DayColumnProps {
  date: Date;
  tasks: Task[];
  isToday: boolean;
  onAddTask: (date: Date, slotIndex: number) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onCompleteTask: (id: string) => void;
}

export function DayColumn({
  date,
  tasks,
  isToday,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onCompleteTask,
}: DayColumnProps) {
  // Create a map of slotIndex -> task
  const tasksBySlot = new Map<number, Task>();
  for (const task of tasks) {
    if (task.slotIndex !== null && task.slotIndex !== undefined) {
      tasksBySlot.set(task.slotIndex, task);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col border-r border-border last:border-r-0 min-w-[140px]",
        isToday ? "bg-accent/5" : "bg-surface",
      )}
    >
      {/* Day header */}
      <div
        className={cn(
          "sticky top-0 z-10 border-b border-border px-3 py-3 text-center",
          isToday ? "bg-accent/5" : "bg-surface",
        )}
      >
        <p className="text-xs text-text-secondary uppercase tracking-wide">
          {format(date, "EEE")}
        </p>
        <p
          className={cn(
            "text-lg text-text-primary",
            isToday && "font-bold",
          )}
        >
          {format(date, "d")}
        </p>
      </div>

      {/* Slot grid */}
      <div className="flex-1">
        {TIME_SLOTS.map((slot) => {
          const task = tasksBySlot.get(slot.index);
          return (
            <SlotCell
              key={slot.index}
              slotIndex={slot.index}
              task={task}
              onAddTask={() => onAddTask(date, slot.index)}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onCompleteTask={onCompleteTask}
            />
          );
        })}
      </div>
    </div>
  );
}

interface SlotCellProps {
  slotIndex: number;
  task?: Task;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onCompleteTask: (id: string) => void;
}

function SlotCell({
  task,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onCompleteTask,
}: SlotCellProps) {
  if (!task) {
    return (
      <div
        className="h-[60px] border-b border-border/50 p-1 hover:bg-surface-elevated/50 cursor-pointer group"
        onClick={onAddTask}
      >
        <div className="flex items-center justify-center h-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Plus className="h-4 w-4 text-text-tertiary" />
        </div>
      </div>
    );
  }

  const catConfig = getCategoryConfig(task.category as TaskCategory);
  const isCompleted = task.status === "DONE";

  return (
    <div
      className={cn(
        "h-[60px] border-b border-border/50 p-1 group",
      )}
    >
      <div
        className={cn(
          "relative rounded-md border bg-surface-elevated p-1.5 h-full cursor-pointer transition-all hover:shadow-sm",
          "border-l-[3px]",
          isCompleted && "opacity-60",
        )}
        style={{ borderLeftColor: catConfig.color }}
        onClick={() => onEditTask(task)}
      >
        {/* Title */}
        <p
          className={cn(
            "text-xs font-medium truncate pr-6",
            isCompleted && "line-through text-text-tertiary",
          )}
        >
          {task.title}
        </p>

        {/* Hover actions */}
        <div
          className="absolute top-0.5 right-0.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          {!isCompleted && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-green-400 hover:text-green-500"
              onClick={() => onCompleteTask(task.id)}
            >
              <Check className="h-3 w-3" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditTask(task)}>
                Edit task
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-400"
                onClick={() => onDeleteTask(task.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
