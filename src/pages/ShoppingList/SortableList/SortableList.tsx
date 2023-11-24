import { type FC, useState, useRef, useEffect, useMemo, useCallback } from "react";
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
  updateShoppingListItems: (items: ShoppingListItem[]) => Promise<void>;
  updateShoppingListTitle: (title: string) => Promise<void>;
  deleteShoppingList: (id: string) => Promise<void>;
}

const SortableList: FC<Props> = (props) => {
  const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItem[]>(props.itemList);
  const prevShoppingListItemsRef = useRef<ShoppingListItem[]>([]);
  const lastItemRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const activeEditableDivRef = useRef<HTMLDivElement | null>(null);
  const savedSelectionRef = useRef<SelectionType>(null);
  const { shoppingListId, title } = props;

  const { updateShoppingListItems } = props;
  const column: ColumnType = useMemo(
    () => ({
      id: shoppingListId,
      title,
    }),
    [shoppingListId, title]
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

    if (!isNil(savedSelectionRef.current)) {
      restoreSelection(savedSelectionRef.current);
    }
  }, [shoppingListItems]);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateShoppingList = useCallback(
    debounce(
      (items) => {
        void props.updateShoppingListItems(items);
      },
      1000,
      { leading: true, maxWait: 3500, trailing: true }
    ),
    [debounce, updateShoppingListItems]
  );

  const handleDragUpdate = (): void => {
    if ("vibrate" in navigator) {
      navigator.vibrate(100);
    }
  };

  const handleDragEnd = (result: DropResult): void => {
    const { destination, source, draggableId } = result;

    if (isNil(destination)) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const draggableItem = shoppingListItems.find(({ id }) => id === draggableId);
    const updatedShoppingListItems = shoppingListItems.filter((item) => item.id !== draggableId);

    if (!isNil(draggableItem)) {
      updatedShoppingListItems.splice(destination.index, 0, draggableItem);

      updatedShoppingListItems.forEach((item, index) => {
        item.order = index + 1;
      });
    }

    setShoppingListItems(updatedShoppingListItems);
    updateShoppingList(updatedShoppingListItems);
  };

  const handleItemRemove = (itemId: string): void => {
    let order: number = 0;
    const updatedShoppingListItems = shoppingListItems.reduce((result: ShoppingListItem[], currentItem) => {
      if (currentItem.id !== itemId) {
        order += 1;

        return [...result, { ...currentItem, order }];
      } else {
        return result;
      }
    }, []);

    setShoppingListItems(updatedShoppingListItems);
    updateShoppingList(updatedShoppingListItems);
  };

  const saveSelection = (): SelectionType => {
    const selection = window.getSelection();

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
    if (!isNil(activeEditableDivRef.current) && activeEditableDivRef.current.childNodes.length > 0) {
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

  const handleItemBlur = (): void => {
    activeEditableDivRef.current = null;
    savedSelectionRef.current = null;
  };

  const handleItemInput = (event: React.ChangeEvent<HTMLDivElement>, itemId: string): void => {
    const target = event.target as HTMLDivElement;

    activeEditableDivRef.current = target;

    const item = shoppingListItems.find((item) => item.id === itemId) as ShoppingListItem;
    const updatedItem = { ...item, text: event.target?.textContent ?? "" };
    const updatedShoppingListItems = shoppingListItems.map((item) => (item.id === itemId ? updatedItem : item));

    if (document.activeElement === target) {
      const savedSelection: SelectionType = saveSelection();

      savedSelectionRef.current = savedSelection;
    }

    setShoppingListItems(updatedShoppingListItems);
    updateShoppingList(updatedShoppingListItems);
  };

  const handleCheckboxChange = (itemId: string, value: boolean): void => {
    const updatedShoppingListItems = shoppingListItems.map((item) =>
      item.id === itemId ? { ...item, checked: value } : item
    );

    setShoppingListItems(updatedShoppingListItems);
    updateShoppingList(updatedShoppingListItems);
  };

  const handleNewItemInput = (event: React.ChangeEvent<HTMLDivElement>): void => {
    const maxOrder = shoppingListItems.length > 0 ? Math.max(...shoppingListItems.map(({ order }) => order)) : 0;

    const newItem = {
      checked: false,
      text: event.currentTarget.textContent ?? "",
      id: v4(),
      order: maxOrder + 1,
    };
    const updatedShoppingListItems = [...shoppingListItems, newItem];

    event.currentTarget.textContent = "";

    setShoppingListItems(updatedShoppingListItems);
    updateShoppingList(updatedShoppingListItems);
  };

  const handleColumnTitleBlur = (event: React.FocusEvent<HTMLTextAreaElement>): void => {
    const title = event.target.value;

    void props.updateShoppingListTitle(title);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd} onDragUpdate={handleDragUpdate}>
      <Column
        key={column.id}
        column={column}
        itemList={shoppingListItems}
        isDesktop={props.isDesktop}
        handleItemInput={handleItemInput}
        handleItemRemove={handleItemRemove}
        handleNewItemInput={handleNewItemInput}
        handleItemBlur={handleItemBlur}
        handleCheckboxChange={handleCheckboxChange}
        handleColumnTitleBlur={handleColumnTitleBlur}
        deleteShoppingList={props.deleteShoppingList}
        lastItemRef={lastItemRef}
      />
    </DragDropContext>
  );
};

export default SortableList;
