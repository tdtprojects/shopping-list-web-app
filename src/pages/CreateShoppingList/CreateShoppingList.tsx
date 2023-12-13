import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import classNames from "classnames";

import { API_URL } from "@/shared/config";
import styles from "./styles.module.scss";

const CreateShoppingListPage: FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const [shoppingListName, setShoppingListName] = useState("");
  const navigate = useNavigate();
  const isButtonDisabled = shoppingListName.trim().length === 0;

  const createShoppingList = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/shopping-lists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: shoppingListName }),
      });

      if (response.ok) {
        const data = await response.json();

        navigate(`/shopping-list/${data.id}`);
        setShoppingListName("");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();

    void createShoppingList();
  };

  const rootClassList = classNames(styles.root, {
    [styles.root__isDesktop]: isDesktop,
  });

  return (
    <form className={rootClassList} onSubmit={handleSubmit}>
      <TextField
        label="Shopping List Name"
        variant="outlined"
        value={shoppingListName}
        onChange={(e) => {
          setShoppingListName(e.target.value);
        }}
        required
        autoFocus
      />
      <Button type="submit" variant="contained" disabled={isButtonDisabled}>
        Create
      </Button>
    </form>
  );
};

export default CreateShoppingListPage;
