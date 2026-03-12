import { useState } from "react";
import styles from "./PersonalInfo.module.css";
import { LuUser } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { FiSave } from "react-icons/fi";

const PersonalInfo = () => {

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@email.com",
    phone: "+359 888 123 456"
  });

  const [originalData, setOriginalData] = useState(formData);

  const onEdit = () => {
    setOriginalData(formData);
    setIsEditing(true);
  };

  const onCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const onSave = (e) => {
    e.preventDefault();

    console.log(formData);
    setIsEditing(false);
  };

  const onChange = (e) => {
    setFormData(state => ({
      ...state,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="personal">

      <div className={styles.personalContainer}>

        <div className={styles.sectionTitle}>
          <h1>Personal Information</h1>
        </div>

        <div className={styles.sectionContent}>

          <p>Manage your personal details and addresses</p>

          <div className={styles.accountDetails}>

            <div className={styles.upperSection}>

              <div className={styles.left}>

                <div className={styles.icon}>
                  <LuUser />
                </div>

                <div className={styles.textContainer}>
                  <h3>Profile Details</h3>
                  <p>Your personal information</p>
                </div>

              </div>

              <div className={styles.buttons}>

                {!isEditing && (
                  <button
                    type="button"
                    className={styles.editBtn}
                    onClick={onEdit}
                  >
                    <MdOutlineEdit/> Edit
                  </button>
                )}

                {isEditing && (
                  <>
                    <button
                      className={styles.saveBtn}
                      onClick={onSave}
                    >
                     <FiSave />  Save
                    </button>

                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={onCancel}
                    >
                      <MdOutlineCancel/> Cancel
                    </button>
                  </>
                )}

              </div>

            </div>

            <form className={styles.accountDetailsForm}>

              <div className={styles.formContainer}>
                <label>First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={onChange}
                  disabled={!isEditing}
                />
              </div>

              <div className={styles.formContainer}>
                <label>Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={onChange}
                  disabled={!isEditing}
                />
              </div>

              <div className={styles.formContainer}>
                <label>Email Address</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  disabled
                />
              </div>

              <div className={styles.formContainer}>
                <label>Phone Number</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={onChange}
                  disabled={!isEditing}
                />
              </div>

            </form>

          </div>

        </div>

      </div>

    </section>
  );
};

export default PersonalInfo;