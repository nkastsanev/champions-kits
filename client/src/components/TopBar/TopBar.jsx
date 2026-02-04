import styles from './TopBar.module.css';

const TopBar = () => (
  <div className={styles.topBar}>

    <span className={styles.topBarText}>✔️ 100% Authentic Kits</span>
    <span className={styles.topBarText}>🚚 Free Shipping over €100</span>
    <span className={styles.topBarText}>🔄 Easy Returns 14 Days</span>
  </div>
);

export default TopBar;
