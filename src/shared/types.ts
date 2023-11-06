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

export interface Column {
  id: string;
  title: string;
}
