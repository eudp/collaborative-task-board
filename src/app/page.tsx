"use client";

import { BoardView } from "@/components/Board";
import { TaskBoardProvider } from "@/context/TaskBoardProvider";

export default function Home() {
  return (
    <TaskBoardProvider>
      <BoardView />
    </TaskBoardProvider>
  );
}
