import styles from './Catalog.module.css';
import { Outlet, NavLink } from 'react-router-dom';
import { BiCategory } from "react-icons/bi";
import { GoTrophy } from "react-icons/go";
import { RiShieldStarLine } from "react-icons/ri";
import { FiBox } from "react-icons/fi";

const Catalog = () => (
    <div className={styles.catalogContainer}>

        <div className={styles.sectionTitle}>
            <h1>Catalog Management</h1>
        </div>

        <div className={styles.sectionContent}>

            <p>Organize your products by categories, leagues, and teams</p>

            <div className={styles.stats}>

                <div className={styles.card}>
                    <div className={styles.statsInfo}>
                        <p>Categories</p>
                        <h3>8</h3>
                    </div>
                    <div className={`${styles.statsIcon} ${styles.categoriesIcon}`}>
                        <BiCategory />
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.statsInfo}>
                        <p>Leagues</p>
                        <h3>2</h3>
                    </div>
                    <div className={`${styles.statsIcon} ${styles.leaguesIcon}`}>
                        <GoTrophy />
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.statsInfo}>
                        <p>Teams</p>
                        <h3>15</h3>
                    </div>
                    <div className={`${styles.statsIcon} ${styles.teamsIcon}`}>
                        <RiShieldStarLine />
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.statsInfo}>
                        <p>Products</p>
                        <h3>850</h3>
                    </div>
                    <div className={`${styles.statsIcon} ${styles.productsIcon}`}>
                        <FiBox />
                    </div>
                </div>

            </div>

            <div className={styles.orderFilters}>
                <nav>
                    <NavLink to="categories" className={({ isActive }) => isActive ? styles.activeTab : styles.tab}>Categories</NavLink>
                    <NavLink to="leagues" className={({ isActive }) => isActive ? styles.activeTab : styles.tab}>Leagues</NavLink>
                    <NavLink to="teams" className={({ isActive }) => isActive ? styles.activeTab : styles.tab}>Teams</NavLink>
                </nav>
            </div>

            <Outlet />

        </div>
    </div>
);

export default Catalog;
