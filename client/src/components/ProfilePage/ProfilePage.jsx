import { useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { FaTruck } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import { RiLogoutBoxRFill } from "react-icons/ri";
import styles from './ProfilePage.module.css';

import Overview from "./Overview/Overview";
import Orders from "./Orders/Orders";
import Wishlist from "./Wishlist/Wishlist";
import PersonalInfo from "./PersonalInfo/PersonalInfo";
import Security from "./Security/Security";

const ProfilePage = () => {
  const [active, setActive] = useState("overview");

  return (
    <div className={styles.ProfilePage}>
      <aside className={styles.sidebar}>
        <nav>
          <a
            className={`${styles.menuItem} ${active === "overview" ? styles.active : ""}`}
            onClick={() => setActive("overview")}
          >
            <span className={styles.icon}><AiFillHome /></span>
            Overview
          </a>

          <a
            className={`${styles.menuItem} ${active === "orders" ? styles.active : ""}`}
            onClick={() => setActive("orders")}
          >
            <span className={styles.icon}><FaTruck /></span>
            Orders
          </a>

          <a
            className={`${styles.menuItem} ${active === "wishlist" ? styles.active : ""}`}
            onClick={() => setActive("wishlist")}
          >
            <span className={styles.icon}><FaHeart /></span>
            Wishlist
          </a>

          <a
            className={`${styles.menuItem} ${active === "personal" ? styles.active : ""}`}
            onClick={() => setActive("personal")}
          >
            <span className={styles.icon}><IoPersonSharp /></span>
            Personal Info
          </a>

          <a
            className={`${styles.menuItem} ${active === "security" ? styles.active : ""}`}
            onClick={() => setActive("security")}
          >
            <span className={styles.icon}><FaLock /></span>
            Security
          </a>

          <a
            href="/"
            className={`${styles.menuItem} ${styles.logout}`}>
            <span className={styles.icon}><RiLogoutBoxRFill /></span>
            Log Out
          </a>
        </nav>
      </aside>

      <main className={styles.mainContent}>

        {active === "overview" && (
          <Overview />
        )}

        {active === "orders" && (
          <Orders />
        )}

        {active === "wishlist" && (
          <Wishlist />
        )}

        {active === "personal" && (
          <PersonalInfo />
        )}

        {active === "security" && (
         <Security />
        )}

      </main>
    </div>
  );
};

export default ProfilePage;
