import React from 'react';
import styles from './HomePage.module.css';

const HomePage = () => (
  <div className={styles.HomePage}>

    <div className={styles.hero}>
      <div className={styles.footballSection}>
        <img src="/football_hero.jpg" alt="Football Photo" />
        <div className={styles.footballText}>FOOTBALL KITS</div>
      </div>

      <div className={styles.basketballSection}>
        <img src="/basketball_hero.png" alt="Basket Photo" />
        <div className={styles.basketballText}>BASKETBALL KITS</div>
      </div>
    </div>

    <div className={styles.mainContent}>

      <section className={styles.featuredKits}>

        <h2>Featured Kits</h2>

        <div className={styles.featuredFootball}>

          <h3>Football</h3>

          <div className={styles.productGrid}>

            <div className={styles.productCard}>
              <div className={styles.imgWrapper}>
                <img src="catalog/barca_home.png" alt="Barcelona Home Kit" />
              </div>
              <div className={styles.infoWrapper}>
                <h4 className={styles.productTitle}>Barcelona Home Kit 25/26</h4>
                <span className={styles.originalPrice}>€39.99</span>
                <a className={styles.viewBtn}>
                  View Product
                </a>
              </div>
            </div>

            <div className={styles.productCard}>
              <div className={styles.imgWrapper}>
                <img src="catalog/real_home.png" alt="Real Madrid Home Kit" />
              </div>
              <div className={styles.infoWrapper}>
                <h4 className={styles.productTitle}>Real Madrid Home Kit 25/26</h4>
                <span className={styles.originalPrice}>€39.99</span>
                <a className={styles.viewBtn}>
                  View Product
                </a>
              </div>
            </div>

            <div className={styles.productCard}>
              <div className={styles.imgWrapper}>
                <img src="catalog/liverpool_home.png" alt="Liverpool Home Kit" />
              </div>
              <div className={styles.infoWrapper}>
                <h4 className={styles.productTitle}>Liverpool Home Kit 25/26</h4>
                <span className={styles.originalPrice}>€39.99</span>
                <a className={styles.viewBtn}>
                  View Product
                </a>
              </div>
            </div>

            <div className={styles.productCard}>
              <div className={styles.imgWrapper}>
                <img src="catalog/bayern_home.png" alt="Bayern Home Kit" />
              </div>
              <div className={styles.infoWrapper}>
                <h4 className={styles.productTitle}>Bayern Munich Home Kit 25/26</h4>
                <span className={styles.originalPrice}>€39.99</span>
                <a className={styles.viewBtn}>
                  View Product
                </a>
              </div>
            </div>

          </div>

        </div>

        <div className={styles.featuredBasketball}>

          <h3>Basketball</h3>

          <div className={styles.productGrid}>

            <div className={styles.productCard}>
              <div className={styles.imgWrapper}>
                <img src="catalog/lakers_icon.jpg" alt="LA Lakers Icon Jersey" />
              </div>
              <div className={styles.infoWrapper}>
                <h4 className={styles.productTitle}>Lakers Icon Jersey 25/26</h4>
                <span className={styles.originalPrice}>€39.99</span>
                <a className={styles.viewBtn}>
                  View Product
                </a>
              </div>
            </div>

            <div className={styles.productCard}>
              <div className={styles.imgWrapper}>
                <img src="catalog/bulls_icon.jpg" alt="Chicago Bulls Icon Jersey" />
              </div>
              <div className={styles.infoWrapper}>
                <h4 className={styles.productTitle}>Chicago Bulls Icon Jersey 25/26</h4>
                <span className={styles.originalPrice}>€39.99</span>
                <a className={styles.viewBtn}>
                  View Product
                </a>
              </div>
            </div>

            <div className={styles.productCard}>
              <div className={styles.imgWrapper}>
                <img src="catalog/celtics_icon.jpg" alt="Boston Celtics Icon Jersey" />
              </div>
              <div className={styles.infoWrapper}>
                <h4 className={styles.productTitle}>Boston Celtics Icon Jersey 25/26</h4>
                <span className={styles.originalPrice}>€39.99</span>
                <a className={styles.viewBtn}>
                  View Product
                </a>
              </div>
            </div>

            <div className={styles.productCard}>
              <div className={styles.imgWrapper}>
                <img src="catalog/raptors_city.jpg" alt="Toronto Raptors City Jersey" />
              </div>
              <div className={styles.infoWrapper}>
                <h4 className={styles.productTitle}>Toronto Raptors City Jersey 25/26</h4>
                <span className={styles.originalPrice}>€39.99</span>
                <a className={styles.viewBtn}>
                  View Product
                </a>
              </div>
            </div>

          </div>

        </div>

      </section>

      <section className={styles.newArrivals}>


        <h2>New Arrivals</h2>

        <div className={styles.featuredFootball}>

          <h3>Football</h3>

          <div className={styles.productGrid}>

            <div className={styles.productCard}>

            </div>

            <div className={styles.productCard}>

            </div>

            <div className={styles.productCard}>

            </div>

            <div className={styles.productCard}>

            </div>

          </div>

        </div>

        <div className={styles.featuredBasketball}>

          <h3>Basketball</h3>

          <div className={styles.productGrid}>

            <div className={styles.productCard}>

            </div>

            <div className={styles.productCard}>

            </div>

            <div className={styles.productCard}>

            </div>

            <div className={styles.productCard}>

            </div>

          </div>

        </div>

      </section>

    </div>

  </div>
);


export default HomePage;
