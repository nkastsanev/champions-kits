import React, { useEffect, useState } from 'react';
import { createPortal } from "react-dom";
import styles from './AuthModal.module.css';

const AuthModal = ({ closeAuth }) => {

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closeAuth();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [closeAuth]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [mode, setMode] = useState("login");

  const [loading, setLoading] = useState(false);

  const [loginErrors, setLoginErrors] = useState({});
  const [loginTouched, setIsLoginTouched] = useState({
    email: false,
    password: false,
  });

  const [registerErrors, setRegisterErrors] = useState({});
  const [registerTouched, setIsRegisterTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    rePassword: false
  });

  const initialLoginFormData = {
    email: "",
    password: "",
  }

  const initialRegisterFormData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rePassword: "",
  }

  const [loginFormData, setLoginFormData] = useState(initialLoginFormData);
  const [registerFormData, setRegisterFormData] = useState(initialRegisterFormData);


  const handleSwitchToRegisterForm = () => {
    setMode("register");
    setLoginErrors({});
    setIsLoginTouched({ email: false, password: false });
    setLoginFormData(initialLoginFormData);
  }

  const handleSwitchToLoginForm = () => {
    setMode("login");
    setRegisterErrors({});
    setIsRegisterTouched({ firstName: false, lastName: false, email: false, password: false, rePassword: false })
    setRegisterFormData(initialRegisterFormData);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    const setCurrentFormData = mode === "login"
      ? setLoginFormData
      : setRegisterFormData;

    setCurrentFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: value
      };

      if (mode === "login") {
        setLoginErrors(validateLogin(updatedData));
      } else {
        setRegisterErrors(validateRegister(updatedData));
      }

      return updatedData;
    });

  }

  const handleBlur = (e) => {
    const { name } = e.target;

    if (mode === "login") {
      setIsLoginTouched(prev => ({
        ...prev,
        [name]: true
      }));

      setLoginErrors(validateLogin(loginFormData))
    } else {
      setIsRegisterTouched((prev => ({
        ...prev,
        [name]: true
      })));

      setRegisterErrors(validateRegister(registerFormData))
    }
  }

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const validateLogin = (data) => {
    const errors = {};
    const email = data.email.trim();
    const password = data.password;

    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email format";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    return errors;
  }

  const validateRegister = (data) => {
    const errors = {};
    const firstName = data.firstName.trim();
    const lastName = data.lastName.trim();
    const email = data.email.trim();
    const password = data.password;
    const rePassword = data.rePassword;

    if (!firstName) {
      errors.firstName = "First Name is required"
    } else if (firstName.length < 2) {
      errors.firstName = "First Name must be at least 2 characters"
    }

    if (!lastName) {
      errors.lastName = "Last Name is required"
    } else if (lastName.length < 2) {
      errors.lastName = "Last Name must be at least 2 characters"
    }

    if (!email) {
      errors.email = "Email is required"
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email format"
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (!rePassword) {
      errors.rePassword = "Please confirm your password"
    } else if (rePassword !== password) {
      errors.rePassword = "Passwords must match";
    }

    return errors;
  }

  const handleLogin = (e) => {
    e.preventDefault();

    const errors = validateLogin(loginFormData);
    setLoginErrors(errors);

    if (Object.keys(errors).length > 0) {
      setIsLoginTouched({
        email: true,
        password: true
      });
      return;
    }

    console.log(loginFormData);

    setLoginErrors({});
    setIsLoginTouched({ email: false, password: false });
    setLoginFormData(initialLoginFormData);
  }

  const handleRegister = (e) => {
    e.preventDefault();

    const errors = validateRegister(registerFormData);
    setRegisterErrors(errors);

    if (Object.keys(errors).length > 0){
      setIsRegisterTouched({
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        rePassword: true
      });
      return;
    }

    console.log(registerFormData);


    setRegisterErrors({});
    setIsRegisterTouched({ firstName: false, lastName: false, email: false, password: false, rePassword: false })
    setRegisterFormData(initialRegisterFormData);
  }


  return createPortal(
    <div className={styles.overlay} onClick={closeAuth}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >

        <div className={styles.optionBtns}>
          <button onClick={handleSwitchToLoginForm}>Login</button>
          <button onClick={handleSwitchToRegisterForm}>Register</button>
        </div>

        {mode === "login" && (
          <div className={styles.loginSection}>

            <h3>Login</h3>

            <form onSubmit={handleLogin}>
              <label htmlFor="email">Email</label>
              <input
                className={loginErrors.email && loginTouched.email ? `${styles.inputError}` : ""}
                type="text"
                placeholder='Email'
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
                className={loginErrors.password && loginTouched.password ? `${styles.inputError}` : ""}
                type="password"
                placeholder='Password'
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

        )}

        {mode === "register" && (
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
                type="text"
                placeholder="Email"
                id="email"
                name="email"
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
                value={registerFormData.rePassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {registerErrors.rePassword && registerTouched.rePassword && (
                <p className={styles.error}>{registerErrors.rePassword}</p>
              )}

              <div className={styles.btnContainer}>
                <button disabled={loading} type="submit" className={styles.registerBtn}>
                  {loading ? "Loading..." : "Register"}
                </button>
              </div>

            </form>

          </div>
        )}

      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default AuthModal;
