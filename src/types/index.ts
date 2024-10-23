export type Column = {
  id: string;
  title: string;
};

export type Task = {
  id: number;
  columnId: string;
  content: string;
};

export type TaskBeingEdited = {
  taskId: number;
  userId: string;
};

export type User = {
  id: string;
};
