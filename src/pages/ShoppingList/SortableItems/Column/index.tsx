import classNames from "classnames";

import StrictModeDroppable from "./StrictModeDroppable";
import TaskList from "./TaskList";
import styles from "./styles.module.scss";

const Column = ({ column, tasks, isDesktop, handleTaskRemove }) => {
  const rootClassList = classNames(styles.root, {
    [styles.root__isDesktop]: isDesktop,
  });

  return (
    <div className={rootClassList}>
      <h3 className={styles.title}>{column.title}</h3>
      <StrictModeDroppable droppableId={column.id}>
        {(provided, snapshot) => {
          const taskListClassList = classNames(styles.taskList, {
            [styles.taskList__isDesktop]: isDesktop,
            [styles.taskList__isDraggingOver]: snapshot.isDraggingOver,
          });

          return (
            <div className={taskListClassList} {...provided.droppableProps} ref={provided.innerRef}>
              <TaskList tasks={tasks} isDesktop={isDesktop} handleTaskRemove={handleTaskRemove} />
              {provided.placeholder}
            </div>
          );
        }}
      </StrictModeDroppable>
    </div>
  );
};

export default Column;
