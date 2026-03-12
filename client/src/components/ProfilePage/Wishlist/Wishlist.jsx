import styles from './Wishlist.module.css';
import { IoCartOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";

const Wishlist = () => (
  <section id="wishlist">

    <div className={styles.wishlistContainer}>

      <div className={styles.sectionTitle}>
        <h1>My Wishlist</h1>
      </div>

      <p>Save your favorite items for later</p>

      <div className={styles.sectionContent}>

        <div className={styles.productGrid}>

          <div className={styles.product}>

            <button className={styles.deleteBtn}>
              <FaRegTrashAlt />
            </button>

            <div className={styles.imgSection}>
              <img src="/inter_shirt.jpg" alt="Product Photo" />
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
                <button><IoCartOutline /> Add to Cart</button>
              </div>

            </div>
          </div>

          <div className={styles.product}>

            <button className={styles.deleteBtn}>
              <FaRegTrashAlt />
            </button>

            <div className={styles.imgSection}>
              <img src="/inter_shirt.jpg" alt="Product Photo" />
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

                <button><IoCartOutline /> Add to Cart</button>
              </div>

            </div>
          </div>

          <div className={styles.product}>

            <button className={styles.deleteBtn}>
              <FaRegTrashAlt />
            </button>

            <div className={styles.imgSection}>
              <img src="/inter_shirt.jpg" alt="Product Photo" />
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

                <button><IoCartOutline /> Add to Cart</button>
              </div>

            </div>
          </div>

          <div className={styles.product}>

            <button className={styles.deleteBtn}>
              <FaRegTrashAlt />
            </button>

            <div className={styles.imgSection}>
              <img src="/inter_shirt.jpg" alt="Product Photo" />
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

                <button><IoCartOutline /> Add to Cart</button>
              </div>

            </div>
          </div>

          <div className={styles.product}>

            <button className={styles.deleteBtn}>
              <FaRegTrashAlt />
            </button>

            <div className={styles.imgSection}>
              <img src="/inter_shirt.jpg" alt="Product Photo" />
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

                <button><IoCartOutline /> Add to Cart</button>
              </div>

            </div>
          </div>


        </div>

      </div>
    </div>
  </section>
);

export default Wishlist;
