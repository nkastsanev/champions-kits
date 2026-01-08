import React from 'react';
import styles from './Header.module.css';
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdPerson } from "react-icons/io";
import { BsCart2 } from "react-icons/bs";

const Header = () => (
  <header className={styles.header}>

    <div className={styles.headerContainer}>

      <div className={styles.leftSide}>
        <a href="#"><img src="/horizontal_logo.png" alt='Logo'></img></a>
      </div>

      <div className={styles.centerSide}>
        <ul>
          <li><a className={styles.sale} href="#">SALE</a></li>
          <li><a href="#">FOOTBALL ▼</a>
            <ul className={styles.dropdown}>
              <li><a href="#">Premier League</a>
              </li>
              <li><a href="#">La Liga</a></li>
              <li><a href="#">Seria A</a></li>
              <li><a href="#">Bundesliga</a></li>
              <li><a href="#">Ligue 1</a></li>
              <li><a href="#">National Teams</a></li>
            </ul>
          </li>
          <li><a href="#">BASKETBALL ▼</a>
            <ul className={styles.dropdown}>
              <li><a href="#">NBA</a></li>
              <li><a href="#">Euroleague</a></li>
              <li><a href="#">National Teams</a></li>
            </ul>
          </li>
          <li><a href="#" className={styles.new}>NEW</a></li>
        </ul>
      </div>

      <div className={styles.rightSide}>
        <div className={styles.searchBar}>
          <input type="text" name='search' placeholder='Search...' />
          <a href="#"><AiOutlineSearch className={styles.iconSearch} /></a>
        </div>
        <ul>
          <li><a href="#"><IoMdPerson className={styles.iconProfile} /></a></li>
          <li><a href="#"><BsCart2 className={styles.iconCart} /></a></li>
        </ul>
      </div>

    </div>
  </header>
);

export default Header;
