import { type FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { API_URL } from "@/shared/config";
import type { ShoppingList, ShoppingListItem } from "@/shared/types";

import SortableList from "./SortableList";

const defaultState: ShoppingList = {
  id: "",
  title: "",
  items: [],
};

const ShoppingListPage: FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const { id } = useParams();
  const [shoppingList, setShoppingList] = useState<ShoppingList>(defaultState);

  const fetchShoppingList = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/shopping-lists/${id}`);

      if (response.ok) {
        const result = await response.json();

        setShoppingList(result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    void fetchShoppingList();
  }, []);

  const createShoppingListItem = async (item: ShoppingListItem): Promise<void> => {
    try {
      await fetch(`${API_URL}/shopping-lists/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteShoppingListItem = async (itemId: string): Promise<void> => {
    try {
      await fetch(`${API_URL}/shopping-lists/${id}/${itemId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    shoppingList.items.length > 0 && (
      <SortableList
        items={shoppingList.items}
        title={shoppingList.title}
        isDesktop={isDesktop}
        shoppingListId={shoppingList.id}
        createShoppingListItem={createShoppingListItem}
        deleteShoppingListItem={deleteShoppingListItem}
      />
    )
  );
};

export default ShoppingListPage;
