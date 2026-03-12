  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const validateLogin = (data) => {
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

export const validateRegister = (data) => {
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