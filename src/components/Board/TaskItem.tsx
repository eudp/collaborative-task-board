import { useCallback, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { firebaseSet, firebaseRemove } from "@/services/firebaseService";
import type { Task } from "@/types";
import { useTaskBoard } from "@/context/TaskBoardProvider";
import { IconTrash } from "../common/icons";

export default function TaskItem({ task }: { task: Task }) {
  const { userId, updateTask, deleteTask, tasksBeignEdited } = useTaskBoard();
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
    disabled: editMode,
  });

  const isEditedByOtherUser =
    tasksBeignEdited[task.id] && tasksBeignEdited[task.id].userId !== userId;

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isEditedByOtherUser ? 0.4 : 1,
  };

  const listenersOnState = !isEditedByOtherUser ? { ...listeners } : undefined;

  const registerActiveTask = useCallback(
    (prevEditMode: boolean) => {
      if (!prevEditMode) {
        firebaseSet(`activeTasks/${task.id}`, { userId, taskId: task.id });
      } else {
        firebaseRemove(`activeTasks/${task.id}`);
      }
    },
    [task.id, userId]
  );

  const toggleEditMode = useCallback(() => {
    if (isEditedByOtherUser) return;
    setEditMode((prevEditMode) => {
      registerActiveTask(prevEditMode);
      return !prevEditMode;
    });
    setMouseIsOver(false);
  }, [registerActiveTask, isEditedByOtherUser]);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-neutral-950 p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-emerald-500  cursor-grab relative"
      />
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listenersOnState}
        className="bg-neutral-950 p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-emerald-500 cursor-grab relative"
      >
        <textarea
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
          onFocus={(e) => {
            const val = e.target.value;
            e.target.value = "";
            e.target.value = val;
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listenersOnState}
      onClick={toggleEditMode}
      className="bg-neutral-950 p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-emerald-500 cursor-grab relative task"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      <p className="break-words	my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>

      {isEditedByOtherUser && (
        <div className="absolute top-1 right-1 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff9800]" />
          <span className="text-xs text-white">
            {tasksBeignEdited[task.id].userId.substring(0, 8)} is editing
          </span>
        </div>
      )}

      {mouseIsOver && (
        <button
          data-testid="delete-task-button"
          onClick={() => deleteTask(task.id)}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-neutral-900 p-2 rounded opacity-60 hover:opacity-100"
        >
          <IconTrash />
        </button>
      )}
    </div>
  );
}
