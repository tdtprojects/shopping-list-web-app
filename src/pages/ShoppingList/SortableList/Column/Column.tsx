import { type FC, type Ref } from "react";
import classNames from "classnames";
import TextField from "@mui/material/TextField";

import type { ShoppingListItem, Column as ColumnType } from "@/shared/types";

import NewItem from "./ItemList/NewItem";
import StrictModeDroppable from "./StrictModeDroppable";
import ItemList from "./ItemList";
import Header from "./Header";
import styles from "./styles.module.scss";

interface Props {
  itemList: ShoppingListItem[];
  isDesktop: boolean;
  lastItemRef: Ref<HTMLTextAreaElement>;
  column: ColumnType;
  handleItemRemove: (itemId: string) => void;
  handleItemChange: (e: React.ChangeEvent<HTMLTextAreaElement>, itemId: string) => void;
  handleNewItemChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleCheckboxChange: (itemId: string, value: boolean) => void;
  handleColumnTitleBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  deleteShoppingList: (id: string) => Promise<void>;
}

const Column: FC<Props> = (props) => {
  const rootClassList = classNames(styles.root, {
    [styles.root__isDesktop]: props.isDesktop,
  });

  return (
    <div className={rootClassList}>
      <Header deleteShoppingList={props.deleteShoppingList} isDesktop={props.isDesktop} columnId={props.column.id} />
      <TextField
        multiline
        fullWidth
        className={styles.title}
        defaultValue={props.column.title}
        onBlur={props.handleColumnTitleBlur}
        placeholder="Title"
      />
      <StrictModeDroppable droppableId={props.column.id}>
        {(provided) => {
          const taskListClassList = classNames({
            [styles.taskList__isDesktop]: props.isDesktop,
          });

          return (
            <div className={taskListClassList} {...provided.droppableProps} ref={provided.innerRef}>
              <ItemList
                itemList={props.itemList}
                isDesktop={props.isDesktop}
                handleItemChange={props.handleItemChange}
                handleItemRemove={props.handleItemRemove}
                handleCheckboxChange={props.handleCheckboxChange}
                lastItemRef={props.lastItemRef}
              />
              {provided.placeholder}
              <NewItem handleNewItemChange={props.handleNewItemChange} />
            </div>
          );
        }}
      </StrictModeDroppable>
    </div>
  );
};

export default Column;
