import { render, screen } from "@testing-library/react";
import UserList from "../src/components/Board/UserList";
import { useTaskBoard } from "../src/context/TaskBoardProvider";

const mockConnectedUsers = {
  user1: { id: "user1" },
  user2: { id: "user2" },
  user3: { id: "user3" },
};

describe("UserList Component", () => {
  beforeEach(() => {
    (useTaskBoard as jest.Mock).mockReturnValue({
      userId: "user1",
      connectedUsers: mockConnectedUsers,
    });
  });

  test("renders connected users correctly", () => {
    render(<UserList />);

    const userItems = screen.getAllByRole("listitem");
    expect(userItems).toHaveLength(3);

    expect(userItems[0]).toHaveTextContent("You");

    expect(userItems[1]).toHaveTextContent("User - user2");
    expect(userItems[2]).toHaveTextContent("User - user3");
  });

  test("highlights the current user", () => {
    render(<UserList />);

    const currentUserElement = screen.getAllByRole("listitem")[0];
    expect(currentUserElement).toHaveClass("bg-green-500");

    const otherUserElement = screen.getByText("User - user2");
    expect(otherUserElement).not.toHaveClass("bg-green-500");
  });
});
