import { type FC, useCallback } from "react";
import { Link } from "react-router-dom";
import ListIcon from "@mui/icons-material/List";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";

import type { ShoppingList } from "@/shared/types";

import styles from "./styles.module.scss";

interface Props {
  shoppingLists: ShoppingList[];
  handleUnpinShoppingList: (listId: string) => Promise<void>;
}

const Lists: FC<Props> = (props) => {
  const getCloseIconClickHandler = useCallback(
    (listId: string) => (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
      event.preventDefault();

      void props.handleUnpinShoppingList(listId);
    },
    [props.handleUnpinShoppingList]
  );

  return (
    props.shoppingLists.length > 0 && (
      <>
        <h2 className={styles.title}>Previous Lists</h2>
        <ul className={styles.list}>
          {props.shoppingLists.map((shoppingList) => (
            <li key={shoppingList.id} className={styles.item}>
              <Link to={`/shopping-list/${shoppingList.id}`} className={styles.link}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<ListIcon />}
                  endIcon={
                    <CloseIcon className={styles.closeIcon} onClick={getCloseIconClickHandler(shoppingList.id)} />
                  }>
                  <h3 className={styles.itemTitle}>{shoppingList.title}</h3>
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </>
    )
  );
};

export default Lists;
