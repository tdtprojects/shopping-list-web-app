import { type FC, useState, useRef, useEffect, useCallback, useMemo } from "react";
import { DragDropContext, type DropResult } from "react-beautiful-dnd";
import { v4 } from "uuid";
import { debounce, isNil } from "lodash";

import type { ShoppingListItem, Column as ColumnType, SelectionType } from "@/shared/types";

import Column from "./Column";

interface Props {
  itemList: ShoppingListItem[];
  title: string;
  shoppingListId: string;
  isDesktop: boolean;
  createShoppingListItem: (item: ShoppingListItem) => Promise<void>;
  updateShoppingListItem: (item: ShoppingListItem) => Promise<void>;
  deleteShoppingListItem: (itemId: string) => Promise<void>;
  updateShoppingList: (list: ShoppingListItem[]) => Promise<void>;
}

const SortableList: FC<Props> = (props) => {
  const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItem[]>(props.itemList);
  const prevShoppingListItemsRef = useRef<ShoppingListItem[]>([]);
  const lastItemRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const activeEditableDivRef = useRef<HTMLDivElement | null>(null);
  const savedSelectionRef = useRef<SelectionType>(null);

  const column: ColumnType = useMemo(
    () => ({
      id: props.shoppingListId,
      title: props.title,
    }),
    [props.shoppingListId, props.title]
  );

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

    if (savedSelectionRef.current !== null) {
      restoreSelection(savedSelectionRef.current);
    }
  }, [shoppingListItems]);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  const debouncedListUpdate = useCallback(
    debounce(
      (list) => {
        void props.updateShoppingList(list);
      },
      1000,
      { leading: true, maxWait: 3500, trailing: true }
    ),
    []
  );

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

    setShoppingListItems(updatedShoppingListItems);
    debouncedListUpdate(updatedShoppingListItems);
  };

  const saveSelection = (): SelectionType => {
    const selection = window.getSelection();
    console.log(selection);

    if (!isNil(selection) && !isNil(activeEditableDivRef.current)) {
      const range = selection.getRangeAt(0);
      const preSelectionRange = range.cloneRange();

      preSelectionRange.selectNodeContents(activeEditableDivRef.current);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);

      const start = preSelectionRange.toString().length;

      return { start, end: start + range.toString().length };
    }
    return null;
  };

  const restoreSelection = (savedSelection: { start: number; end: number }): void => {
    if (!isNil(activeEditableDivRef.current) && (Number(activeEditableDivRef.current.childNodes.length)) > 0) {
      const { start } = savedSelection;
      const charIndex = 0;
      const range = document.createRange();
      range.setStart(activeEditableDivRef.current.childNodes[charIndex], start);
      range.collapse(true);

      const selection = window.getSelection();

      if (!isNil(selection)) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  const handleItemBlur = (event: React.ChangeEvent<HTMLDivElement>): void => {
    activeEditableDivRef.current = null;
    savedSelectionRef.current = null;
  };

  const handleItemInput = (event: React.ChangeEvent<HTMLDivElement>, itemId: string): void => {
    const target = event.target as HTMLDivElement;
    activeEditableDivRef.current = target;

    const item = shoppingListItems.find((item) => item.id === itemId) as ShoppingListItem;
    const updatedItem = { ...item, text: event.target?.textContent ?? "" };

    const updatedShoppingListItems = shoppingListItems.map((item) =>
      item.id === itemId ? updatedItem : item
    );

    if (document.activeElement === target) {
      const savedSelection: SelectionType = saveSelection();

      savedSelectionRef.current = savedSelection;
    }

    setShoppingListItems(updatedShoppingListItems);
    debouncedListUpdate(updatedShoppingListItems);
  };

  const handleNewItemInput = (event: React.ChangeEvent<HTMLDivElement>): void => {
    const maxOrder = Math.max(...shoppingListItems.map(({ order }) => order));
    const newItem = {
      checked: false,
      text: event.currentTarget.textContent ?? "",
      id: v4(),
      order: maxOrder + 1,
    };
    const updatedShoppingListItems = [...shoppingListItems, newItem];

    event.currentTarget.textContent = "";

    setShoppingListItems(updatedShoppingListItems);
    debouncedListUpdate(updatedShoppingListItems);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Column
        key={column.id}
        column={column}
        itemList={shoppingListItems}
        isDesktop={props.isDesktop}
        handleItemInput={handleItemInput}
        handleItemRemove={handleItemRemove}
        handleNewItemInput={handleNewItemInput}
        handleItemBlur={handleItemBlur}
        lastItemRef={lastItemRef}
      />
    </DragDropContext>
  );
};

export default SortableList;
