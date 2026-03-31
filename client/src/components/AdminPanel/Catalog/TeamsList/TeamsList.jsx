import styles from './TeamsList.module.css';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import TeamModal from './TeamModal/TeamModal';
import ConfirmTeamModal from './ConfirmTeamModal/ConfirmTeamModal';

const INITIAL_TEAMS = [
  {
    id: 1,
    teamName: 'Manchester United',
    leagueId: 1,
    categoryId: 1,
    products: 120,
  },
  {
    id: 2,
    teamName: 'Liverpool',
    leagueId: 1,
    categoryId: 1,
    products: 110,
  },
  {
    id: 3,
    teamName: 'Los Angeles Lakers',
    leagueId: 2,
    categoryId: 2,
    products: 95,
  },
  {
    id: 4,
    teamName: 'Golden State Warriors',
    leagueId: 2,
    categoryId: 2,
    products: 90,
  },
  {
    id: 5,
    teamName: 'Bayern Munich',
    leagueId: 3,
    categoryId: 1,
    products: 85,
  },
  {
    id: 6,
    teamName: 'Borussia Dortmund',
    leagueId: 3,
    categoryId: 1,
    products: 70,
  },
  {
    id: 7,
    teamName: 'Juventus',
    leagueId: 4,
    categoryId: 1,
    products: 65,
  },
  {
    id: 8,
    teamName: 'AC Milan',
    leagueId: 4,
    categoryId: 1,
    products: 60,
  },
];

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


export default function TeamsList() {
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [leagues, setLeagues] = useState(INITIAL_LEAGUES);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);


  const handleSave = (formData) => {
    if (modal === 'add') {
      setTeams((prev) => [
        ...prev,
        { id: Date.now(), products: 0, ...formData }
      ]);
    } else {
      setTeams((prev) =>
        prev.map((t) => (t.id === modal.id ? { ...t, ...formData } : t))
      );
    }
    setModal(null);
  }

  const handleDelete = (id) => {
    setTeams((prev) => prev.filter((t) => t.id !== id))
    setDeleteTarget(null);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.upperSection}>
        <h2>Product Teams</h2>
        <button className={styles.addBtn} onClick={() => setModal('add')}>
          + Add team
        </button>
      </div>

      <div className={styles.toolbar}>

        <select className={styles.filter}>
          <option value="All categories">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.categoryId}>{cat.categoryName}</option>
          ))};
        </select>

        <select className={styles.filter}>
          <option value="All leagues">All leagues</option>
          {leagues.map((lea) => (
            <option key={lea.id} value={lea.leagueId}>{lea.leagueName}</option>
          ))};
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

            {teams.map((tea) => {
              const category = categories.find(c => c.id === tea.categoryId);
              const league = leagues.find(l => l.id === tea.leagueId)

              return (
                <tr key={tea.id}>
                  <td><strong>{tea.teamName}</strong></td>
                  <td>{league?.leagueName}</td>
                  <td> <span className={`${styles.badge} ${category?.categoryName === 'Football'
                    ? styles.football
                    : styles.basketball
                    }`}>
                    {category?.categoryName}</span></td>
                  <td>{tea.products}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.edit}
                        onClick={() => {
                          setModal({
                            id: tea.id,
                            teamName: tea.teamName,
                            leagueId: tea.leagueId,
                            categoryId: tea.categoryId
                          });
                        }}
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        className={styles.delete}
                        onClick={() => setDeleteTarget(tea)}
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
        {teams.map((tea) => {
          const category = categories.find(c => c.id === tea.categoryId);
          const league = leagues.find(l => l.id === tea.leagueId);

          return (
            <div key={tea.id} className={styles.card}>
              <div className={styles.cardTop}>
                <h3>{tea.teamName}</h3>
                <span className={`${styles.badge} ${category?.categoryName === 'Football'
                  ? styles.football
                  : styles.basketball
                  }`}>{category?.categoryName}</span>
              </div>

              <div className={styles.cardBody}>
                <p><strong>League:</strong> {league?.leagueName}</p>
                <p><strong>Products:</strong> {tea.products}</p>
                <div className={styles.cardActions}>
                  <button className={styles.edit} onClick={() => {
                    setModal({
                      id: tea.id,
                      teamName: tea.teamName,
                      leagueId: tea.leagueId,
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
          <TeamModal
            initialData={modal === "add" ? null : modal}
            leagues={leagues}
            categories={categories}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />,
          document.body
        )}

      {deleteTarget !== null &&
        createPortal(
          <ConfirmTeamModal
            name={deleteTarget.teamName}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={() => handleDelete(deleteTarget.id)}
          />,
          document.body
        )}

    </div>
  )
};


