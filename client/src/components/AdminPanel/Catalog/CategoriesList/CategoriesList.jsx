import styles from './CategoriesList.module.css';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import CategoryModal from './CategoryModal/CategoryModal';
import ConfirmCategoryModal from './ConfirmCategoryModal/ConfirmCategoryModal';

const INITIAL_CATEGORIES = [
  {
    id: 1,
    name: 'Football',
    leagues: 6,
    teams: 48,
    products: 620,
  },
  {
    id: 2,
    name: 'Basketball',
    leagues: 2,
    teams: 30,
    products: 230,
  },
];

export default function CategoriesList() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleSave = (formData) => {
    if (modal === 'add') {
      setCategories((prev) => [
        ...prev,
        { id: Date.now(), leagues: 0, teams: 0, products: 0, ...formData },
      ]);
    } else {
      setCategories((prev) =>
        prev.map((c) => (c.id === modal.id ? { ...c, ...formData } : c))
      );
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.upperSection}>
        <h2>Product Categories</h2>
        <button className={styles.addBtn} onClick={() => setModal('add')}>
          + Add category
        </button>
      </div>

      <div className={styles.grid}>
        {categories.map((cat) => (
          <div key={cat.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.cardTitle}>{cat.name}</h3>
              </div>
            </div>

            <div className={styles.statsRow}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{cat.leagues}</span>
                <span className={styles.statLabel}>Leagues</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statValue}>{cat.teams}</span>
                <span className={styles.statLabel}>Teams</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statValue}>{cat.products}</span>
                <span className={styles.statLabel}>Products</span>
              </div>
            </div>

            <div className={styles.cardActions}>
              <button
                className={styles.editBtn}
                onClick={() =>
                  setModal({ id: cat.id, name: cat.name})
                }
              >
                Edit
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => setDeleteTarget(cat)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal !== null &&
        createPortal(
          <CategoryModal
            initialData={modal === 'add' ? null : modal}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />,
          document.body
        )}

      {deleteTarget !== null &&
        createPortal(
          <ConfirmCategoryModal
            name={deleteTarget.name}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={() => handleDelete(deleteTarget.id)}
          />,
          document.body
        )}
    </div>
  );
}
