import styles from './LeagueModal.module.css';
import { useState, useEffect } from 'react';

const LeagueModal = ({ initialData, categories, onClose, onSave }) => {
  const [leagueName, setleagueName] = useState(initialData?.leagueName ?? '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? '');
  const [touched, setTouched] = useState(false);
  const isEdit = initialData !== null;

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched(true);

    if (!leagueName.trim() || !categoryId) { return };
    onSave({
      leagueName: leagueName.trim(),
      categoryId: Number(categoryId),
    });

  }

  useEffect(() => {
    setleagueName(initialData?.leagueName ?? '');
    setCategoryId(initialData?.categoryId ?? '');
    
  }, [initialData]);

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
            {isEdit ? 'Edit league' : 'Add league'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>League Name</label>
            <input
              className={styles.input}
              value={leagueName}
              onChange={(e) => setleagueName(e.target.value)}
              placeholder="League Name"
              autoFocus
            />

              {touched && (!leagueName || leagueName.trim().length === 0) && (
                <p className={styles.error}>Please type a League Name</p>
              )}

            <label className={styles.label}>Category</label>
            <select
              className={styles.select}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {!isEdit && (
                <option value="">Select category</option>
              )}
                
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
              {touched && !categoryId && (
                <p className={styles.error}>Please select a category</p>
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

export default LeagueModal;
