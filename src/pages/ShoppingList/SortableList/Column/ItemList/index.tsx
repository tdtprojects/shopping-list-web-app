import { type FC, type Ref, memo } from "react";

import type { ShoppingListItem } from "@/shared/types";
import Item from "./Item";

interface Props {
  itemList: ShoppingListItem[];
  isDesktop: boolean;
  lastItemRef: Ref<HTMLDivElement>;
  handleItemRemove: (itemId: string) => void;
}

const ItemList: FC<Props> = (props: Props) => {
  return props.itemList.map((item, index) => (
    <Item
      key={item.id}
      item={item}
      index={index}
      isDesktop={props.isDesktop}
      handleItemRemove={props.handleItemRemove}
      isLast={index === props.itemList.length - 1}
      lastItemRef={props.lastItemRef}
    />
  ));
};

ItemList.displayName = "ItemList";

export default memo(ItemList);
