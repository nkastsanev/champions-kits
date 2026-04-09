import { NavLink, Outlet } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { FaTruck } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import { RiLogoutBoxRFill } from "react-icons/ri";
import styles from './ProfilePage.module.css';
import { useUserContext } from "../../contexts/UserContext";

const ProfilePage = () => {

  const { logout } = useUserContext();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  }

  return (
    <div className={styles.ProfilePage}>
      <aside className={styles.sidebar}>
        <nav>

          <NavLink
            to="/profile"
            end
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.icon}><AiFillHome /></span>
            Overview
          </NavLink>

          <NavLink to="/profile/orders"
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.active : ""}`
            }>
            <span className={styles.icon}><FaTruck /></span>
            Orders
          </NavLink>

          <NavLink
            to="/profile/wishlist"
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.active : ""}`
            }>
            <span className={styles.icon}><FaHeart /></span>
            Wishlist
          </NavLink>

          <NavLink
            to="/profile/personal"
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.active : ""}`
            }>
            <span className={styles.icon}><IoPersonSharp /></span>
            Personal Info
          </NavLink>

          <NavLink
            to="/profile/security"
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.active : ""}`
            }>
            <span className={styles.icon}><FaLock /></span>
            Security
          </NavLink>

          <NavLink
            to="/"
            onClick={handleLogout}
            className={({ isActive }) =>
              `${styles.menuItem} ${styles.logout} ${isActive ? styles.active : ""}`
            }>
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

export default ProfilePage;