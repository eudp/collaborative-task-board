import { useTaskBoard } from "@/context/TaskBoardProvider";

export default function UserList() {
  const { userId, connectedUsers } = useTaskBoard();

  return (
    <div className="p-4 sm:bg-neutral-900 z-10 shadow-lg rounded-md w-64 mr-2">
      <h3 className="hidden sm:flex font-bold mb-2 text-white text-md text-center ">
        Connected Users
      </h3>
      <ul className="space-y-2">
        {Object.values(connectedUsers).map((user) => (
          <li
            role="listitem"
            key={user.id}
            className={`flex items-center p-2 rounded-md transition-all duration-300 ${
              user.id === userId
                ? "bg-green-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center sm:mr-3 text-xs font-bold ${
                user.id === userId ? "bg-green-700" : "bg-gray-600"
              }`}
            >
              {user.id === userId ? "You" : user.id.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:flex font-medium">
              {user.id === userId
                ? "You"
                : `User -  ${user.id.substring(0, 8)}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
