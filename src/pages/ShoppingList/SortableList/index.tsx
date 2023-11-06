import { type FC, useState, useRef, useEffect } from "react";
import { DragDropContext, type DropResult } from "react-beautiful-dnd";
import { v4 } from "uuid";

import type { ShoppingListItem, Column as ColumnType } from "@/shared/types";

import Column from "./Column";

interface Props {
  itemList: ShoppingListItem[];
  title: string;
  shoppingListId: string;
  isDesktop: boolean;
  createShoppingListItem: (item: ShoppingListItem) => Promise<void>;
  deleteShoppingListItem: (itemId: string) => Promise<void>;
}

const SortableList: FC<Props> = (props) => {
  const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItem[]>(props.itemList);
  const prevShoppingListItemsRef = useRef<ShoppingListItem[]>([]);
  const lastItemRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const column: ColumnType = {
    id: props.shoppingListId,
    title: props.title,
  };

  useEffect(() => {
    const hasNewShoppingItemAdded = isFirstRender.current
      ? false
      : shoppingListItems.length > Number(prevShoppingListItemsRef?.current?.length);

    if (hasNewShoppingItemAdded) {
      lastItemRef.current?.focus();

      const selection = window.getSelection() as Selection;
      const range = document.createRange();
      const textNode: Text = lastItemRef.current?.firstChild as Text;

      range.setStart(textNode, textNode.length);
      range.setEnd(textNode, textNode.length);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    prevShoppingListItemsRef.current = shoppingListItems;
  }, [shoppingListItems]);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  const handleDragEnd = (result: DropResult): void => {
    const { destination, source, draggableId } = result;

    if (destination === null || destination === undefined) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const draggableItem = shoppingListItems.find(({ id }) => id === draggableId);
    const updatedShoppingListItems = shoppingListItems.filter((item) => item.id !== draggableId);

    if (draggableItem !== undefined) {
      updatedShoppingListItems.splice(destination.index, 0, draggableItem);
    }

    setShoppingListItems(updatedShoppingListItems);
  };

  const handleItemRemove = (itemId: string): void => {
    const updatedShoppingListItems = shoppingListItems.filter(({ id }) => id !== itemId);

    void props.deleteShoppingListItem(itemId);
    setShoppingListItems(updatedShoppingListItems);
  };

  const handleNewItemInput = (e: React.ChangeEvent<HTMLDivElement>): void => {
    const newItem = {
      listId: props.shoppingListId,
      checked: false,
      text: e.currentTarget.textContent ?? "",
      id: v4(),
    };
    const updatedShoppingListItems = [...shoppingListItems, newItem];

    e.currentTarget.textContent = "";
    void props.createShoppingListItem(newItem);
    setShoppingListItems(updatedShoppingListItems);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Column
        key={column.id}
        column={column}
        itemList={shoppingListItems}
        isDesktop={props.isDesktop}
        handleItemRemove={handleItemRemove}
        handleNewItemInput={handleNewItemInput}
        lastItemRef={lastItemRef}
      />
    </DragDropContext>
  );
};

export default SortableList;
