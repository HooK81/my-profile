import styles from './Spinner.module.scss';

function Spinner() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
    </div>
  );
}

export default Spinner;
