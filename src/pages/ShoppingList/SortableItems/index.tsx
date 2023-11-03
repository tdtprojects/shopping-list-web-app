import { type FC, useState } from "react";
// import { ReactSortable } from "react-sortablejs";
import classNames from "classnames";
import { DragIndicator, Close } from "@mui/icons-material";
import { DragDropContext } from "react-beautiful-dnd";

import type { ShoppingListItem } from "@/shared/types";

import Column from "./Column";
import styles from "./styles.module.scss";

interface Props {
  items: ShoppingListItem[];
  isDesktop: boolean;
}

const initialData = {
  tasks: {
    "task-1": { id: "task-1", content: "Take out the garbage" },
    "task-2": { id: "task-2", content: "Watch my favorite show" },
    "task-3": { id: "task-3", content: "Charge my phone" },
    "task-4": { id: "task-4", content: "Cook dinner" },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To do",
      taskIds: ["task-1", "task-2", "task-3", "task-4"],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ["column-1"],
};

const SortableItems: FC<Props> = ({ items, isDesktop }) => {
  // const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItem[]>(items);
  const [data, setData] = useState(initialData);

  const itemClassList = classNames(styles.item, {
    [styles.item__isDesktop]: isDesktop,
  });

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const column = data.columns[source.droppableId];
    const newTaskIds = Array.from(column.taskIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    };

    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [newColumn.id]: newColumn,
      },
    };

    setData(newData);
  };

  const handleDragStart = (event) => {
    // event.preventDefault();
  };

  const handleDragUpdate = () => {};

  const handleTaskRemove = (id) => {
    const updatedData = {
      ...data,
      columns: {
        ...data.columns,
        ["column-1"]: {
          ...data.columns["column-1"],
          taskIds: data.columns["column-1"].taskIds.filter((taskId) => taskId !== id),
        },
      },
    };

    setData(updatedData);
  };

  const handleTaskCreate = (task) => {
    
  };

  return (
    <DragDropContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragUpdate={handleDragUpdate}
    >
      {data.columnOrder.map((columnId) => {
        const column = data.columns[columnId];
        const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

        return (
          <Column
            key={column.id}
            column={column}
            tasks={tasks}
            isDesktop={isDesktop}
            handleTaskRemove={handleTaskRemove}
          />
        );
      })}
    </DragDropContext>
  );
};

export default SortableItems;
