import styles from './Users.module.css';
import { FaArrowTrendUp } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";

const Users = () => (
  <div className={styles.ordersContainer}>

    <div className={styles.sectionTitle}>
      <h1>Orders Management</h1>
    </div>

    <div className={styles.sectionContent}>

      <p>View and manage all customer orders.</p>

      <div className={styles.stats}>

        <div className={styles.card}>
          <div className={styles.statsInfo}>
            <p>Total Users</p>
            <h3>8</h3>
          </div>
          <div className={`${styles.statsIcon} ${styles.usersIcon}`}>
            <FiUsers />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.statsInfo}>
            <p>New This Month</p>
            <h3>2</h3>
          </div>
          <div className={`${styles.statsIcon} ${styles.newUsersIcon}`}>
            <FaArrowTrendUp />
          </div>
        </div>

      </div>
    </div>
  </div>
);

export default Users;
