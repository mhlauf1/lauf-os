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
import type { Task, TaskCategory } from "@prisma/client";

interface DayColumnProps {
  date: Date;
  tasks: Task[];
  isToday: boolean;
  onAddTask: (date: Date) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onCompleteTask: (id: string) => void;
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return m === 0 ? `${h12} ${period}` : `${h12}:${m.toString().padStart(2, "0")} ${period}`;
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
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.scheduledTime && !b.scheduledTime) return 0;
    if (!a.scheduledTime) return 1;
    if (!b.scheduledTime) return -1;
    return a.scheduledTime.localeCompare(b.scheduledTime);
  });

  return (
    <div
      className={cn(
        "flex flex-col border-r border-border last:border-r-0",
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

      {/* Task cards */}
      <div className="flex-1 p-2 space-y-2">
        {sortedTasks.map((task) => {
          const catConfig = getCategoryConfig(task.category as TaskCategory);
          const isCompleted = task.status === "DONE";
          const minutes = task.timeBlockMinutes || 90;

          return (
            <div
              key={task.id}
              className={cn(
                "group relative rounded-lg border border-border bg-surface-elevated p-2.5 cursor-pointer transition-all hover:border-border/80 hover:shadow-sm",
                "border-l-4",
                isCompleted && "opacity-60",
              )}
              style={{ borderLeftColor: catConfig.color }}
              onClick={() => onEditTask(task)}
            >
              {/* Time */}
              {task.scheduledTime && (
                <p className="text-xs text-text-secondary mb-0.5">
                  {formatTime(task.scheduledTime)}
                </p>
              )}

              {/* Title */}
              <p
                className={cn(
                  "text-sm font-medium truncate",
                  isCompleted && "line-through text-text-tertiary",
                )}
              >
                {task.title}
              </p>

              {/* Duration badge */}
              {minutes >= 45 && (
                <p className="text-[10px] text-text-tertiary mt-0.5">
                  {minutes}m
                </p>
              )}

              {/* Hover actions */}
              <div
                className="absolute top-1.5 right-1.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                {!isCompleted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-green-400 hover:text-green-500"
                    onClick={() => onCompleteTask(task.id)}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
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
          );
        })}
      </div>

      {/* Add task button */}
      <div className="p-2 mt-auto">
        <button
          onClick={() => onAddTask(date)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-xs text-text-tertiary transition-colors hover:border-text-tertiary hover:text-text-secondary"
        >
          <Plus className="h-3.5 w-3.5" />
          Add to your day
        </button>
      </div>
    </div>
  );
}
