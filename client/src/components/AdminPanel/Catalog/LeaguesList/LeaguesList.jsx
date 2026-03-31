import styles from './LeaguesList.module.css';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import LeagueModal from './LeagueModal/LeagueModal';
import ConfirmLeagueModal from './ConfirmLeagueModal/ConfirmLeagueModal';

const INITIAL_LEAGUES = [
  {
    id: 1,
    leagueName: 'Premier League',
    categoryId: 1,
    teams: 20,
    products: 620,
  },
  {
    id: 2,
    leagueName: 'NBA',
    categoryId: 2,
    teams: 30,
    products: 230,
  },
  {
    id: 3,
    leagueName: 'Bundesliga',
    categoryId: 1,
    teams: 20,
    products: 120,
  },
  {
    id: 4,
    leagueName: 'Seria A',
    categoryId: 1,
    teams: 20,
    products: 100,
  },
];

const INITIAL_CATEGORIES = [
  {
    id: 1,
    categoryName: 'Football'
  },
  {
    id: 2,
    categoryName: 'Basketball'
  }
];


export default function LeaguesList() {
  const [leagues, setLeagues] = useState(INITIAL_LEAGUES);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleSave = (formData) => {
    if (modal === 'add') {
      setLeagues((prev) => [
        ...prev,
        { id: Date.now(), teams: 0, products: 0, ...formData }
      ]);
    } else {
      setLeagues((prev) =>
        prev.map((l) => (l.id === modal.id ? { ...l, ...formData } : l))
      );
    }
    setModal(null);
  }

  const handleDelete = (id) => {
    setLeagues((prev) => prev.filter((l) => l.id !== id))
    setDeleteTarget(null)
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.upperSection}>
        <h2>Product Leagues</h2>
        <button className={styles.addBtn} onClick={() => setModal('add')}>
          + Add league
        </button>
      </div>

      <div className={styles.toolbar}>

        <select className={styles.filter}>
          <option value="All categories">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.categoryName}>{cat.categoryName}</option>
          ))};
        </select>

      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.leaguesTable}>
          <thead>
            <tr>
              <th>League</th>
              <th>Category</th>
              <th>Teams</th>
              <th>Products</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {leagues.map((lea) => {
              const category = categories.find(c => c.id === lea.categoryId);

              return (
                <tr key={lea.id}>
                  <td><strong>{lea.leagueName}</strong></td>
                  <td>
                    <span
                      className={`${styles.badge} ${category?.categoryName === 'Football'
                          ? styles.football
                          : styles.basketball
                        }`}
                    >
                      {category?.categoryName}
                    </span>
                  </td>
                  <td>{lea.teams}</td>
                  <td>{lea.products}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.edit}
                        onClick={() => {
                          setModal({
                            id: lea.id,
                            leagueName: lea.leagueName,
                            categoryId: lea.categoryId,
                            teams: lea.teams,
                            products: lea.products
                          });
                        }}
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        className={styles.delete}
                        onClick={() => setDeleteTarget(lea)}
                      >
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}

          </tbody>
        </table>
      </div>

          <div className={styles.cardsWrapper}>
              {leagues.map((lea) => {
                const category = categories.find(c => c.id === lea.categoryId);
      
                return (
                  <div key={lea.id} className={styles.card}>
                    <div className={styles.cardTop}>
                      <h3>{lea.leagueName}</h3>
                      <span className={`${styles.badge} ${category?.categoryName === 'Football'
                        ? styles.football
                        : styles.basketball
                        }`}>{category?.categoryName}</span>
                    </div>
      
                    <div className={styles.cardBody}>
                      <p><strong>Teams:</strong> {lea.teams}</p>
                      <p><strong>Products:</strong> {lea.products}</p>
                      <div className={styles.cardActions}>
                        <button className={styles.edit} onClick={() => {
                          setModal({
                            id: lea.id,
                            leagueName: lea.teamName,
                            categoryId: tea.categoryId
                          });
                        }}><FaRegEdit /></button>
                        <button className={styles.delete} onClick={() => setDeleteTarget(tea)}><FaRegTrashAlt /></button>
                      </div>
                    </div>
      
      
                  </div>
                );
              })}
            </div>

      {modal !== null &&
        createPortal(
          <LeagueModal
            initialData={modal === "add" ? null : modal}
            categories={categories}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />,
          document.body
        )}

      {deleteTarget !== null &&
        createPortal(
          <ConfirmLeagueModal
            name={deleteTarget.leagueName}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={() => handleDelete(deleteTarget.id)}
          />,
          document.body
        )}

    </div>
  )
};