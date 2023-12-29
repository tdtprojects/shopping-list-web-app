import { type FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { CircularProgress } from "@mui/material";
import classNames from "classnames";

import { API_URL } from "@/shared/config";
import type { ShoppingList, ShoppingListItem } from "@/shared/types";

import SortableList from "./SortableList";
import styles from "./ShoppingList.module.scss";

const defaultState: ShoppingList = {
  id: "",
  title: "",
  items: [],
};

const ShoppingListPage: FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const { id } = useParams();
  const navigate = useNavigate();
  const [shoppingList, setShoppingList] = useState<ShoppingList>(defaultState);
  const [isLoading, setIsLoading] = useState(true);

  const rootClassList = classNames(styles.root, {
    [styles.root__isDesktop]: isDesktop,
  });

  useEffect(() => {
    const fetchShoppingList = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_URL}/shopping-lists/${id}`, {
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();

          setShoppingList(result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchShoppingList();
  }, [id]);

  const updateShoppingListItems = async (items: ShoppingListItem[]): Promise<void> => {
    try {
      await fetch(`${API_URL}/shopping-lists/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateShoppingListTitle = async (title: string): Promise<void> => {
    try {
      await fetch(`${API_URL}/shopping-lists/${id}/title`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteShoppingList = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/shopping-lists/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 204) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return isLoading ? (
    <div className={styles.progressWrapper}>
      <CircularProgress />
    </div>
  ) : (
    shoppingList.id.length > 0 && (
      <div className={rootClassList}>
        <SortableList
          itemList={shoppingList.items}
          title={shoppingList.title}
          isDesktop={isDesktop}
          shoppingListId={shoppingList.id}
          updateShoppingListItems={updateShoppingListItems}
          updateShoppingListTitle={updateShoppingListTitle}
          deleteShoppingList={deleteShoppingList}
        />
      </div>
    )
  );
};

export default ShoppingListPage;
