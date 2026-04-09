import styles from './LeaguesList.module.css';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { useLeagueApi } from '../../../../api/leagueApi';
import { useCategoryApi } from '../../../../api/categoryApi';
import LeagueModal from './LeagueModal/LeagueModal';
import ConfirmLeagueModal from './ConfirmLeagueModal/ConfirmLeagueModal';

export default function LeaguesList() {
  const [leagues, setLeagues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { getAll, create, update, remove } = useLeagueApi();
  const { getAllSimple } = useCategoryApi();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      const [categoriesData, leaguesData] = await Promise.all([
        getAllSimple(),
        getAll()
      ]);

      setCategories(categoriesData);
      setLeagues(leaguesData);

    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (modal === 'add') {
        const newLeague = await create(formData.categoryId, formData.leagueName);

        setLeagues(prev => [
          ...prev,
          {
            id: newLeague.id,
            name: newLeague.name,
            categoryId: newLeague.categoryId,
            teams: 0,
            products: 0
          }
        ]);

      } else {
        await update(
          modal.id,
          formData.leagueName,
          formData.categoryId
        );

        setLeagues(prev =>
          prev.map(l =>
            l.id === modal.id
              ? { ...l, name: formData.leagueName, categoryId: formData.categoryId }
              : l
          )
        );
      }

      await loadData();
      setModal(null);

    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (targetId) => {
    try {
      await remove(targetId);
      setLeagues(prev => prev.filter(l => l.id !== targetId));
      setDeleteTarget(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredLeagues = selectedCategory
    ? leagues.filter(l => l.categoryId === Number(selectedCategory))
    : leagues;

  return (
    <div className={styles.wrapper}>
      <div className={styles.upperSection}>
        <h2>Product Leagues</h2>
        <button className={styles.addBtn} onClick={() => setModal('add')}>
          + Add league
        </button>
      </div>

      <div className={styles.toolbar}>
        <select
          className={styles.filter}
          value={selectedCategory ?? ''}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
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
            {filteredLeagues.map((lea) => (
              <tr key={lea.id}>
                <td><strong>{lea.name}</strong></td>
                <td>
                  <span
                    className={`${styles.badge} ${lea?.categoryName === 'Football'
                      ? styles.football
                      : styles.basketball
                      }`}
                  >
                    {lea?.categoryName}
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
                          leagueName: lea.name,
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
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.cardsWrapper}>
        {filteredLeagues.map((lea) => (
          <div key={lea.id} className={styles.card}>
            <div className={styles.cardTop}>
              <h3>{lea.name}</h3>
              <span className={`${styles.badge} ${lea.categoryName === 'Football'
                ? styles.football
                : styles.basketball
                }`}>
                {lea.categoryName}
              </span>
            </div>

            <div className={styles.cardBody}>
              <p><strong>Teams:</strong> {lea.teams}</p>
              <p><strong>Products:</strong> {lea.products}</p>
              <div className={styles.cardActions}>
                <button
                  className={styles.edit}
                  onClick={() => {
                    setModal({
                      id: lea.id,
                      leagueName: lea.name,
                      categoryId: lea.categoryId
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
            </div>
          </div>
        ))}
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
            name={deleteTarget.name}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={() => handleDelete(deleteTarget.id)}
          />,
          document.body
        )}
    </div>
  );
}