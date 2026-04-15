import styles from './TeamsList.module.css';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";

import { useTeamApi } from '../../../../api/teamApi';
import { useLeagueApi } from '../../../../api/leagueApi';
import { useCategoryApi } from '../../../../api/categoryApi';

import TeamModal from './TeamModal/TeamModal';
import ConfirmTeamModal from './ConfirmTeamModal/ConfirmTeamModal';

export default function TeamsList() {
  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState(null);

  const [total, setTotal] = useState(0);
  const pageSize = 10;
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { getAll, create, update, remove } = useTeamApi();
  const { getAll: getLeagues } = useLeagueApi();
  const { getAllSimple } = useCategoryApi();

  const totalPages = Math.ceil(total / pageSize);

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedLeague, page]);

  const loadData = async () => {
    try {
      const [teamsRes, leaguesData, categoriesData] = await Promise.all([
        getAll(selectedCategory, selectedLeague, page),
        getLeagues(),
        getAllSimple()
      ]);

      setTeams(teamsRes.data);
      setTotal(teamsRes.total);
      setLeagues(leaguesData);
      setCategories(categoriesData);
      

    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (modal === 'add') {
        await create(formData.leagueId, formData.teamName);
      } else {
        await update(
          modal.id,
          formData.leagueId,
          formData.teamName
        );
      }

      await loadData();
      setModal(null);

    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await remove(id);
      await loadData();
      setDeleteTarget(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const getPages = () => {
    const pages = new Set();

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.add(i);
      }
      return Array.from(pages);
    }

    pages.add(1);

    if (page > 2) {
      pages.add('prevDots');
    }

    for (let i = page - 1; i <= page + 1; i++) {
      if (i > 1 && i < totalPages) {
        pages.add(i);
      }
    }

    if (page < totalPages - 1) {
      pages.add('nextDots');
    }

    pages.add(totalPages);

    return Array.from(pages);
  };

  return (
    <div className={styles.wrapper}>

      <div className={styles.upperSection}>
        <h2>Product Teams</h2>
        <button className={styles.addBtn} onClick={() => setModal('add')}>
          + Add team
        </button>
      </div>

      <div className={styles.toolbar}>
        <select
          className={styles.filter}
          value={selectedCategory ?? ''}
          onChange={(e) => {
            setSelectedCategory(e.target.value || null);
            setSelectedLeague(null);
            setPage(1);
          }}
        >
          <option value="">All categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          className={styles.filter}
          value={selectedLeague ?? ''}
          onChange={(e) => {
            setSelectedLeague(e.target.value || null);
            setPage(1);
          }}
        >
          <option value="">All leagues</option>
          {leagues
            .filter(l => !selectedCategory || l.categoryId === Number(selectedCategory))
            .map(lea => (
              <option key={lea.id} value={lea.id}>
                {lea.name}
              </option>
            ))}
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.teamsTable}>
          <thead>
            <tr>
              <th>Team</th>
              <th>League</th>
              <th>Category</th>
              <th>Products</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {teams.map((t) => (
              <tr key={t.id}>
                <td><strong>{t.name}</strong></td>
                <td>{t.leagueName}</td>
                <td>
                  <span className={`${styles.badge} ${t.categoryName === 'Football'
                    ? styles.football
                    : styles.basketball
                    }`}>
                    {t.categoryName}
                  </span>
                </td>
                <td>{t.productCount}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.edit}
                      onClick={() => setModal(t)}
                    >
                      <FaRegEdit />
                    </button>

                    <button
                      className={styles.delete}
                      onClick={() => setDeleteTarget(t)}
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
        {teams.map((tea) => {

          return (
            <div key={tea.id} className={styles.card}>
              <div className={styles.cardTop}>
                <h3>{tea.name}</h3>
                <span className={`${styles.badge} ${tea.categoryName === 'Football'
                  ? styles.football
                  : styles.basketball
                  }`}>{tea.categoryName}</span>
              </div>

              <div className={styles.cardBody}>
                <p><strong>League:</strong> {tea.leagueName}</p>
                <p><strong>Products:</strong> {tea.productCount}</p>
                <div className={styles.cardActions}>
                  <button className={styles.edit}
                  onClick={() => setModal(t)}
                  ><FaRegEdit /></button>
                  <button className={styles.delete} onClick={() => setDeleteTarget(tea)}><FaRegTrashAlt /></button>
                </div>
              </div>


            </div>
          );
        })}
      </div>

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
            p === 'prevDots' ? (
              <button
                key="prevDots"
                className={styles.pgBtn}
                onClick={() => setPage(p => Math.max(1, p - 3))}
              >
                ...
              </button>
            ) : p === 'nextDots' ? (
              <button
                key="nextDots"
                className={styles.pgBtn}
                onClick={() => setPage(p => Math.min(totalPages, p + 3))}
              >
                ...
              </button>
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

      {modal !== null &&
        createPortal(
          <TeamModal
            initialData={modal === "add" ? null : modal}
            leagues={leagues}
            categories={categories}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />,
          document.body
        )}

      {deleteTarget &&
        createPortal(
          <ConfirmTeamModal
            name={deleteTarget.name}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={() => handleDelete(deleteTarget.id)}
          />,
          document.body
        )}
    </div>
  );
}