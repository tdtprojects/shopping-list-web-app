import { type FC, type Ref, useCallback } from "react";
import { Draggable } from "react-beautiful-dnd";
import { DragIndicator, Close } from "@mui/icons-material";
import classNames from "classnames";

import Checkbox from "./Checkbox";
import type { ShoppingListItem } from "@/shared/types";
import styles from "./styles.module.scss";

interface Props {
  item: ShoppingListItem;
  index: number;
  isDesktop: boolean;
  isLast: boolean;
  lastItemRef: Ref<HTMLDivElement>;
  handleItemInput: (e: React.ChangeEvent<HTMLDivElement>, itemId: string) => void;
  handleItemBlur: (e: React.ChangeEvent<HTMLDivElement>) => void;
  handleItemRemove: (itemId: string) => void;
  handleCheckboxChange: (itemId: string, value: boolean) => void;
}

const Item: FC<Props> = (props) => {
  const handleRemove = useCallback(() => {
    props.handleItemRemove(props.item.id);
  }, [props.handleItemRemove, props.item.id]);

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLDivElement>) => {
      props.handleItemInput(event, props.item.id);
    },
    [props.handleItemInput, props.item.id]
  );

  const dragIconWrapperClassList = classNames(styles.dragIconWrapper, {
    [styles.dragIconWrapper__isDesktop]: props.isDesktop,
  });
  const contentClassList = classNames(styles.content, {
    [styles.content__isDesktop]: props.isDesktop,
    [styles.content__isChecked]: props.item.checked,
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
            <Checkbox id={props.item.id} handleCheckboxChange={props.handleCheckboxChange} checked={props.item.checked} />
            <div
              className={contentClassList}
              contentEditable="true"
              aria-multiline="true"
              spellCheck="false"
              suppressContentEditableWarning={true}
              onInput={handleInput}
              onBlur={props.handleItemBlur}
              ref={props.isLast ? props.lastItemRef : null}
            >
              {props.item.text}
            </div>
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
