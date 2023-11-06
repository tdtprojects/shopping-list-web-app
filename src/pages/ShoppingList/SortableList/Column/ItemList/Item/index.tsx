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
  handleItemRemove: (itemId: string) => void;
}

const Item: FC<Props> = (props) => {
  const handleRemove = useCallback(() => {
    props.handleItemRemove(props.item.id);
  }, [props.handleItemRemove, props.item.id]);
  const dragIconWrapperClassList = classNames(styles.dragIconWrapper, {
    [styles.dragIconWrapper__isDesktop]: props.isDesktop,
  });
  const contentClassList = classNames(styles.content, {
    [styles.content__isDesktop]: props.isDesktop,
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
          // eslint-disable-next-line
          // @ts-ignore
          draggableProps.style = {
            ...draggableProps.style,
            transform: transform.replace(/\([-+]*\d+px,\s/, "(0px, "),
          };
        }

        return (
          <div className={rootClassList} {...draggableProps} ref={provided.innerRef}>
            <span {...provided.dragHandleProps} className={dragIconWrapperClassList}>
              <DragIndicator />
            </span>
            <Checkbox index={props.index} />
            <div
              className={contentClassList}
              contentEditable="true"
              aria-multiline="true"
              spellCheck="false"
              suppressContentEditableWarning={true}
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