// Temporary bug fix
export const preventControlCommandEnterKeyDown = (event: React.KeyboardEvent): void => {
  const isCtrlZPressed = (event.ctrlKey || event.metaKey) && event.key === "z";
  const isEnterPressed = event.key === "Enter";

  if (isCtrlZPressed || isEnterPressed) {
    event.preventDefault();
  }
};
