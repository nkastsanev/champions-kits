import styles from './Products.module.css';
import AddProductModal from './AddProductModal/AddProductModal';

import { FaPlus } from "react-icons/fa";
import { FiBox, FiSearch } from "react-icons/fi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { LuEye } from "react-icons/lu";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";

import { useState, useEffect } from 'react';

import { useCategoryApi } from '../../../api/categoryApi';
import { useLeagueApi } from '../../../api/leagueApi';
import { useTeamApi } from '../../../api/teamApi';
import { useAdminApi } from '../../../api/adminApi';
import { useProductsApi } from '../../../api/productApi';

const Products = () => {
  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [leagueId, setLeagueId] = useState('');
  const [teamId, setTeamId] = useState('');
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');

  const [total, setTotal] = useState(0);
  const pageSize = 10;
  const [page, setPage] = useState(1);


  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [statsData, setStatsData] = useState({});

  const { getAllSimple: getAllCategories } = useCategoryApi();
  const { getAll: getAllLeagues } = useLeagueApi();
  const { getAllSimple: getAllTeams } = useTeamApi();
  const { getSizes, getAll, create, update, deleteProduct } = useProductsApi();
  const { getProductsDetails } = useAdminApi();

  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);


  useEffect(() => {
    loadStatsData();
    loadFiltersData();
    loadSizesData();
  }, []);

  useEffect(() => {
    loadProducts();
    console.log(products);
    console.log(categories);
    console.log(leagues);
    console.log(teams);




  }, [selectedCategory, selectedLeague, selectedTeam, page, search]);

  const loadStatsData = async () => {
    try {
      const res = await getProductsDetails();
      setStatsData(res);
    } catch (err) {
      console.error(err.message);
    }
  };

  const loadFiltersData = async () => {
    try {
      const [categoriesData, leaguesData, teamsData] = await Promise.all([
        getAllCategories(),
        getAllLeagues(),
        getAllTeams(),
      ]);
      setCategories(categoriesData);
      setLeagues(leaguesData);
      setTeams(teamsData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const loadSizesData = async () => {
    try {
      const res = await getSizes();
      setSizes(res);
    } catch (err) {
      console.error(err.message);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await getAll(
        search,
        selectedCategory || null,
        selectedLeague || null,
        selectedTeam || null,
        page
      );
      setProducts(res.products);
      setTotal(res.total);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSave = async (data) => {
    try {
      if (modal === 'add') {
        await create(data);
      } else {
        await update(modal.Id, data);
      }
      setModal(null);
      loadProducts();
      loadStatsData();
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.Id);
      setDeleteTarget(null);
      loadProducts();
      loadStatsData();
    } catch (err) {
      console.error(err.message);
    }
  };


  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };


  const getPages = () => {
    const pages = new Set();

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) pages.add(i);
      return Array.from(pages);
    }

    pages.add(1);
    if (page > 2) pages.add('prevDots');
    for (let i = page - 1; i <= page + 1; i++) {
      if (i > 1 && i < totalPages) pages.add(i);
    }
    if (page < totalPages - 1) pages.add('nextDots');
    pages.add(totalPages);

    return Array.from(pages);
  };

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
    setLeagueId('');
    setTeamId('');
  };

  const handleLeagueChange = (e) => {
    setLeagueId(e.target.value);
    setTeamId('');
  };

  const filteredLeagues = leagues.filter(league => {
    if (!categoryId) return true;
    return league.categoryId === Number(categoryId);
  });

  const filteredTeams = teams.filter(team => {
    if (!leagueId) return true;
    return team.leagueId === Number(leagueId);
  });

  return (
    <div className={styles.productsContainer}>

      <div className={styles.sectionTitle}>
        <div className={styles.info}>
          <h1>Products</h1>
          <p>Manage your product catalog</p>
        </div>
        <button onClick={() => setModal('add')}>
          <FaPlus /> Add Product
        </button>
      </div>

      {modal !== null && (
        <AddProductModal
          initialData={modal === 'add' ? null : modal}
          teams={teams}
          leagues={leagues}
          categories={categories}
          sizes={sizes}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {deleteTarget !== null && (
        <div className={styles.overlay} onClick={() => setDeleteTarget(null)}>
          <div className={styles.deleteModal} onClick={(e) => e.stopPropagation()}>
            <h3>Delete product</h3>
            <p>Are you sure you want to delete <strong>{deleteTarget.Name}</strong>? This action cannot be undone.</p>
            <div className={styles.deleteActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className={styles.deleteConfirmBtn} onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
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
              placeholder="Search by name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className={styles.searchBtn} onClick={handleSearch}>
              <FiSearch />
            </button>
          </div>

          <select
            className={styles.filter}
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); handleCategoryChange(e); }}
          >
            <option value="">All categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            className={styles.filter}
            value={selectedLeague}
            disabled={!selectedCategory}
            onChange={(e) => { setSelectedLeague(e.target.value); setPage(1); handleLeagueChange(e); }}
          >
            <option value="">All leagues</option>
            {filteredLeagues.map(lea => (
              <option key={lea.id} value={lea.id}>{lea.name}</option>
            ))}
          </select>

          <select
            className={styles.filter}
            value={selectedTeam}
            disabled={!selectedLeague}
            onChange={(e) => { setSelectedTeam(e.target.value); setPage(1); }}
          >
            <option value="">All teams</option>
            {filteredTeams.map(tea => (
              <option key={tea.id} value={tea.id}>{tea.name}</option>
            ))}
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
              {products.map(product => {
                const totalStock = product.sizes?.reduce((sum, s) => sum + s.Stock, 0) ?? 0;
                const isOutOfStock = totalStock === 0;

                return (
                  <tr key={product.id}>
                    <td>
                      <div className={styles.productCell}>
                        <img src={product.mainImage} alt={product.name} />
                        <div>
                          <p className={styles.productName}>{product.name}</p>
                          <p className={styles.productId}>ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td>{product.categoryName}</td>
                    <td>
                      <div className={styles.leagueAndClubCell}>
                        <p className={styles.leagueName}>{product.leagueName}</p>
                        <p className={styles.clubName}>{product.teamName}</p>
                      </div>
                    </td>
                    <td>€{Number(product.price).toFixed(2)}</td>
                    <td>
                      <div className={styles.sizes}>
                        {product.sizes?.map(s => (
                          <p
                            key={s.SizeId}
                            className={`${styles.size} ${s.Stock === 0 ? styles.sizeZero : ''}`}
                          >
                            {s.SizeName}: {s.Stock}
                          </p>
                        ))}
                      </div>
                    </td>
                    <td>{product.Sales ?? 0}</td>
                    <td>
                      <span className={`${styles.status} ${isOutOfStock ? styles.out : styles.active}`}>
                        {isOutOfStock ? 'Out of Stock' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <div className={styles.show}>
                          <LuEye />
                        </div>
                        <div
                          className={styles.edit}
                          onClick={() => setModal(product)}
                        >
                          <FaRegEdit />
                        </div>
                        <div
                          className={styles.delete}
                          onClick={() => setDeleteTarget(product)}
                        >
                          <FaRegTrashAlt />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {products.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.cardsWrapper}>
          {products.map(product => {
            const totalStock = product.sizes?.reduce((sum, s) => sum + s.Stock, 0) ?? 0;
            const isOutOfStock = totalStock === 0;

            return (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.cardTop}>
                  <img src={product.mainImage} alt={product.name} />
                  <div className={styles.cardTopInfo}>
                    <h3>{product.name}</h3>
                    <p>ID: {product.id} · {product.leagueName} · {product.teamName}</p>
                  </div>
                  <span className={`${styles.status} ${isOutOfStock ? styles.out : styles.active}`}>
                    {isOutOfStock ? 'Out of Stock' : 'Active'}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>Category</span>
                    <span>{product.categoryName}</span>
                  </div>
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>Price</span>
                    <span className={styles.cardPrice}>€{Number(product.price).toFixed(2)}</span>
                  </div>
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>Sales</span>
                    <span>{product.sales ?? 0}</span>
                  </div>
                </div>
                <div className={styles.cardSizes}>
                  <span className={styles.cardLabel}>Stock by size</span>
                  <div className={styles.cardSizesGrid}>
                    {product.sizes?.map(s => (
                      <div
                        key={s.SizeId}
                        className={`${styles.cardSize} ${s.Stock === 0 ? styles.cardSizeZero : ''}`}
                      >
                        <span>{s.SizeName}</span>
                        <strong>{s.Stock}</strong>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <div className={styles.show}><LuEye /></div>
                  <div className={styles.edit} onClick={() => setModal(product)}><FaRegEdit /></div>
                  <div className={styles.delete} onClick={() => setDeleteTarget(product)}><FaRegTrashAlt /></div>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 0 && (
          <div className={styles.pagination}>
            <span className={styles.pgInfo}>
              Showing {start}–{end} of {total} products
            </span>
            <div className={styles.pgBtns}>
              <button
                className={styles.pgBtn}
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                ‹
              </button>

              {getPages().map((p, i) =>
                p === 'prevDots' || p === 'nextDots' ? (
                  <span key={p + i} className={styles.pgDots}>…</span>
                ) : (
                  <button
                    key={p}
                    className={`${styles.pgBtn} ${page === p ? styles.pgActive : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                className={styles.pgBtn}
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                ›
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Products;
