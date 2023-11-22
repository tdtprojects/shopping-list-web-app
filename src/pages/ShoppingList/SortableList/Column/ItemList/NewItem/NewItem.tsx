import type { FC } from "react";
import AddIcon from "@mui/icons-material/Add";

import { preventControlCommandEnterKeyDown } from "@/shared/utils";
import styles from "./styles.module.scss";

interface Props {
  handleNewItemInput: (e: React.ChangeEvent<HTMLDivElement>) => void;
}

const NewItem: FC<Props> = (props) => {
  return (
    <div className={styles.root}>
      <span className={styles.plusIconWrapper}>
        <AddIcon />
      </span>
      <div
        className={styles.content}
        contentEditable="true"
        aria-multiline="true"
        spellCheck="false"
        suppressContentEditableWarning={true}
        onInput={props.handleNewItemInput}
        // Temporary bug fix
        onKeyDown={preventControlCommandEnterKeyDown} />
      <span className={styles.placeholder}>List item</span>
    </div>
  );
};

export default NewItem;
