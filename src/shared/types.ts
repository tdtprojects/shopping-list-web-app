export interface ShoppingListItem {
  id: string;
  text: string;
  listId: string;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  title: string;
  items: ShoppingListItem[];
}
