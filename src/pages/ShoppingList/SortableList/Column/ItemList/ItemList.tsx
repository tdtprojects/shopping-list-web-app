import { type FC, type Ref, memo } from "react";

import type { ShoppingListItem } from "@/shared/types";
import Item from "./Item";

interface Props {
  itemList: ShoppingListItem[];
  isDesktop: boolean;
  lastItemRef: Ref<HTMLTextAreaElement>;
  handleItemChange: (e: React.ChangeEvent<HTMLTextAreaElement>, itemId: string) => void;
  handleItemRemove: (itemId: string) => void;
  handleCheckboxChange: (itemId: string, value: boolean) => void;
  handleItemKeyDown: (event: React.KeyboardEvent<HTMLDivElement>, itemId: string) => void;
}

const ItemList: FC<Props> = (props: Props) => {
  return props.itemList.map((item, index) => (
    <Item
      key={item.id}
      item={item}
      index={index}
      isDesktop={props.isDesktop}
      handleItemChange={props.handleItemChange}
      handleItemRemove={props.handleItemRemove}
      handleCheckboxChange={props.handleCheckboxChange}
      isLast={index === props.itemList.length - 1}
      lastItemRef={props.lastItemRef}
      handleItemKeyDown={props.handleItemKeyDown}
    />
  ));
};

ItemList.displayName = "ItemList";

export default memo(ItemList);
