"use client";

import { MoreHorizontal, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getCategoryConfig } from "@/config/categories";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task } from "@prisma/client";

interface TimeBlockProps {
  task: Pick<
    Task,
    | "id"
    | "title"
    | "category"
    | "status"
    | "timeBlockMinutes"
    | "scheduledTime"
  >;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onComplete?: (id: string) => void;
  isDragging?: boolean;
}

export function TimeBlock({
  task,
  onEdit,
  onDelete,
  onComplete,
  isDragging,
}: TimeBlockProps) {
  const isCompleted = task.status === "DONE";
  const categoryConfig = getCategoryConfig(task.category);

  return (
    <div
      className={cn(
        "group flex h-full items-center gap-2 rounded-lg border p-2 transition-all border-l-4",
        isCompleted
          ? "border-green-500/20 bg-green-500/5 opacity-60"
          : "bg-surface hover:bg-surface-elevated",
        isDragging && "shadow-lg ring-2 ring-accent",
      )}
      style={!isCompleted ? { borderLeftColor: categoryConfig.color } : undefined}
    >
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center px-4 gap-2">
          {isCompleted && (
            <Check className="h-3.5 w-3.5 shrink-0 text-green-400/70" />
          )}
          <p
            className={cn(
              "text-sm font-medium truncate",
              isCompleted && "line-through text-text-tertiary",
            )}
          >
            {task.title}
          </p>
          <span className="shrink-0 text-xs text-text-tertiary">
            {task.timeBlockMinutes}m
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isCompleted && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-green-400 hover:text-green-500"
            onClick={() => onComplete?.(task.id)}
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(task.id)}>
              Edit task
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-400"
              onClick={() => onDelete?.(task.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
