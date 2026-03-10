import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdPerson } from "react-icons/io";
import { MdAdminPanelSettings } from "react-icons/md";
import { BsCart2 } from "react-icons/bs";
import AuthModal from '../AuthModal/AuthModal';

const Header = ({ openAuth }) => {

  return (
    <header className={styles.header}>

      <div className={styles.topBar}>

        <span className={styles.topBarText}>✔️ 100% Authentic Kits</span>
        <span className={styles.topBarText}>🚚 Free Shipping over €100</span>
        <span className={styles.topBarText}>🔄 Easy Returns 14 Days</span>
      </div>

      <div className={styles.headerContainer}>

        <div className={styles.leftSide}>

          <div className={styles.logoWrapper}>
            <a href="#"><MdAdminPanelSettings className={styles.iconAdmin} /></a>
            <a href="#"><img src="/horizontal_logo.png" alt='Logo'></img></a>
          </div>

        </div>

        <div className={styles.centerSide}>
          <ul>
            <li><a className={styles.sale} href="#">SALE</a></li>
            <li><a href="#">FOOTBALL ▼</a>
              <ul className={styles.dropdown}>
                <li><a href="#">Premier League</a>
                  <ul className={styles.dropdownTeams}>
                    <li><a href="#">Arsenal</a></li>
                    <li><a href="#">Chelsea</a></li>
                    <li><a href="#">Manchester City</a></li>
                    <li><a href="#">Manchester United</a></li>
                    <li><a href="#">Liverpool</a></li>
                    <li><a href="#">Tottenham Hotspur</a></li>
                    <li><a href="#">All PL Teams</a></li>
                  </ul>
                </li>
                <li><a href="#">La Liga</a>
                  <ul className={styles.dropdownTeams}>
                    <li><a href="#">Atlético Madrid</a></li>
                    <li><a href="#">Barcelona</a></li>
                    <li><a href="#">Real Madrid</a></li>
                    <li><a href="#">Sevilla</a></li>
                    <li><a href="#">All La Liga Teams</a></li>
                  </ul>
                </li>
                <li><a href="#">Seria A</a>
                  <ul className={styles.dropdownTeams}>
                    <li><a href="#">Inter</a></li>
                    <li><a href="#">Juventus</a></li>
                    <li><a href="#">Milan</a></li>
                    <li><a href="#">Napoli</a></li>
                    <li><a href="#">Roma</a></li>
                    <li><a href="#">All Seria A Teams</a></li>
                  </ul>
                </li>
                <li><a href="#">Bundesliga</a>
                  <ul className={styles.dropdownTeams}>
                    <li><a href="#">Bayer 04 Leverkusen</a></li>
                    <li><a href="#">Bayern München</a></li>
                    <li><a href="#">Borussia Dortmund</a></li>
                    <li><a href="#">RB Leipzig</a></li>
                    <li><a href="#">All Bundesliga Teams</a></li>
                  </ul>
                </li>
                <li><a href="#">Ligue 1</a>
                  <ul className={styles.dropdownTeams}>
                    <li><a href="#">AS Monaco</a></li>
                    <li><a href="#">Olympique de Marseille</a></li>
                    <li><a href="#">Olympique Lyonnais</a></li>
                    <li><a href="#">PSG</a></li>
                    <li><a href="#">All Ligue 1 Teams</a></li>
                  </ul>
                </li>
                <li><a href="#">National Teams</a></li>
              </ul>
            </li>
            <li><a href="#">BASKETBALL ▼</a>
              <ul className={styles.dropdown}>
                <li><a href="#">NBA</a>
                  <ul className={styles.dropdownTeams}>
                    <li><a href="#">Boston Celtics</a></li>
                    <li><a href="#">Chicago Bulls</a></li>
                    <li><a href="#">Golden State Warriors</a></li>
                    <li><a href="#">Los Angeles Lakers</a></li>
                    <li><a href="#">New York Knicks</a></li>
                    <li><a href="#">All NBA Teams</a></li>
                  </ul>
                </li>
                <li><a href="#">Euroleague</a>
                  <ul className={styles.dropdownTeams}>
                    <li><a href="#">Barcelona</a></li>
                    <li><a href="#">Maccabi Tel Aviv</a></li>
                    <li><a href="#">Olympiacos</a></li>
                    <li><a href="#">Panathinaikos</a></li>
                    <li><a href="#">Real Madrid</a></li>
                    <li><a href="#">All EL Teams</a></li>
                  </ul>
                </li>
                <li><a href="#">National Teams</a></li>
              </ul>
            </li>
            <li><a href="#" className={styles.new}>NEW</a></li>
          </ul>
        </div>

        <div className={styles.rightSide}>
          <div className={styles.searchBar}>
            <input type="text" name="search" placeholder="Search..." />
            <a href="#">
              <AiOutlineSearch className={styles.iconSearch} />
            </a>
          </div>

          <ul>
            <li className={styles.profileItem}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openAuth();
                }}
              >
                <IoMdPerson className={styles.iconProfile} />
              </a>
              <ul className={styles.dropdown}>
                <li><a href="">Profile</a></li>
                <li><a href="">My Orders</a></li>
                <li><a href="">Log Out</a></li>
              </ul>
            </li>

            <li>
              <a href="#">
                <BsCart2 className={styles.iconCart} />
              </a>
            </li>
          </ul>

        </div>

      </div>
    </header>
  );
};


export default Header;
