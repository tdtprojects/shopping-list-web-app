export interface ShoppingListItem {
  id: string;
  text: string;
  order: number;
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
