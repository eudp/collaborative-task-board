import { useMemo } from "react";
import { SortableContext } from "@dnd-kit/sortable";
import { columnsId, defaultCols } from "@/utils/constants";
import { useTaskBoard } from "@/context/TaskBoardProvider";
import Column from "./Column";

export default function ColumnsView() {
  const { tasks } = useTaskBoard();
  const filteredColumns = useMemo(() => {
    return defaultCols.map((col) => ({
      ...col,
      tasks: tasks.filter((task) => task.columnId === col.id),
    }));
  }, [tasks]);

  return (
    <SortableContext items={columnsId}>
      {filteredColumns.map((col) => (
        <Column key={col.id} column={col} filteredTasks={col.tasks} />
      ))}
    </SortableContext>
  );
}
