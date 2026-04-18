import styles from './Orders.module.css';
import { FiSearch } from "react-icons/fi";
import { useState, useEffect } from 'react';
import { useAdminApi } from '../../../api/adminApi';

const Orders = () => {

    const [statsData, setStatsData] = useState({});
    
        const { getOrdersDetails } = useAdminApi();
    
        const loadStatsData = async () => {
            try {
                const res = await getOrdersDetails();
    
                setStatsData(res);
    
            } catch (err) {
                console.error(err.message);
            }
        };
    
        useEffect(() => {
            loadStatsData();
        }, []);

  return (
    <div className={styles.ordersContainer}>

      <div className={styles.sectionTitle}>
        <h1>Orders Management</h1>
      </div>

      <div className={styles.sectionContent}>

        <p className={styles.sectionMessage}>View and manage all customer orders.</p>

        <div className={styles.stats}>

          <div className={styles.card}>
            <div className={styles.statsInfo}>
              <p>Total Orders</p>
              <h3>{statsData?.totalOrders}</h3>
            </div>
            <div className={`${styles.statsIcon} ${styles.revenueIcon}`}>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.statsInfo}>
              <p>Pending</p>
              <h3>{statsData?.pendingOrders}</h3>
            </div>
            <div className={`${styles.statsIcon} ${styles.ordersIcon}`}>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.statsInfo}>
              <p>Processing</p>
              <h3>{statsData?.processingOrders}</h3>
            </div>
            <div className={`${styles.statsIcon} ${styles.usersIcon}`}>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.statsInfo}>
              <p>Delivered</p>
              <h3>{statsData?.deliveredOrders}</h3>
            </div>
            <div className={`${styles.statsIcon} ${styles.productsIcon}`}>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.statsInfo}>
              <p>Completed</p>
              <h3>{statsData?.completedOrders}</h3>
            </div>
            <div className={`${styles.statsIcon} ${styles.productsIcon}`}>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.statsInfo}>
              <p>Cancelled</p>
              <h3>{statsData?.cancelledOrders}</h3>
            </div>
            <div className={`${styles.statsIcon} ${styles.productsIcon}`}>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.statsInfo}>
              <p>Returned</p>
              <h3>{statsData?.returnedOrders}</h3>
            </div>
            <div className={`${styles.statsIcon} ${styles.productsIcon}`}>
            </div>
          </div>

        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search by name order ID, customer name, or email..."
            />
            <button className={styles.searchBtn}>
              <FiSearch />
            </button>
          </div>

          <select className={styles.filter}>
            <option value="All orders">All orders</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Delivered</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Returned">Returned</option>
          </select>

        </div>

        <div className={styles.allOrders}>
          <div className={styles.order}>
            <div className={styles.orderInfo}>

              <div className={styles.orderStats}>
                <p className={styles.orderId}>ORD-2024-1547</p>
                <p className={styles.orderStatus}>Delivered</p>
              </div>

              <p className={styles.orderCustomer}>Customer: <span>Ivan Ivanov</span></p>
              <p className={styles.orderUserEmail}>Email: <span>ivan123@abv.bg</span></p>
              <p className={styles.orderDate}>Order Date: <span>March 5, 2026</span></p>

              <div className={styles.orderItems}>

                <div className={styles.orderItem}>

                  <div className={styles.itemImage}>
                    <img src="/bayern_shirt.jpg" alt="Product Photo" />
                  </div>

                  <div className={styles.itemInfo}>
                    <p>Bayern Munich Special Edition</p>
                    <p>Size: L | Qty: 1</p>
                  </div>

                  <div className={styles.itemPrice}>
                    <p>€110.00</p>
                  </div>

                </div>

                <div className={styles.orderItem}>

                  <div className={styles.itemImage}>
                    <img src="/bayern_shirt.jpg" alt="Product Photo" />
                  </div>

                  <div className={styles.itemInfo}>
                    <p>Bayern Munich Special Edition</p>
                    <p>Size: L | Qty: 1</p>
                  </div>

                  <div className={styles.itemPrice}>
                    <p>€110.00</p>
                  </div>

                </div>

              </div>

              <div className={styles.orderSummary}>

                <div className={styles.orderSummaryInfo}>
                  <div className={styles.deliveryAddress}>
                    <p>Delivery Address</p>
                    <p>123 Football Street, Madrid, Spain</p>
                  </div>

                  <div className={styles.paymentStatus}>
                    <p>Payment Status</p>
                    <p>Paid</p>
                  </div>

                </div>

              </div>

              <div className={styles.lastRow}>

                <div className={styles.btnsContainer}>
                  <button className={styles.startProcessing}>Start Processing</button>
                  <button className={styles.markAsDelivered}>Mark as Delivered</button>
                  <button className={styles.markAsComplete}>Mark as Completed</button>
                  <button className={styles.cancelOrder}>Cancel Order</button>
                  <button className={styles.returnOrder}>Return Order</button>
                </div>

                <div className={styles.orderPrice}>
                  <p>Order Total</p>
                  <p>€89.99</p>
                </div>

              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );

}

export default Orders;
