import { type FC, type Ref, useState, useCallback } from "react";
import { Draggable } from "react-beautiful-dnd";
import { DragIndicator, Close } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import classNames from "classnames";

import type { ShoppingListItem } from "@/shared/types";

import Checkbox from "./Checkbox";
import styles from "./styles.module.scss";

interface Props {
  item: ShoppingListItem;
  index: number;
  isDesktop: boolean;
  isLast: boolean;
  lastItemRef: Ref<HTMLTextAreaElement>;
  handleItemChange: (e: React.ChangeEvent<HTMLTextAreaElement>, itemId: string) => void;
  handleItemRemove: (itemId: string) => void;
  handleCheckboxChange: (itemId: string, value: boolean) => void;
}

const Item: FC<Props> = (props) => {
  const [isTextFieldFocused, setIsTextFieldFocused] = useState(false);

  const { handleItemRemove, handleItemChange, item } = props;

  const handleRemove = useCallback(() => {
    handleItemRemove(item.id);
  }, [handleItemRemove, item.id]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleItemChange(event, item.id);
    },
    [handleItemChange, item.id]
  );

  const handleBlur = (): void => {
    setIsTextFieldFocused(false);
  };

  const handleFocus = (): void => {
    setIsTextFieldFocused(true);
  };

  const dragIconWrapperClassList = classNames(styles.dragIconWrapper, {
    [styles.dragIconWrapper__isDesktop]: props.isDesktop,
  });
  const contentClassList = classNames(styles.content, {
    [styles.content__isDesktop]: props.isDesktop,
    [styles.content__isChecked]: props.item.checked,
    [styles.content__isFocused]: isTextFieldFocused,
  });

  return (
    <Draggable draggableId={props.item.id} index={props.index}>
      {(provided, snapshot) => {
        const rootClassList = classNames(styles.root, {
          [styles.root__isDragging]: snapshot.isDragging,
        });
        const transform = provided.draggableProps.style?.transform ?? null;
        const draggableProps = { ...provided.draggableProps };

        if (typeof transform === "string") {
          // This need to disable axis X dragging
          // eslint-disable-next-line
          // @ts-ignore
          draggableProps.style = {
            ...draggableProps.style,
            transform: transform.replace(/\(-?\d*\.?\d+px,\s/, "(0px, "),
          };
        }

        return (
          <div className={rootClassList} {...draggableProps} ref={provided.innerRef}>
            <span {...provided.dragHandleProps} className={dragIconWrapperClassList}>
              <DragIndicator />
            </span>
            <Checkbox
              id={props.item.id}
              handleCheckboxChange={props.handleCheckboxChange}
              checked={props.item.checked}
            />
            <TextField
              multiline
              fullWidth
              className={contentClassList}
              defaultValue={props.item.text}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              inputRef={props.isLast ? props.lastItemRef : null}
            />
            <span className={styles.closeIconWrapper}>
              <Close onClick={handleRemove} />
            </span>
          </div>
        );
      }}
    </Draggable>
  );
};

export default Item;
