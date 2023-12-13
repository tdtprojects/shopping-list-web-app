import { type FC, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import classNames from "classnames";

import styles from "./styles.module.scss";

interface Props {
  handleNewItemChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const NewItem: FC<Props> = (props) => {
  const [isTextFieldFocused, setIsTextFieldFocused] = useState(false);

  const handleBlur = (): void => {
    setIsTextFieldFocused(false);
  };

  const handleFocus = (): void => {
    setIsTextFieldFocused(true);
  };

  const contentClassList = classNames(styles.content, {
    [styles.content__isFocused]: isTextFieldFocused,
  });

  return (
    <div className={styles.root}>
      <span className={styles.plusIconWrapper}>
        <AddIcon />
      </span>
      <TextField
        multiline
        fullWidth
        className={contentClassList}
        onChange={props.handleNewItemChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="List item"
      />
    </div>
  );
};

export default NewItem;
