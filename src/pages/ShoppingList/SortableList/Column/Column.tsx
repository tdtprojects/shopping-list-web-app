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
  lastItemRef: Ref<HTMLDivElement>;
  column: ColumnType;
  handleItemRemove: (itemId: string) => void;
  handleItemInput: (e: React.ChangeEvent<HTMLDivElement>, itemId: string) => void;
  handleNewItemInput: (e: React.ChangeEvent<HTMLDivElement>) => void;
  handleItemBlur: (e: React.ChangeEvent<HTMLDivElement>) => void;
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
                handleItemInput={props.handleItemInput}
                handleItemRemove={props.handleItemRemove}
                handleItemBlur={props.handleItemBlur}
                handleCheckboxChange={props.handleCheckboxChange}
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
