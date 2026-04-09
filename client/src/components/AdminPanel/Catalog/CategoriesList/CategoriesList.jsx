import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCategoryApi } from '../../../../api/categoryApi';
import CategoryModal from './CategoryModal/CategoryModal';
import ConfirmCategoryModal from './ConfirmCategoryModal/ConfirmCategoryModal';
import styles from './CategoriesList.module.css';

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { getAll, create, update, remove } = useCategoryApi();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getAll();
      
      setCategories(data);
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (modal === 'add') {
        const newCategory = await create(formData.name);
        setCategories(prev => [...prev, {
          id: newCategory.id,
          name: newCategory.name,
          leagues: 0,
          teams: 0,
          products: 0
        }]);
      } else {
        const updated = await update(modal.id, formData.name);
        setCategories(prev => prev.map(c =>
          c.id === modal.id ? { ...c, name: updated.name} : c
        ));
      }
      setModal(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (targetId) => {
    try {
      await remove(targetId);
      setCategories(prev => prev.filter((c) => c.id !== targetId));
      setDeleteTarget(null);
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading) return <div className={styles.loader}>Loading categories...</div>;

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
              <h3 className={styles.cardTitle}>{cat.name}</h3>
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
              <button className={styles.editBtn} onClick={() => setModal({ id: cat.id, name: cat.name })}>
                Edit
              </button>
              <button className={styles.deleteBtn} onClick={() => setDeleteTarget(cat)}>
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
