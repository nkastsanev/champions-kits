import styles from './TeamModal.module.css';
import { useState, useEffect } from 'react';

const TeamModal = ({ initialData, leagues, categories, onClose, onSave }) => {
  const [teamName, setTeamName] = useState(initialData?.teamName ?? '');
  const [leagueId, setLeagueId] = useState(initialData?.leagueId ?? '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? '');
  const [touched, setTouched] = useState(false);
  const isEdit = initialData !== null;

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched(true);

    if (!teamName.trim() || !categoryId || !leagueId) { return }
    onSave({
      teamName: teamName.trim(),
      leagueId: Number(leagueId),
      categoryId: Number(categoryId)
    });
  }

  useEffect(() => {
    setTeamName(initialData?.teamName ?? '');
    setLeagueId(initialData?.leagueId ?? '');
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
            {isEdit ? 'Edit team' : 'Add team'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Team Name</label>
            <input
              className={styles.input}
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team Name"
              autoFocus
            />

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
                  {cat.categoryName}
                </option>
              ))}
            </select>

            {touched && !categoryId && (
              <p className={styles.error}>Please select a category</p>
            )}

            <label className={styles.label}>League</label>
            <select
              className={styles.select}
              value={leagueId}
              onChange={(e) => setLeagueId(e.target.value)}
            >
              {!isEdit && (
                <option value="">Select league</option>
              )}

              {leagues.map((lea) => (
                <option key={lea.id} value={lea.id}>
                  {lea.leagueName}
                </option>
              ))}
            </select>

            {touched && !leagueId && (
              <p className={styles.error}>Please select a league</p>
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

export default TeamModal;
