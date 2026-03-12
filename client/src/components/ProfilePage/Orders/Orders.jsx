import styles from './Orders.module.css';

const Orders = () => (
  <section id="orders">

    <div className={styles.ordersContainer}>

      <div className={styles.sectionTitle}>
        <h1>My Orders</h1>
      </div>

      <div className={styles.sectionContent}>

        <p>View and track all your orders</p>

        <div className={styles.orderSectionStats}>

          <div className={styles.card}>
            <div className={styles.statsInfo}>
              <p>Total Orders</p>
              <h3>23</h3>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.statsInfo}>
              <p>Delivered</p>
              <h3>4</h3>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.statsInfo}>
              <p>In Transit</p>
              <h3>23</h3>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.statsInfo}>
              <p>Total Spent</p>
              <h3>€445</h3>
            </div>
          </div>

        </div>

        <div className={styles.orderFilters}>
          <ul>
            <li>All Orders</li>
            <li>Delivered</li>
            <li>In Transit</li>
            <li>Cancelled</li>
          </ul>
        </div>

        <div className={styles.allOrders}>
          <div className={styles.order}>
            <div className={styles.orderInfo}>

              <div className={styles.orderStats}>
                <p className={styles.orderId}>ORD-2024-1547</p>
                <p className={styles.orderStatus}>Delivered</p>
              </div>

              <p className={styles.orderDate}>Placed on March 5, 2026</p>

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

                  <div className={styles.deliveryDate}>
                    <p>Delivered On</p>
                    <p>March 7, 2026</p>
                  </div>

                </div>

                <div className={styles.orderSummaryPrice}>

                  <div className={styles.subtotal}>
                    <p>Subtotal</p>
                    <p>€89.99</p>
                  </div>

                  <div className={styles.shipping}>
                    <p>Shipping</p>
                    <p>€00.00</p>
                  </div>

                  <div className={styles.total}>
                    <p>Total</p>
                    <p>€89.99</p>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>



      </div>

    </div>

  </section>
);

export default Orders;
