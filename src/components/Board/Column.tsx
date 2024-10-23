import { useMemo } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Column, Task } from "@/types";
import { useTaskBoard } from "@/context/TaskBoardProvider";
import { IconPlus } from "../common/icons";
import TaskCard from "./TaskItem";

export default function Column({
  column,
  filteredTasks,
}: {
  column: Column;
  filteredTasks: Array<Task>;
}) {
  const { createTask } = useTaskBoard();

  const tasksIds = useMemo(() => {
    return filteredTasks.map((task) => task.id);
  }, [filteredTasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: true,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-neutral-900 opacity-40 border-2 border-pink-500 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-neutral-900 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        className="bg-neutral-950 text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-neutral-900 border-4 flex items-center justify-between"
      >
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-neutral-900 px-2 py-1 text-sm rounded-full">
            {filteredTasks.length}
          </div>
          {column.title}
        </div>
      </div>

      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
      <button
        className="flex gap-2 items-center border-neutral-900 border-2 rounded-md p-4 border-x-neutral-900 hover:bg-neutral-800 hover:text-white active:bg-black"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <IconPlus />
        Add task
      </button>
    </div>
  );
}
