import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

export default function useTaskDragSensors() {
  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
}
