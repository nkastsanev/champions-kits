import styles from './LoginForm.module.css';

const LoginForm = ({
  handleLogin,
  handleChange,
  handleBlur,
  loginErrors,
  loginTouched,
  loginFormData,
  loading
}) => (
  <div className={styles.loginSection}>

    <h3>Login</h3>

    <form onSubmit={handleLogin}>
      <label htmlFor="email">Email</label>
      <input
        className={loginErrors.email && loginTouched.email ? styles.inputError : ""}
        type="text"
        placeholder="Email"
        id="email"
        name="email"
        value={loginFormData.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {loginErrors.email && loginTouched.email && (
        <p className={styles.error}>{loginErrors.email}</p>
      )}

      <label htmlFor="password">Password</label>
      <input
        className={loginErrors.password && loginTouched.password ? styles.inputError : ""}
        type="password"
        placeholder="Password"
        id="password"
        name="password"
        value={loginFormData.password}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {loginErrors.password && loginTouched.password && (
        <p className={styles.error}>{loginErrors.password}</p>
      )}

      <div className={styles.btnContainer}>
        <button disabled={loading} type="submit" className={styles.loginBtn}>
          {loading ? "Loading..." : "Login"}
        </button>
      </div>

    </form>

  </div>
);

export default LoginForm;