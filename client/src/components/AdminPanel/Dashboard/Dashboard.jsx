import styles from './Dashboard.module.css';
import { NavLink } from 'react-router-dom';
import { IoCartOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { FiBox } from "react-icons/fi";
import { useState, useEffect } from 'react';
import { useAdminApi } from '../../../api/adminApi';


const Dashboard = () => {

  const [statsData, setStatsData] = useState(null);

  const { getDashboardDetails } = useAdminApi();

  const loadStatsData = async () => {
    try {
      const res = await getDashboardDetails();

      setStatsData(res);

    } catch (err) {
      console.error(err.message);
    }
  };

    useEffect(() => {
    loadStatsData();
  }, []);


return (
  <div className={styles.dashboardContainer}>

    <div className={styles.sectionTitle}>
      <h1>Dashboard</h1>
    </div>

    <div className={styles.sectionContent}>

      <div className={styles.welcomeTexts}>
        <p>Here's what's happening with your store.</p>
      </div>

      <div className={styles.stats}>

        <div className={styles.card}>
          <div className={styles.statsInfo}>
            <p>Total Revenue</p>
            <h3>€{statsData?.totalRevenue}</h3>
          </div>
          <div className={`${styles.statsIcon} ${styles.revenueIcon}`}>
            <FaRegMoneyBillAlt />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.statsInfo}>
            <p>Total Orders</p>
            <h3>{statsData?.completedOrders}</h3>
          </div>
          <div className={`${styles.statsIcon} ${styles.ordersIcon}`}>
            <IoCartOutline />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.statsInfo}>
            <p>Total Users</p>
            <h3>{statsData?.usersCount}</h3>
          </div>
          <div className={`${styles.statsIcon} ${styles.usersIcon}`}>
            <FiUsers />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.statsInfo}>
            <p>Products</p>
            <h3>{statsData?.productsCount}</h3>
          </div>
          <div className={`${styles.statsIcon} ${styles.productsIcon}`}>
            <FiBox />
          </div>
        </div>

      </div>

      <div className={styles.tables}>

        <div className={styles.topProducts}>

          <div className={styles.upperSection}>
            <div className={styles.info}>
              <h3>Top Products</h3>
              <p>Best selling items this month</p>
            </div>

            <div>
              <NavLink to="/admin/products">View All →</NavLink>
            </div>
          </div>

          <div className={styles.product}>
            <p className={styles.productNum}>1</p>
            <div className={styles.productInfo}>
              <p>Real Madrid Home Kit</p>
              <p>24 sales</p>
            </div>
            <p className={styles.productPrice}>€1,390</p>
          </div>

          <div className={styles.product}>
            <p className={styles.productNum}>2</p>
            <div className={styles.productInfo}>
              <p>Real Madrid Home Kit</p>
              <p>24 sales</p>
            </div>
            <p className={styles.productPrice}>€1,390</p>
          </div>

          <div className={styles.product}>
            <p className={styles.productNum}>3</p>
            <div className={styles.productInfo}>
              <p>Real Madrid Home Kit</p>
              <p>24 sales</p>
            </div>
            <p className={styles.productPrice}>€1,390</p>
          </div>

          <div className={styles.product}>
            <p className={styles.productNum}>4</p>
            <div className={styles.productInfo}>
              <p>Real Madrid Home Kit</p>
              <p>24 sales</p>
            </div>
            <p className={styles.productPrice}>€1,390</p>
          </div>

          <div className={styles.product}>
            <p className={styles.productNum}>5</p>
            <div className={styles.productInfo}>
              <p>Real Madrid Home Kit</p>
              <p>24 sales</p>
            </div>
            <p className={styles.productPrice}>€1,390</p>
          </div>

        </div>

        <div className={styles.recentOrders}>
          <div className={styles.upperSection}>
            <div className={styles.info}>
              <h3>Recent Orders</h3>
              <p>Latest customer orders</p>
            </div>

            <div>
              <NavLink to="/admin/orders">View All →</NavLink>
            </div>
          </div>

          <div className={styles.order}>
            <div className={styles.firstRow}>
              <p>Ivan Ivanov</p>
              <p>Completed</p>
            </div>
            <p className={styles.productName}>Real Madrid Kit</p>
            <p className={styles.productName}>Real Madrid Kit</p>
            <div className={styles.thirdRow}>
              <p>ORD-1547</p>
              <p>€89.99</p>
            </div>
          </div>

          <div className={styles.order}>
            <div className={styles.firstRow}>
              <p>Ivan Ivanov</p>
              <p>Completed</p>
            </div>
            <p className={styles.productName}>Real Madrid Kit</p>
            <p className={styles.productName}>Real Madrid Kit</p>
            <div className={styles.thirdRow}>
              <p>ORD-1547</p>
              <p>€89.99</p>
            </div>
          </div>

          <div className={styles.order}>
            <div className={styles.firstRow}>
              <p>Ivan Ivanov</p>
              <p>Completed</p>
            </div>
            <p className={styles.productName}>Real Madrid Kit</p>
            <p className={styles.productName}>Real Madrid Kit</p>
            <div className={styles.thirdRow}>
              <p>ORD-1547</p>
              <p>€89.99</p>
            </div>
          </div>

          <div className={styles.order}>
            <div className={styles.firstRow}>
              <p>Ivan Ivanov</p>
              <p>Completed</p>
            </div>
            <p className={styles.productName}>Real Madrid Kit</p>
            <p className={styles.productName}>Real Madrid Kit</p>
            <div className={styles.thirdRow}>
              <p>ORD-1547</p>
              <p>€89.99</p>
            </div>
          </div>


        </div>

      </div>

    </div>

  </div>
)
};

export default Dashboard;
