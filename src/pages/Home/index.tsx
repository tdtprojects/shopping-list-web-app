import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Button } from "@mui/material";
import classNames from "classnames";
import { type FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_URL } from "@/shared/config";
import styles from "./styles.module.scss";

const HomePage: FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const navigate = useNavigate();
  const [shoppingLists, setShoppingLists] = useState([]);

  useEffect(() => {
    const fetchShoppingLists = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_URL}/shopping-lists`);
        const result = await response.json();

        setShoppingLists(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    void fetchShoppingLists();
  }, [API_URL]);

  const handleButtonClick = (): void => {
    navigate("/shopping-list/new");
  };

  const titleClassList = classNames(styles.title, {
    [styles.title__isDesktop]: isDesktop,
  });
  const buttonWrapperClassList = classNames(styles.buttonWrapper, {
    [styles.buttonWrapper__isDesktop]: isDesktop,
  });
  console.log(shoppingLists);

  return (
    <>
      <h1 className={titleClassList}>
        Welcome to the Shopping List app! Create lists and share them with friends using the link
      </h1>
      <div className={buttonWrapperClassList}>
        <Button variant="contained" onClick={handleButtonClick}>
          Create a new shopping list
        </Button>
      </div>
    </>
  );
};

export default HomePage;
