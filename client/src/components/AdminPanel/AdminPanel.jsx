import { NavLink, Outlet } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { BsBoxSeamFill } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { RiLogoutBoxRFill } from "react-icons/ri";
import styles from './AdminPanel.module.css';


const AdminPanel = () => {

  return (
    <div className={styles.AdminPanel}>
      <aside className={styles.sidebar}>
        <nav>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.icon}><MdDashboard /></span>
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.icon}><BsBoxSeamFill /></span>
            Products
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.icon}><FaShoppingCart /></span>
            Orders
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.icon}><FaUsers /></span>
            Users
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.icon}><BiSolidCategory /></span>
            Categories
          </NavLink>

          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.menuItem} ${styles.logout} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.icon}><RiLogoutBoxRFill /></span>
            Log Out
          </NavLink>

        </nav>
      </aside>

      <main className={styles.mainContent}>
            <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
