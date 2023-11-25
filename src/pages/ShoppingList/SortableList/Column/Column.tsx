import { type FC, type Ref, useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";

import Dialog from "@/shared/components/Dialog";

import NewItem from "./ItemList/NewItem";
import StrictModeDroppable from "./StrictModeDroppable";
import ItemList from "./ItemList";
import type { ShoppingListItem, Column as ColumnType } from "@/shared/types";
import styles from "./styles.module.scss";

interface Props {
  itemList: ShoppingListItem[];
  isDesktop: boolean;
  lastItemRef: Ref<HTMLDivElement>;
  column: ColumnType;
  handleItemRemove: (itemId: string) => void;
  handleItemInput: (e: React.ChangeEvent<HTMLDivElement>, itemId: string) => void;
  handleNewItemInput: (e: React.ChangeEvent<HTMLDivElement>) => void;
  handleItemBlur: (e: React.ChangeEvent<HTMLDivElement>) => void;
  handleCheckboxChange: (itemId: string, value: boolean) => void;
  handleColumnTitleBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  deleteShoppingList: (id: string) => Promise<void>;
}

const Column: FC<Props> = (props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [anchorMenuElement, setAnchorMenuElement] = useState<null | HTMLElement>(null);
  const isSettingsMenuOpen = Boolean(anchorMenuElement);

  const handleMenuButtonClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorMenuElement(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setAnchorMenuElement(null);
  };

  const handleDeleteListClick = (): void => {
    handleMenuClose();
    setIsDialogOpen(true);
  };

  const handleDialogClose = (): void => {
    setIsDialogOpen(false);
  };

  const handleDialogAgree = (): void => {
    void props.deleteShoppingList(props.column.id);
    setIsDialogOpen(false);
  };

  const handleDialogDisagree = (): void => {
    setIsDialogOpen(false);
  };

  const rootClassList = classNames(styles.root, {
    [styles.root__isDesktop]: props.isDesktop,
  });
  const homeLinkWrapperClassList = classNames(styles.homeLinkWrapper, {
    [styles.homeLinkWrapper__isDesktop]: props.isDesktop,
  });
  const homeLinkClassList = classNames(styles.homeLink, {
    [styles.homeLink__isDesktop]: props.isDesktop,
  });
  const menuButtonWrapperClassList = classNames(styles.menuButtonWrapper, {
    [styles.menuButtonWrapper__isDesktop]: props.isDesktop,
  });

  return (
    <div className={rootClassList}>
      <div className={homeLinkWrapperClassList}>
        <Link className={homeLinkClassList} to="/">
          <NavigateBeforeIcon />
          Lists
        </Link>
        <span className={menuButtonWrapperClassList}>
          <IconButton onClick={handleMenuButtonClick}>
            <MoreVertOutlinedIcon />
          </IconButton>
          <Menu anchorEl={anchorMenuElement} open={isSettingsMenuOpen} onClose={handleMenuClose}>
            <MenuItem onClick={handleDeleteListClick}>
              Delete list
              <DeleteForeverOutlinedIcon className={styles.deleteListIcon} />
            </MenuItem>
          </Menu>
          <Dialog
            isOpen={isDialogOpen}
            title="Are you sure you want to delete this shopping list?"
            handleClose={handleDialogClose}
            handleAgree={handleDialogAgree}
            handleDisagree={handleDialogDisagree}
          />
        </span>
      </div>
      <TextField
        multiline
        fullWidth
        className={styles.title}
        defaultValue={props.column.title}
        onBlur={props.handleColumnTitleBlur}
        placeholder="Title"
      />
      <StrictModeDroppable droppableId={props.column.id}>
        {(provided, snapshot) => {
          const taskListClassList = classNames(styles.taskList, {
            [styles.taskList__isDesktop]: props.isDesktop,
            [styles.taskList__isDraggingOver]: snapshot.isDraggingOver,
          });

          return (
            <div className={taskListClassList} {...provided.droppableProps} ref={provided.innerRef}>
              <ItemList
                itemList={props.itemList}
                isDesktop={props.isDesktop}
                handleItemInput={props.handleItemInput}
                handleItemRemove={props.handleItemRemove}
                handleItemBlur={props.handleItemBlur}
                handleCheckboxChange={props.handleCheckboxChange}
                lastItemRef={props.lastItemRef}
              />
              {provided.placeholder}
              <NewItem handleNewItemInput={props.handleNewItemInput} />
            </div>
          );
        }}
      </StrictModeDroppable>
    </div>
  );
};

export default Column;
