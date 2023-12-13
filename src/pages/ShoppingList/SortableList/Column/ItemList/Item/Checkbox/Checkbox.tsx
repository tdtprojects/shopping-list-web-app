import { type FC, useCallback } from "react";

import styles from "./Checkbox.module.scss";

interface Props {
  id: string;
  checked: boolean;
  handleCheckboxChange: (itemId: string, value: boolean) => void;
}

const Checkbox: FC<Props> = (props) => {
  const { id, handleCheckboxChange } = props;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleCheckboxChange(id, event.target.checked);
    },
    [id, handleCheckboxChange]
  );

  return (
    <div className={styles.checkbox_wrapper}>
      <input
        className={styles.inp_cbx}
        id={`checkbox-${props.id}`}
        type="checkbox"
        onChange={handleChange}
        checked={props.checked}
      />
      <label className={styles.cbx} htmlFor={`checkbox-${props.id}`}>
        <span>
          <svg width="10px" height="8px">
            <use xlinkHref="#check"></use>
          </svg>
        </span>
      </label>
      <svg className={styles.inline_svg}>
        <symbol id="check" viewBox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </symbol>
      </svg>
    </div>
  );
};

export default Checkbox;
