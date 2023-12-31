import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Button, CircularProgress } from "@mui/material";
import classNames from "classnames";
import { type FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_URL } from "@/shared/config";
import type { ShoppingList } from "@/shared/types";

import styles from "./Home.module.scss";
import Lists from "./Lists";

const HomePage: FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const navigate = useNavigate();
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShoppingLists = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_URL}/shopping-lists`, {
          credentials: "include",
        });
        const result = await response.json();

        setShoppingLists(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchShoppingLists();
  }, []);

  const handleUnpinShoppingList = async (listId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/shopping-lists/unpin/${listId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.status === 204) {
        const updatedShoppingLists = shoppingLists?.filter((list) => list.id !== listId);

        setShoppingLists(updatedShoppingLists);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleButtonClick = (): void => {
    navigate("/shopping-list/new");
  };

  const rootClassList = classNames(styles.root, {
    [styles.root__isDesktop]: isDesktop,
  });
  const titleClassList = classNames(styles.title, {
    [styles.title__isDesktop]: isDesktop,
  });
  const buttonWrapperClassList = classNames(styles.buttonWrapper, {
    [styles.buttonWrapper__isDesktop]: isDesktop,
  });

  return isLoading ? (
    <div className={styles.progressWrapper}>
      <CircularProgress />
    </div>
  ) : (
    <div className={rootClassList}>
      <h1 className={titleClassList}>
        Welcome to the Shopping List app! Create lists and share them with friends using the link
      </h1>
      <div className={buttonWrapperClassList}>
        <Button variant="contained" onClick={handleButtonClick}>
          Create a new shopping list
        </Button>
      </div>
      <Lists shoppingLists={shoppingLists} handleUnpinShoppingList={handleUnpinShoppingList} />
    </div>
  );
};

export default HomePage;
