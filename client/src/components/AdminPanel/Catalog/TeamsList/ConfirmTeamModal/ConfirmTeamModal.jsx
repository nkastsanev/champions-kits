import styles from './ConfirmTeamModal.module.css';
import { useEffect } from 'react';

const ConfirmTeamModal = ({ name, onCancel, onConfirm }) => {

  return (
    <div className={styles.overlay}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Delete team</h2>
        </div>
        <p className={styles.confirmText}>
          Are you sure you want to delete <strong>{name}</strong>? This action
          cannot be undone.
        </p>
        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.confirmDeleteBtn} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmTeamModal;
