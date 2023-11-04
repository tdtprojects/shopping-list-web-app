import React from "react";

import Task from "./Task";

// type Props = {}

const TaskList = React.memo(
  ({ items, isDesktop, handleItemRemove, lastItemRef }) => {
    return (
      <>
        {items.map((item, index) => (
          <Task
            key={item.id}
            item={item}
            index={index}
            isDesktop={isDesktop}
            handleItemRemove={handleItemRemove}
            isLast={index === items.length - 1}
            lastItemRef={lastItemRef}
          />
        ))}
      </>
    );
  }
);

TaskList.displayName = "TaskList";

export default TaskList;
