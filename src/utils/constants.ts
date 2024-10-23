import { Column } from "@/types";

export const defaultCols: Array<Column> = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "doing",
    title: "In Progress",
  },
  {
    id: "done",
    title: "Done",
  },
];

export const columnsId = defaultCols.map((col) => col.id);
