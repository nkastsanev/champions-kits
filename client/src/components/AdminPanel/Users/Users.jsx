import styles from './Users.module.css';
import { FiSearch, FiUsers } from "react-icons/fi";
import { FaArrowTrendUp } from "react-icons/fa6";

const Users = () => (
  <div className={styles.usersContainer}>

    <div className={styles.sectionTitle}>
      <h1>Users Management</h1>
    </div>

    <div className={styles.sectionContent}>

      <p>Manage customer accounts and permissions</p>

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

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search by name or email..."
          />
          <button className={styles.searchBtn}>
            <FiSearch />
          </button>
        </div>

        <select className={styles.filter}>
          <option value="All roles">All roles</option>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
          <option value="Owner">Owner</option>
        </select>

      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Join Date</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Last Order</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>
                <div className={styles.userCell}>
                  <div>
                    <p className={styles.userName}>Ivan Ivanov</p>
                    <p className={styles.userEmail}>ivan@email.com</p>
                  </div>
                </div>
              </td>
              <td><span className={`${styles.status} ${styles.owner}`}>Owner</span></td>
              <td>Dec 15, 2024</td>
              <td>24</td>
              <td>€2,845</td>
              <td>Mar 5, 2026</td>
              <td>
                <div className={styles.actions}>
                  <button className={styles.view}>View</button>
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className={styles.userCell}>
                  <div>
                    <p className={styles.userName}>Maria Garcia</p>
                    <p className={styles.userEmail}>maria@email.com</p>
                  </div>
                </div>
              </td>
              <td><span className={`${styles.status} ${styles.admin}`}>Admin</span></td>
              <td>Jan 10, 2025</td>
              <td>18</td>
              <td>€1,980</td>
              <td>Mar 4, 2026</td>
              <td>
                <div className={styles.actions}>
                  <button className={styles.view}>View</button>
                  <button className={styles.demote}>Demote</button>
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className={styles.userCell}>
                  <div>
                    <p className={styles.userName}>John Smith</p>
                    <p className={styles.userEmail}>john@email.com</p>
                  </div>
                </div>
              </td>
              <td><span className={`${styles.status} ${styles.user}`}>User</span></td>
              <td>Feb 5, 2025</td>
              <td>12</td>
              <td>€1,456</td>
              <td>Mar 3, 2026</td>
              <td>
                <div className={styles.actions}>
                  <button className={styles.view}>View</button>
                  <button className={styles.promote}>Promote</button>
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className={styles.userCell}>
                  <div>
                    <p className={styles.userName}>Ana Martinez</p>
                    <p className={styles.userEmail}>ana@email.com</p>
                  </div>
                </div>
              </td>
              <td><span className={`${styles.status} ${styles.user}`}>User</span></td>
              <td>Nov 20, 2024</td>
              <td>8</td>
              <td>€734</td>
              <td>Feb 15, 2026</td>
              <td>
                <div className={styles.actions}>
                  <button className={styles.view}>View</button>
                  <button className={styles.promote}>Promote</button>
                </div>
              </td>
            </tr>

          </tbody>
        </table>

        <div className={styles.pagination}>
          <span className={styles.pgInfo}>Showing 1–4 of 4 users</span>
          <div className={styles.pgBtns}>
            <button className={styles.pgBtn}>‹</button>
            <button className={`${styles.pgBtn} ${styles.pgActive}`}>1</button>
            <button className={styles.pgBtn}>2</button>
            <button className={styles.pgBtn}>3</button>
            <button className={styles.pgBtn}>›</button>
          </div>
        </div>
      </div>

    </div>
  </div>
);

export default Users;
