import { Routes, Route } from "react-router-dom";
import type { ReactElement } from "react";
import { Container } from "@mui/material";
import "@fontsource/inter";

import HomePage from "./pages/Home";
import ShoppingListPage from "./pages/ShoppingList";
import CreateShoppingListPage from "./pages/CreateShoppingList";
import NotFoundPage from "./pages/NotFound";

function App (): ReactElement {
  return (
    <Container maxWidth="lg">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shopping-list/:id" element={<ShoppingListPage />} />
        <Route path="/shopping-list/new" element={<CreateShoppingListPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Container>
  );
}

export default App;
