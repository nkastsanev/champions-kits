import styles from './Security.module.css';
import { FiLock } from "react-icons/fi";

const Security = () => (
  <section id="security">

    <div className={styles.securityContainer}>

      <div className={styles.sectionTitle}>
        <h1>Security</h1>
      </div>

      <div className={styles.sectionContent}>

        <p>Manage your account security and privacy</p>

        <div className={styles.changePassSection}>

          <div className={styles.info}>
            
            <div className={styles.icon}>
            <FiLock />
            </div>

            <div className={styles.text}>
              <h3>Change Password</h3>
              <p>Update your password regularly to keep your account secure</p>
            </div>

          </div>

          <form className={styles.passwordForm} action="">
            <label htmlFor="currentPassword">Current Password</label>
            <input type="password" />

            <label htmlFor="newPassword">New Password</label>
            <input type="password" />

            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input type="password" />

            <div className={styles.btnContainer}>
              <button type="submit" className={styles.updateBtn}>
                Update Password
              </button>
            </div>
          </form>

        </div>

      </div>

    </div>

  </section>
);

export default Security;
