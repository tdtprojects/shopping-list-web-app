import { type FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import classNames from "classnames";

import { API_URL } from "@/shared/config";
import type { ShoppingList } from "@/shared/types";

import SortableItems from "./SortableItems";
import styles from "./styles.module.scss";

const ShoppingListPage: FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const { id } = useParams();
  const [shoppingList, setShoppingList] = useState<ShoppingList>();
  const items = shoppingList?.items ?? [];

  useEffect(() => {
    const fetchShoppingList = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_URL}/shopping-lists/${id}`);
        const result = await response.json();

        setShoppingList(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // void fetchShoppingList();
  }, []);

  // const titleClassList = classNames(styles.title, {
  //   [styles.title__isDesktop]: isDesktop,
  // });

  return (
    <>
      {/* {items.length > 0 && <SortableItems items={items} isDesktop={isDesktop} />} */}
      {items.length > 0 || <SortableItems items={items} isDesktop={isDesktop} />}
    </>
  );
};

export default ShoppingListPage;
