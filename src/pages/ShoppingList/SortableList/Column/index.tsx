import type { FC, Ref } from "react";
import classNames from "classnames";

import NewItem from "./ItemList/NewItem";
import StrictModeDroppable from "./StrictModeDroppable";
import ItemList from "./ItemList";
import type { ShoppingListItem, Column as ColumnType } from "@/shared/types";
import styles from "./styles.module.scss";

interface Props {
  itemList: ShoppingListItem[];
  isDesktop: boolean;
  lastItemRef: Ref<HTMLDivElement>;
  column: ColumnType;
  handleItemRemove: (itemId: string) => void;
  handleNewItemInput: (e: React.ChangeEvent<HTMLDivElement>) => void;
}

const Column: FC<Props> = (props) => {
  const rootClassList = classNames(styles.root, {
    [styles.root__isDesktop]: props.isDesktop,
  });

  return (
    <div className={rootClassList}>
      <h3 className={styles.title}>{props.column.title}</h3>
      <StrictModeDroppable droppableId={props.column.id}>
        {(provided, snapshot) => {
          const taskListClassList = classNames(styles.taskList, {
            [styles.taskList__isDesktop]: props.isDesktop,
            [styles.taskList__isDraggingOver]: snapshot.isDraggingOver,
          });

          return (
            <div className={taskListClassList} {...provided.droppableProps} ref={provided.innerRef}>
              <ItemList
                itemList={props.itemList}
                isDesktop={props.isDesktop}
                handleItemRemove={props.handleItemRemove}
                lastItemRef={props.lastItemRef}
              />
              {provided.placeholder}
              <NewItem handleNewItemInput={props.handleNewItemInput} />
            </div>
          );
        }}
      </StrictModeDroppable>
    </div>
  );
};

export default Column;