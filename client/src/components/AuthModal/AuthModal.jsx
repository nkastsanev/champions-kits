import React, { useEffect, useState } from 'react';
import { createPortal } from "react-dom";
import styles from './AuthModal.module.css';

import { validateLogin, validateRegister } from "../AuthModal/authValidation";

import LoginForm from './LoginForm/LoginForm';
import RegisterForm from './RegisterForm/RegisterForm';

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

    if (Object.keys(errors).length > 0) {
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
          <LoginForm
            handleLogin={handleLogin}
            handleChange={handleChange}
            handleBlur={handleBlur}
            loginErrors={loginErrors}
            loginTouched={loginTouched}
            loginFormData={loginFormData}
            loading={loading}
          />

        )}

        {mode === "register" && (
          <RegisterForm
            handleRegister={handleRegister}
            handleChange={handleChange}
            handleBlur={handleBlur}
            registerErrors={registerErrors}
            registerTouched={registerTouched}
            registerFormData={registerFormData}
            loading={loading}
            />
        )}

      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default AuthModal;
