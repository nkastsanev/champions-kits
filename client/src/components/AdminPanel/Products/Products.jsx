import styles from './Products.module.css';
import AddProductModal from './AddProductModal/AddProductModal';

import { FaPlus } from "react-icons/fa";
import { FiBox, FiSearch } from "react-icons/fi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { LuEye } from "react-icons/lu";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { useAdminApi } from '../../../api/adminApi';

const Products = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  const [statsData, setStatsData] = useState({});
  
      const { getProductsDetails } = useAdminApi();
  
      const loadStatsData = async () => {
          try {
              const res = await getProductsDetails();
  
              setStatsData(res);
  
          } catch (err) {
              console.error(err.message);
          }
      };
  
      useEffect(() => {
          loadStatsData();
      }, []);

  return (
  <div className={styles.productsContainer}>

    <div className={styles.sectionTitle}>
      <div className={styles.info}>
        <h1>Products</h1>
        <p>Manage your product catalog</p>
      </div>
      <button onClick={() => setShowAddForm(true)}><FaPlus /> Add Product</button>
    </div>

    {showAddForm && (
       <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
             <AddProductModal onClose={() => setShowAddForm(false)} />
          </div>
       </div>
    )}

    <div className={styles.sectionContent}>

      <div className={styles.stats}>
        <div className={styles.card}>
          <div className={styles.statsInfo}>
            <p>Total Products</p>
            <h3>{statsData?.totalProducts}</h3>
          </div>
          <div className={`${styles.statsIcon} ${styles.productsIcon}`}>
            <FiBox />
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.statsInfo}>
            <p>Out of Stock</p>
            <h3>{statsData?.outOfStock}</h3>
          </div>
          <div className={`${styles.statsIcon} ${styles.outIcon}`}>
            <FiBox />
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.statsInfo}>
            <p>Total Sales</p>
            <h3>{statsData?.totalSales}</h3>
          </div>
          <div className={`${styles.statsIcon} ${styles.salesIcon}`}>
            <FaArrowTrendUp />
          </div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search by name or ID..."
          />
          <button className={styles.searchBtn}>
            <FiSearch />
          </button>
        </div>
        <select className={styles.filter}>
          <option value="">All categories</option>
          <option value="Football">Football</option>
          <option value="Basketball">Basketball</option>
        </select>
        <select className={styles.filter} disabled>
          <option value="">All leagues</option>
          <option value="1">La Liga</option>
          <option value="2">Premier League</option>
          <option value="3">Bundesliga</option>
          <option value="4">Ligue 1</option>
          <option value="5">Serie A</option>
          <option value="6">NBA</option>
        </select>
        <select className={styles.filter} disabled>
          <option value="">All clubs</option>
          <option value="1">Real Madrid</option>
          <option value="2">Barcelona</option>
          <option value="3">Manchester United</option>
          <option value="4">Bayern Munich</option>
          <option value="5">Paris Saint-Germain</option>
          <option value="6">Los Angeles Lakers</option>
          <option value="7">Liverpool</option>
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.productsTable}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>League/Club</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Sales</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>

            <tr>
              <td>
                <div className={styles.productCell}>
                  <img src="/inter_shirt.jpg" alt="product" />
                  <div>
                    <p className={styles.productName}>Real Madrid Home Kit</p>
                    <p className={styles.productId}>ID: 1</p>
                  </div>
                </div>
              </td>
              <td>Football</td>
              <td>
                <div className={styles.leagueAndClubCell}>
                  <p className={styles.leagueName}>La Liga</p>
                  <p className={styles.clubName}>Real Madrid</p>
                </div>
              </td>
              <td>€89.99</td>
              <td>
                <div className={styles.sizes}>
                  <p className={styles.size}>XS: 2</p>
                  <p className={styles.size}>S: 4</p>
                  <p className={styles.size}>M: 6</p>
                  <p className={styles.size}>L: 7</p>
                  <p className={styles.size}>XL: 2</p>
                  <p className={`${styles.size} ${styles.sizeZero}`}>XXL: 0</p>
                </div>
              </td>
              <td>110</td>
              <td><span className={`${styles.status} ${styles.active}`}>Active</span></td>
              <td>
                <div className={styles.actions}>
                  <div className={styles.show}><LuEye /></div>
                  <div className={styles.edit}><FaRegEdit /></div>
                  <div className={styles.delete}><FaRegTrashAlt /></div>
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className={styles.productCell}>
                  <img src="/inter_shirt.jpg" alt="product" />
                  <div>
                    <p className={styles.productName}>Barcelona Away Jersey</p>
                    <p className={styles.productId}>ID: 2</p>
                  </div>
                </div>
              </td>
              <td>Football</td>
              <td>
                <div className={styles.leagueAndClubCell}>
                  <p className={styles.leagueName}>La Liga</p>
                  <p className={styles.clubName}>Barcelona</p>
                </div>
              </td>
              <td>€95.50</td>
              <td>
                <div className={styles.sizes}>
                  <p className={`${styles.size} ${styles.sizeZero}`}>XS: 0</p>
                  <p className={styles.size}>S: 2</p>
                  <p className={styles.size}>M: 5</p>
                  <p className={styles.size}>L: 3</p>
                  <p className={styles.size}>XL: 1</p>
                  <p className={`${styles.size} ${styles.sizeZero}`}>XXL: 0</p>
                </div>
              </td>
              <td>982</td>
              <td><span className={`${styles.status} ${styles.active}`}>Active</span></td>
              <td>
                <div className={styles.actions}>
                  <div className={styles.show}><LuEye /></div>
                  <div className={styles.edit}><FaRegEdit /></div>
                  <div className={styles.delete}><FaRegTrashAlt /></div>
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className={styles.productCell}>
                  <img src="/inter_shirt.jpg" alt="product" />
                  <div>
                    <p className={styles.productName}>Manchester United Third Kit</p>
                    <p className={styles.productId}>ID: 3</p>
                  </div>
                </div>
              </td>
              <td>Football</td>
              <td>
                <div className={styles.leagueAndClubCell}>
                  <p className={styles.leagueName}>Premier League</p>
                  <p className={styles.clubName}>Manchester United</p>
                </div>
              </td>
              <td>€84.99</td>
              <td>
                <div className={styles.sizes}>
                  <p className={`${styles.size} ${styles.sizeZero}`}>XS: 0</p>
                  <p className={`${styles.size} ${styles.sizeZero}`}>S: 0</p>
                  <p className={`${styles.size} ${styles.sizeZero}`}>M: 0</p>
                  <p className={`${styles.size} ${styles.sizeZero}`}>L: 0</p>
                  <p className={`${styles.size} ${styles.sizeZero}`}>XL: 0</p>
                  <p className={`${styles.size} ${styles.sizeZero}`}>XXL: 0</p>
                </div>
              </td>
              <td>876</td>
              <td><span className={`${styles.status} ${styles.out}`}>Out of Stock</span></td>
              <td>
                <div className={styles.actions}>
                  <div className={styles.show}><LuEye /></div>
                  <div className={styles.edit}><FaRegEdit /></div>
                  <div className={styles.delete}><FaRegTrashAlt /></div>
                </div>
              </td>
            </tr>

          </tbody>
        </table>

      </div>

      <div className={styles.cardsWrapper}>

        <div className={styles.productCard}>
          <div className={styles.cardTop}>
            <img src="/inter_shirt.jpg" alt="product" />
            <div className={styles.cardTopInfo}>
              <h3>Real Madrid Home Kit</h3>
              <p>ID: 1 · La Liga · Real Madrid</p>
            </div>
            <span className={`${styles.status} ${styles.active}`}>Active</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Category</span>
              <span>Football</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Price</span>
              <span className={styles.cardPrice}>€89.99</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Sales</span>
              <span>110</span>
            </div>
          </div>
          <div className={styles.cardSizes}>
            <span className={styles.cardLabel}>Stock by size</span>
            <div className={styles.cardSizesGrid}>
              <div className={styles.cardSize}><span>XS</span><strong>2</strong></div>
              <div className={styles.cardSize}><span>S</span><strong>4</strong></div>
              <div className={styles.cardSize}><span>M</span><strong>6</strong></div>
              <div className={styles.cardSize}><span>L</span><strong>7</strong></div>
              <div className={styles.cardSize}><span>XL</span><strong>2</strong></div>
              <div className={`${styles.cardSize} ${styles.cardSizeZero}`}><span>XXL</span><strong>0</strong></div>
            </div>
          </div>
          <div className={styles.cardActions}>
            <div className={styles.show}><LuEye /></div>
            <div className={styles.edit}><FaRegEdit /></div>
            <div className={styles.delete}><FaRegTrashAlt /></div>
          </div>
        </div>

        <div className={styles.productCard}>
          <div className={styles.cardTop}>
            <img src="/inter_shirt.jpg" alt="product" />
            <div className={styles.cardTopInfo}>
              <h3>Barcelona Away Jersey</h3>
              <p>ID: 2 · La Liga · Barcelona</p>
            </div>
            <span className={`${styles.status} ${styles.active}`}>Active</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Category</span>
              <span>Football</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Price</span>
              <span className={styles.cardPrice}>€95.50</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Sales</span>
              <span>982</span>
            </div>
          </div>
          <div className={styles.cardSizes}>
            <span className={styles.cardLabel}>Stock by size</span>
            <div className={styles.cardSizesGrid}>
              <div className={`${styles.cardSize} ${styles.cardSizeZero}`}><span>XS</span><strong>0</strong></div>
              <div className={styles.cardSize}><span>S</span><strong>2</strong></div>
              <div className={styles.cardSize}><span>M</span><strong>5</strong></div>
              <div className={styles.cardSize}><span>L</span><strong>3</strong></div>
              <div className={styles.cardSize}><span>XL</span><strong>1</strong></div>
              <div className={`${styles.cardSize} ${styles.cardSizeZero}`}><span>XXL</span><strong>0</strong></div>
            </div>
          </div>
          <div className={styles.cardActions}>
            <div className={styles.show}><LuEye /></div>
            <div className={styles.edit}><FaRegEdit /></div>
            <div className={styles.delete}><FaRegTrashAlt /></div>
          </div>
        </div>

        <div className={styles.productCard}>
          <div className={styles.cardTop}>
            <img src="/inter_shirt.jpg" alt="product" />
            <div className={styles.cardTopInfo}>
              <h3>Manchester United Third Kit</h3>
              <p>ID: 3 · Premier League · Man Utd</p>
            </div>
            <span className={`${styles.status} ${styles.out}`}>Out of Stock</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Category</span>
              <span>Football</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Price</span>
              <span className={styles.cardPrice}>€84.99</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Sales</span>
              <span>876</span>
            </div>
          </div>
          <div className={styles.cardSizes}>
            <span className={styles.cardLabel}>Stock by size</span>
            <div className={styles.cardSizesGrid}>
              <div className={`${styles.cardSize} ${styles.cardSizeZero}`}><span>XS</span><strong>0</strong></div>
              <div className={`${styles.cardSize} ${styles.cardSizeZero}`}><span>S</span><strong>0</strong></div>
              <div className={`${styles.cardSize} ${styles.cardSizeZero}`}><span>M</span><strong>0</strong></div>
              <div className={`${styles.cardSize} ${styles.cardSizeZero}`}><span>L</span><strong>0</strong></div>
              <div className={`${styles.cardSize} ${styles.cardSizeZero}`}><span>XL</span><strong>0</strong></div>
              <div className={`${styles.cardSize} ${styles.cardSizeZero}`}><span>XXL</span><strong>0</strong></div>
            </div>
          </div>
          <div className={styles.cardActions}>
            <div className={styles.show}><LuEye /></div>
            <div className={styles.edit}><FaRegEdit /></div>
            <div className={styles.delete}><FaRegTrashAlt /></div>
          </div>
        </div>

      </div>

      <div className={styles.pagination}>
        <span className={styles.pgInfo}>Showing 1–3 of 3 products</span>
        <div className={styles.pgBtns}>
          <button className={styles.pgBtn}>‹</button>
          <button className={`${styles.pgBtn} ${styles.pgActive}`}>1</button>
          <button className={styles.pgBtn}>2</button>
          <button className={styles.pgBtn}>3</button>
          <button className={styles.pgBtn}>›</button>
        </div>
      </div>

    </div>
  </div>
  )
};

export default Products;
