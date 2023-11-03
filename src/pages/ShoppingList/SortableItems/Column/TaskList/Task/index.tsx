import { Draggable } from "react-beautiful-dnd";
import { DragIndicator, Close } from "@mui/icons-material";
import classNames from "classnames";

import Checkbox from "./Checkbox";
import styles from "./styles.module.scss";

const Task = ({ task, index, isDesktop, handleTaskRemove }) => {
  const dragIconWrapperClassList = classNames(styles.dragIconWrapper, {
    [styles.dragIconWrapper__isDesktop]: isDesktop,
  });
  const contentClassList = classNames(styles.content, {
    [styles.content__isDesktop]: isDesktop,
  });

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => {
        const rootClassList = classNames(styles.root, {
          [styles.root__isDragging]: snapshot.isDragging,
        });
        const transform = provided.draggableProps.style?.transform ?? null;
        const draggableProps = { ...provided.draggableProps };

        if (typeof transform === "string") {
          // eslint-disable-next-line
          // @ts-ignore
          draggableProps.style = {
            ...draggableProps.style,
            transform: transform.replace(/\([-+]*\d+px,\s/, "(0px, "),
          };
        }

        return (
          <div className={rootClassList} {...draggableProps} ref={provided.innerRef}>
            <span {...provided.dragHandleProps} className={dragIconWrapperClassList}>
              <DragIndicator />
            </span>
            <Checkbox index={index} />
            <div
              className={contentClassList}
              contentEditable="true"
              aria-multiline="true"
              spellCheck="false"
              suppressContentEditableWarning={true}
            >
              {task.content}
            </div>
            <span className={styles.closeIconWrapper}>
              <Close onClick={() => handleTaskRemove(task.id)} />
            </span>
          </div>
        );
      }}
    </Draggable>
  );
};

export default Task;
