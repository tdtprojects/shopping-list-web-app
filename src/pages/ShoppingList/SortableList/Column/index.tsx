import classNames from "classnames";

import NewTask from "./TaskList/NewTask";
import StrictModeDroppable from "./StrictModeDroppable";
import TaskList from "./TaskList";
import styles from "./styles.module.scss";

const Column = ({ column, items, isDesktop, handleItemRemove, handleNewItemInput, lastItemRef }) => {
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
              <TaskList
                items={items}
                isDesktop={isDesktop}
                handleItemRemove={handleItemRemove}
                lastItemRef={lastItemRef}
              />
              {provided.placeholder}
              <NewTask handleNewItemInput={handleNewItemInput} />
            </div>
          );
        }}
      </StrictModeDroppable>
    </div>
  );
};

export default Column;
