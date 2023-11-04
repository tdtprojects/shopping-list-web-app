// type Props = {}
import styles from "./styles.module.scss";

const Checkbox = ({ index }) => {
  return (
    <div className={styles.checkbox_wrapper}>
      <input className={styles.inp_cbx} id={index} type="checkbox" />
      <label className={styles.cbx} htmlFor={index}>
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
