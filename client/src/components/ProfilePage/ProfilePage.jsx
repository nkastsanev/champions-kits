import { useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { FaTruck } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import { RiLogoutBoxRFill } from "react-icons/ri";
import styles from './ProfilePage.module.css';

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
          <section id="overview">

            <div className={styles.sectionTitle}>
              <h1>Overview</h1>
            </div>

            <div className={styles.sectionContent}>

              <p>Welcome back, Ivan Ivanov</p>
              <p>Here's a quick overview of your account</p>

              <div className={styles.stats}>

                <div className={styles.card}>
                  <div className={styles.statsInfo}>
                    <p>Total Orders</p>
                    <h3>23</h3>
                  </div>
                </div>

                <div className={styles.card}>
                  <div className={styles.statsInfo}>
                    <p>Wishlist Items</p>
                    <h3>4</h3>
                  </div>
                </div>

                <div className={styles.card}>
                  <div className={styles.statsInfo}>
                    <p>Total Spent</p>
                    <h3>€445</h3>
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

              </div>

            </div>

          </section>
        )}

        {active === "orders" && (
          <section id="orders">

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
                      <p>ORD-2024-1547</p>
                      <p>Delivered</p>
                    </div>

                    <p>Placed on March 5, 2026</p>

                    <div className={styles.orderItems}>

                      <div className={styles.orderItem}>

                        <div className={styles.itemImage}>
                          <img src="" alt="Photo" />
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
                          <img src="" alt="Photo" />
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

          </section>
        )}

        {active === "wishlist" && (
          <section id="wishlist">

            <div className={styles.sectionTitle}>
              <h1>My Wishlist</h1>
            </div>

            <div className={styles.sectionContent}>

              <p>Save your favorite items for later</p>


              <div className={styles.productGrid}>

                <div className={styles.product}>

                  <div className={styles.imgSection}>
                    <img src="" alt="Product Photo" />
                  </div>

                  <div className={styles.productInfo}>
                    <h3>Inter Home Kit 2025/26</h3>

                    <p>€95.00</p>
                    <p>In Stock</p>

                    <div className={styles.sizeSection}>

                      <p>Available Sizes:</p>
                      <ul>
                        <li>XS</li>
                        <li>S</li>
                        <li>M</li>
                        <li>L</li>
                        <li>XL</li>
                        <li>XXL</li>
                      </ul>

                      <a href="">Add to Cart</a>
                    </div>

                  </div>
                </div>

                <div className={styles.product}>

                  <div className={styles.imgSection}>
                    <img src="" alt="Product Photo" />
                  </div>

                  <div className={styles.productInfo}>
                    <h3>Inter Home Kit 2025/26</h3>

                    <p>€95.00</p>
                    <p>In Stock</p>

                    <div className={styles.sizeSection}>

                      <p>Available Sizes:</p>
                      <ul>
                        <li>XS</li>
                        <li>S</li>
                        <li>M</li>
                        <li>L</li>
                        <li>XL</li>
                        <li>XXL</li>
                      </ul>

                      <a href="">Add to Cart</a>
                    </div>

                  </div>
                </div>

                <div className={styles.product}>

                  <div className={styles.imgSection}>
                    <img src="" alt="Product Photo" />
                  </div>

                  <div className={styles.productInfo}>
                    <h3>Inter Home Kit 2025/26</h3>

                    <p>€95.00</p>
                    <p>In Stock</p>

                    <div className={styles.sizeSection}>

                      <p>Available Sizes:</p>
                      <ul>
                        <li>XS</li>
                        <li>S</li>
                        <li>M</li>
                        <li>L</li>
                        <li>XL</li>
                        <li>XXL</li>
                      </ul>

                      <a href="">Add to Cart</a>
                    </div>

                  </div>
                </div>

                <div className={styles.product}>

                  <div className={styles.imgSection}>
                    <img src="" alt="Product Photo" />
                  </div>

                  <div className={styles.productInfo}>
                    <h3>Inter Home Kit 2025/26</h3>

                    <p>€95.00</p>
                    <p>In Stock</p>

                    <div className={styles.sizeSection}>

                      <p>Available Sizes:</p>
                      <ul>
                        <li>XS</li>
                        <li>S</li>
                        <li>M</li>
                        <li>L</li>
                        <li>XL</li>
                        <li>XXL</li>
                      </ul>

                      <a href="">Add to Cart</a>
                    </div>

                  </div>
                </div>


              </div>

            </div>

          </section>
        )}

        {active === "personal" && (
          <section id="personal">

            <div className={styles.sectionTitle}>
              <h1>Personal Information</h1>
            </div>

            <div className={styles.sectionContent}>

              <p>Manage your personal details and addresses</p>

              <form className={styles.accountDetailsForm} action="">
                <label htmlFor="firstName">First Name</label>
                <input type="text" />

                <label htmlFor="lastName">Last Name</label>
                <input type="text" />

                <label htmlFor="email">Email Address</label>
                <input type="text" />

                <label htmlFor="phone">Phone Number</label>
                <input type="text" />

                  <button className={styles.editBtn}>
                    Edit
                  </button>

                  <button className={styles.saveBtn}>
                    Save
                  </button>

                  <button className={styles.cancelBtn}>
                    Cancel
                  </button>

              </form>

            </div>

          </section>
        )}

        {active === "security" && (
          <section id="security">

            <div className={styles.sectionTitle}>
              <h1>Security</h1>
            </div>

            <div className={styles.sectionContent}>

              <p>Manage your account security and privacy</p>

              <div className={styles.changePassSection}>

                <div className={styles.info}>
                  <p>Icon</p>

                  <div className={styles.text}>
                    <h3>Change Password</h3>
                    <p>Update your password regularly to keep your account secure</p>
                  </div>

                </div>

                <form className={styles.passwordForm} action="">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input type="text" />

                  <label htmlFor="newPassword">New Password</label>
                  <input type="text" />

                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input type="text" />

                  <div className={styles.btnContainer}>
                    <button type="submit" className={styles.updateBtn}>
                      Update Password
                    </button>
                  </div>
                </form>

              </div>

            </div>

          </section>
        )}

      </main>
    </div>
  );
};

export default ProfilePage;
