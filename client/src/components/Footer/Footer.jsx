import React from 'react';
import styles from './Footer.module.css';

const Footer = () => (
  <div className={styles.Footer}>
    <div className={styles.footerInner}>


      <div className={styles.footerTop}>

        <div className={styles.footerColumn}>

          <h4>Shop</h4>
          <ul>
            <li><a href="#">Football Kits</a></li>
            <li><a href="#">Basketball Kits</a></li>
            <li><a href="#">Sale</a></li>
            <li><a href="#">New Arrivals</a></li>
          </ul>

        </div>

        <div className={styles.footerColumn}>

          <h4>Information</h4>

          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Shipping & Delivery</a></li>
            <li><a href="#">Returns & Refunds</a></li>
            <li><a href="#">Size Guide</a></li>
          </ul>

        </div>

        <div className={styles.footerColumn}>

          <h4>Contact</h4>

          <ul>
            <li>Email: <a href="#">support@championskits.com</a></li>
            <li>Phone: <a href="#">+359 xxx xxx</a></li>
            <li>Working hours: Mon–Fri 9:00–18:00</li>
          </ul>

        </div>

      </div>

    </div>
      <div className={styles.copyrightSection}>
        <p>© 2026 Champions Kits. All rights reserved</p>
      </div>
  </div>
);


export default Footer;
