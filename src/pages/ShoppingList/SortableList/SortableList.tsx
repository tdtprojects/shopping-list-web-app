import { type FC, useState, useRef, useEffect, useMemo, useCallback } from "react";
import { DragDropContext, type DropResult } from "react-beautiful-dnd";
import { v4, validate as validateV4 } from "uuid";
import { debounce, isNil } from "lodash";

import type { ShoppingListItem, Column as ColumnType } from "@/shared/types";

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
  const itemsRefs = useRef<HTMLTextAreaElement[]>([]);
  const isFirstRender = useRef(true);
  const { shoppingListId, title, updateShoppingListItems } = props;
  const column: ColumnType = useMemo(
    () => ({
      id: shoppingListId,
      title,
    }),
    [shoppingListId, title]
  );

  useEffect(() => {
    const newItem = isFirstRender.current ? null : (
      shoppingListItems.find((item) => !prevShoppingListItemsRef.current.some(({ id }) => id === item.id))
    );

    if (!isNil(newItem)) {
      const newItemRef = itemsRefs.current[newItem.order - 1];
      const { length } = newItemRef.value;

      newItemRef.focus();
      newItemRef.setSelectionRange(length, length);
    }

    prevShoppingListItemsRef.current = shoppingListItems;
    itemsRefs.current = itemsRefs.current.slice(0, shoppingListItems.length);
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
    let order = 0;
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

  const handleItemChange = (event: React.ChangeEvent<HTMLTextAreaElement>, itemId: string): void => {
    const item = shoppingListItems.find((item) => item.id === itemId) as ShoppingListItem;
    const updatedItem = { ...item, text: event.target.value };
    const updatedShoppingListItems = shoppingListItems.map((item) => (item.id === itemId ? updatedItem : item));

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

  const handleNewItemChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const maxOrder = shoppingListItems.length > 0 ? Math.max(...shoppingListItems.map(({ order }) => order)) : 0;

    const newItem = {
      checked: false,
      text: event.target.value,
      id: v4(),
      order: maxOrder + 1,
    };
    const updatedShoppingListItems = [...shoppingListItems, newItem];

    event.target.value = "";

    setShoppingListItems(updatedShoppingListItems);
    updateShoppingList(updatedShoppingListItems);
  };

  const handleItemKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, itemId: string): void => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      const item = shoppingListItems.find((item) => item.id === itemId) as ShoppingListItem;
      const newItem = {
        checked: false,
        text: "",
        id: v4(),
        order: item.order + 1,
      };
      const updatedShoppingListItems = shoppingListItems.reduce((result: ShoppingListItem[], currentValue) => {
        if (currentValue.order === item.order) {
          return [...result, currentValue, newItem];
        }

        if (currentValue.order < item.order) {
          return [...result, currentValue];
        } else {
          return [...result, { ...currentValue, order: currentValue.order + 1 }];
        }
      }, []);

      setShoppingListItems(updatedShoppingListItems);
      updateShoppingList(updatedShoppingListItems);
    }

    if (event.metaKey && event.key === "z") {
      const isItemNew = validateV4(itemId);
      const target = event.target as HTMLTextAreaElement;

      if (isItemNew && target.value.length === 1) {
        const updatedShoppingListItems = shoppingListItems.filter((item) => item.id !== itemId);

        setShoppingListItems(updatedShoppingListItems);
        updateShoppingList(updatedShoppingListItems);
      }
    }
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
        handleItemChange={handleItemChange}
        handleItemRemove={handleItemRemove}
        handleNewItemChange={handleNewItemChange}
        handleCheckboxChange={handleCheckboxChange}
        handleColumnTitleBlur={handleColumnTitleBlur}
        deleteShoppingList={props.deleteShoppingList}
        handleItemKeyDown={handleItemKeyDown}
        itemsRefs={itemsRefs}
      />
    </DragDropContext>
  );
};

export default SortableList;
