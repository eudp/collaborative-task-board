import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { firebaseSet, firebaseRemove } from "@/services/firebaseService";
import {
  DndContext,
  DragCancelEvent,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { Task } from "@/types";
import { useTaskDragSensors } from "@/hooks";
import { useTaskBoard } from "@/context/TaskBoardProvider";
import TaskItem from "./TaskItem";
import UserList from "./UserList";
import ColumnsView from "./ColumnsView";

export default function BoardView() {
  const [activeTaskDrag, setActiveTaskDrag] = useState<Task | null>(null);
  const sensors = useTaskDragSensors();
  const { userId, tasks } = useTaskBoard();

  const onDragStart = useCallback(
    (event: DragStartEvent) => {
      if (event.active.data.current?.type === "Task") {
        setActiveTaskDrag(event.active.data.current.task);
        firebaseSet(`activeTasks/${event.active.id}`, {
          userId,
          taskId: event.active.id,
        });
      }
    },
    [userId]
  );

  const onDragEnd = useCallback((event: DragEndEvent) => {
    setActiveTaskDrag(null);
    firebaseRemove(`activeTasks/${event.active.id}`);
  }, []);

  const onDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;

      // If there is no drop target, exit early
      if (!over) return;

      const activeId = active.id;
      const overId = over.id;

      // Exit if dragging an item over itself
      if (activeId === overId) return;

      const isActiveATask = active.data.current?.type === "Task";
      const isOverATask = over.data.current?.type === "Task";
      const isOverAColumn = over.data.current?.type === "Column";

      // If the dragged item is not a task, exit
      if (!isActiveATask) return;

      const activeIndex = tasks.findIndex((task) => task.id === activeId);

      // Dropping a task over another task
      if (isOverATask) {
        const overIndex = tasks.findIndex((task) => task.id === overId);

        // If the task is moved to a different column
        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          const updatedTasks = arrayMove(tasks, activeIndex, overIndex - 1);
          firebaseSet("tasks", updatedTasks);
          return;
        }

        // Task is moved within the same column
        const updatedTasks = arrayMove(tasks, activeIndex, overIndex);
        firebaseSet("tasks", updatedTasks);
        return;
      }

      // Dropping a task over a column
      if (isOverAColumn) {
        tasks[activeIndex].columnId = overId as string;
        const updatedTasks = arrayMove(tasks, activeIndex, activeIndex);
        firebaseSet("tasks", updatedTasks);
      }
    },
    [tasks]
  );

  const onDragCancel = useCallback((event: DragCancelEvent) => {
    firebaseRemove(`activeTasks/${event.active.id}`);
  }, []);

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <UserList />
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDragCancel={onDragCancel}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <ColumnsView />
          </div>
        </div>

        {typeof document !== "undefined" &&
          createPortal(
            <DragOverlay>
              {activeTaskDrag && <TaskItem task={activeTaskDrag} />}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </div>
  );
}
