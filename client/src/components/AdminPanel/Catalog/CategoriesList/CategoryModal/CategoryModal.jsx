import { useState, useEffect } from 'react';
import styles from './CategoryModal.module.css';

const CategoryModal = ({ initialData, onClose, onSave }) => {

  const [name, setName] = useState(initialData?.name ?? '');
  const [touched, setTouched] = useState(false);
  const isEdit = initialData !== null;

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched(true);

    if (!name.trim()) return;

    onSave({ name: name.trim() });
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {isEdit ? 'Edit category' : 'Add category'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Name</label>
            <input
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category Name"
              autoFocus
            />
          {touched && (!name || name.trim().length === 0) && (
            <p className={styles.error}>Please type a Category Name</p>
          )}
          </div>



          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn}>
              {isEdit ? 'Save changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default CategoryModal;
