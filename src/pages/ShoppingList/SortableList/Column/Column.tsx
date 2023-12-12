import { type FC, type Ref, useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import copy from "clipboard-copy";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

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
  const [menuAnchorElement, setMenuAnchorElement] = useState<HTMLElement | null>(null);
  const [popoverAnchorElement, setPopoverAnchorElement] = useState<HTMLLIElement | null>(null);
  const isSettingsMenuOpen = Boolean(menuAnchorElement);
  const isPopoverOpen = Boolean(popoverAnchorElement);

  const handleMenuButtonClick = (event: React.MouseEvent<HTMLElement>): void => {
    setMenuAnchorElement(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setMenuAnchorElement(null);
  };

  const handlePopoverClose = (): void => {
    setPopoverAnchorElement(null);
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

  const handleCopyLinkClick = (event: React.MouseEvent<HTMLLIElement>): void => {
    void copyLink(event);
  };

  const copyLink = async (event: React.MouseEvent<HTMLLIElement>): Promise<void> => {
    try {
      const currentUrl = window.location.href;

      await copy(currentUrl);
      setPopoverAnchorElement(event.target as HTMLLIElement);

      setTimeout(() => {
        handlePopoverClose();
      }, 1000);

      handleMenuClose();
    } catch (error) {
      console.error("Copy link error", error);
    }
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
        <div className={menuButtonWrapperClassList}>
          <IconButton onClick={handleMenuButtonClick}>
            <MoreVertOutlinedIcon />
          </IconButton>
          <Menu anchorEl={menuAnchorElement} open={isSettingsMenuOpen} onClose={handleMenuClose}>
            <MenuItem onClick={handleCopyLinkClick}>
              <div className={styles.menuItemWrapper}>
                <span>Copy link</span>
                <ContentCopyIcon />
              </div>
            </MenuItem>
            <MenuItem onClick={handleDeleteListClick}>
              <div className={styles.menuItemWrapper}>
                <span>Delete list</span>
                <DeleteForeverOutlinedIcon />
              </div>
            </MenuItem>
          </Menu>
          <Dialog
            isOpen={isDialogOpen}
            title="Are you sure you want to delete this shopping list?"
            handleClose={handleDialogClose}
            handleAgree={handleDialogAgree}
            handleDisagree={handleDialogDisagree}
          />
          <Popover
            open={isPopoverOpen}
            anchorEl={popoverAnchorElement}
            onClose={handlePopoverClose}
            classes={{ paper: styles.popover }}>
            Link copied
          </Popover>
        </div>
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
