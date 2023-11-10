import { Routes, Route } from "react-router-dom";
import type { ReactElement } from "react";
import { Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import classNames from "classnames";

import HomePage from "./pages/Home";
import ShoppingListPage from "./pages/ShoppingList";
import CreateShoppingListPage from "./pages/CreateShoppingList";
import NotFoundPage from "./pages/NotFound";

import styles from "./App.module.scss";

function App (): ReactElement {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const rootClassList = classNames(styles.root, {
    [styles.root__isDesktop]: isDesktop,
  });

  return (
    <Container className={rootClassList} maxWidth="lg">
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
