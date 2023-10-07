import styles from '../styles/settings.module.css';
import { useAuth } from '../hooks';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Settings = () => {
  const auth = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(auth.user?.name ? auth.user.name : '');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [saving, setSaving] = useState(false);

  const clearForm = () => {
    setPassword('');
    setConfirmPass('');
  }

  const updateUser = async () => {
    setSaving(true);

    let error = false;
    if (!name || !password || !confirmPass) {
      toast("Please enter valid input fields");
      error = true;
    }

    if (password !== confirmPass){
      toast("Passwords do not match Confirm Password");
      error = true;
    }

    if(error){
      return setSaving(false);
    }
    else{
      const response = await auth.updateUser(auth.user._id, name, password, confirmPass);
      if (response.success){
        setEditMode(false);
        setSaving(false);
        clearForm();
        return toast("User Details updated successfully..!!!");
      }
      else{
        setSaving(false);
        return toast("Error: " + response.message);
      }
    }
  }

  return (
    <div className={styles.settings}>
      <div className={styles.imgContainer}>
        <img
          src="https://cdn-icons-png.flaticon.com/128/2202/2202112.png"
          alt=""
        />
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>Email</div>
        <div className={styles.fieldValue}>{auth.user?.email}</div>
      </div>
      {!editMode ?
        <div className={styles.field}>
          <div className={styles.fieldLabel}>Name</div>
          <div className={styles.fieldValue}>{auth.user?.name}</div>
        </div>
        :
        <div className={styles.field}>
          <div className={styles.fieldLabel}>Name</div>
          <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      }
      {editMode && (
        <>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Password</div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className={styles.field}>
            <div className={styles.fieldLabel}>Confirm Password</div>
            <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
          </div>
        </>
      )}
      {!editMode ?
        <div className={styles.btnGrp}>
          <button className={`button ${styles.editBtn}`} onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
        :
        <div className={styles.btnGrp}>
          <span>
            <button className={`button ${styles.saveBtn}`} onClick={() => updateUser()}>{saving ? "Saving.." : "Save"}</button>
            <button className={`button ${styles.backBtn}`} onClick={() => setEditMode(false)}>Back</button>
          </span>

        </div>
      }
    </div>
  );
};

export default Settings;