import AddIcon from "@mui/icons-material/Add";

import styles from "./styles.module.scss";
// type Props = {}

const NewTask = ({ handleNewItemInput }) => {
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
        onInput={handleNewItemInput}
      >
      </div>
      <span className={styles.placeholder}>List item</span>
    </div>
  );
};

export default NewTask;
