import styles from './RegisterForm.module.css';

const RegisterForm = ({
  handleRegister,
  handleChange,
  handleBlur,
  registerErrors,
  registerTouched,
  registerFormData,
  loading
}) => (
  <div className={styles.registerSection}>

    <h3>Register</h3>

    <form onSubmit={handleRegister}>
      <label htmlFor="firstName">First Name</label>
      <input
        className={registerErrors.firstName && registerTouched.firstName ? `${styles.inputError}` : ""}
        type="text"
        placeholder="First Name"
        id="firstName"
        name="firstName"
        value={registerFormData.firstName}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {registerErrors.firstName && registerTouched.firstName && (
        <p className={styles.error}>{registerErrors.firstName}</p>
      )}

      <label htmlFor="lastName">Last Name</label>
      <input
        className={registerErrors.lastName && registerTouched.lastName ? `${styles.inputError}` : ""}
        type="text"
        placeholder="Last Name"
        id="lastName"
        name="lastName"
        value={registerFormData.lastName}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {registerErrors.lastName && registerTouched.lastName && (
        <p className={styles.error}>{registerErrors.lastName}</p>
      )}

      <label htmlFor="email">Email</label>
      <input
        className={registerErrors.email && registerTouched.email ? `${styles.inputError}` : ""}
        type="email"
        placeholder="Email"
        id="email"
        name="email"
        autoComplete="email"
        value={registerFormData.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {registerErrors.email && registerTouched.email && (
        <p className={styles.error}>{registerErrors.email}</p>
      )}

      <label htmlFor="password">Password</label>
      <input
        className={registerErrors.password && registerTouched.password ? `${styles.inputError}` : ""}
        type="password"
        placeholder="Password"
        id="password"
        name="password"
        autoComplete="new-password"
        value={registerFormData.password}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {registerErrors.password && registerTouched.password && (
        <p className={styles.error}>{registerErrors.password}</p>
      )}

      <label htmlFor="rePassword">Confirm Password</label>
      <input
        className={registerErrors.rePassword && registerTouched.rePassword ? `${styles.inputError}` : ""}
        type="password"
        placeholder="Confirm Password"
        id="rePassword"
        name="rePassword"
        autoComplete="new-password"
        value={registerFormData.rePassword}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {registerErrors.rePassword && registerTouched.rePassword && (
        <p className={styles.error}>{registerErrors.rePassword}</p>
      )}

      {registerErrors.server && (
        <p className={styles.error}>{registerErrors.server}</p>
      )}

      <div className={styles.btnContainer}>
        <button disabled={loading} type="submit" className={styles.registerBtn}>
          {loading ? "Loading..." : "Register"}
        </button>
      </div>

    </form>

  </div>

);

export default RegisterForm;
