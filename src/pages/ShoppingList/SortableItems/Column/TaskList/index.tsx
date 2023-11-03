import React from "react";

import Task from "./Task";

// type Props = {}

const TaskList = React.memo(({ tasks, isDesktop, handleTaskRemove }) => {
  return tasks.map((task, index) => <Task key={task.id} task={task} index={index} isDesktop={isDesktop} handleTaskRemove={handleTaskRemove} />);
});

TaskList.displayName = "TaskList";

export default TaskList;
