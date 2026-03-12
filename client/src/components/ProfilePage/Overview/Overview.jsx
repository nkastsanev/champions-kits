import styles from './Overview.module.css';
import { TbTruckDelivery } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa";
import { GoTrophy } from "react-icons/go";
import { FaRegMoneyBillAlt } from "react-icons/fa";

const Overview = () => (
  <section id="overview">

    <div className={styles.overviewContainer}>

      <div className={styles.sectionTitle}>
        <h1>Overview</h1>
      </div>

      <div className={styles.sectionContent}>

        <div className={styles.welcomeTexts}>
          <p>Welcome back, Ivan Ivanov</p>
          <p>Here's a quick overview of your account</p>
        </div>

        <div className={styles.stats}>

          <div className={styles.card}>
            <div className={styles.statsInfo}>
              <p>Total Orders</p>
              <h3>23</h3>
            </div>
            <div className={`${styles.statsIcon} ${styles.ordersIcon}`}>
              <TbTruckDelivery />
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.statsInfo}>
              <p>Wishlist Items</p>
              <h3>4</h3>
            </div>
            <div className={`${styles.statsIcon} ${styles.wishlistIcon}`}>
              <FaRegHeart />
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.statsInfo}>
              <p>Champions Points</p>
              <h3>45</h3>
            </div>
            <div className={`${styles.statsIcon} ${styles.pointsIcon}`}>
              <GoTrophy />
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.statsInfo}>
              <p>Total Spent</p>
              <h3>€445</h3>
            </div>
            <div className={`${styles.statsIcon} ${styles.spentIcon}`}>
              <FaRegMoneyBillAlt />
            </div>
          </div>

        </div>

        <div className={styles.recentOrders}>

          <h2>Recent Orders</h2>

          <div className={styles.order}>

            <div className={styles.orderStats}>
              <div className={styles.orderInfo}>
                <p className={styles.orderId}>ORD-2024-1543</p>
                <p className={styles.orderStatus}>Delivered</p>
              </div>
              <p className={styles.orderItem}>Real Madrid Home Kit 2025/26</p>
              <p className={styles.orderDate}>March 5, 2026</p>
            </div>

            <div className={styles.orderPrice}>
              <p>€120</p>
            </div>

            <div className={styles.detailsBtn}>
              <a href="/">View Details</a>
            </div>

          </div>

          <div className={styles.order}>

            <div className={styles.orderStats}>
              <div className={styles.orderInfo}>
                <p className={styles.orderId}>ORD-2024-1543</p>
                <p className={styles.orderStatus}>Delivered</p>
              </div>
              <p className={styles.orderItem}>Real Madrid Home Kit 2025/26</p>
              <p className={styles.orderDate}>March 5, 2026</p>
            </div>

            <div className={styles.orderPrice}>
              <p>€120</p>
            </div>

            <div className={styles.detailsBtn}>
              <a href="/">View Details</a>
            </div>

          </div>

          <div className={styles.order}>

            <div className={styles.orderStats}>
              <div className={styles.orderInfo}>
                <p className={styles.orderId}>ORD-2024-1543</p>
                <p className={styles.orderStatus}>Delivered</p>
              </div>
              <p className={styles.orderItem}>Real Madrid Home Kit 2025/26</p>
              <p className={styles.orderDate}>March 5, 2026</p>
            </div>

            <div className={styles.orderPrice}>
              <p>€120</p>
            </div>

            <div className={styles.detailsBtn}>
              <a href="/">View Details</a>
            </div>

          </div>

          <div className={styles.order}>

            <div className={styles.orderStats}>
              <div className={styles.orderInfo}>
                <p className={styles.orderId}>ORD-2024-1543</p>
                <p className={styles.orderStatus}>Delivered</p>
              </div>
              <p className={styles.orderItem}>Real Madrid Home Kit 2025/26</p>
              <p className={styles.orderDate}>March 5, 2026</p>
            </div>

            <div className={styles.orderPrice}>
              <p>€120</p>
            </div>

            <div className={styles.detailsBtn}>
              <a href="/">View Details</a>
            </div>

          </div>

          <div className={styles.order}>

            <div className={styles.orderStats}>
              <div className={styles.orderInfo}>
                <p className={styles.orderId}>ORD-2024-1543</p>
                <div className={styles.orderStatus}>
                  <p>Delivered</p>
                </div>
              </div>
              <p className={styles.orderItem}>Real Madrid Home Kit 2025/26</p>
              <p className={styles.orderItem}>Real Madrid Home Kit 2025/26</p>
              <p className={styles.orderItem}>Real Madrid Home Kit 2025/26</p>
              <p className={styles.orderDate}>March 5, 2026</p>
            </div>

            <div className={styles.orderPrice}>
              <p>€120</p>
            </div>

            <div className={styles.detailsBtn}>
              <a href="/">View Details</a>
            </div>

          </div>


        </div>

      </div>
    </div>
  </section>
);

export default Overview;
