import { useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/settings.module.css';
import { useState } from 'react';
import { useAuth } from '../hooks';
import { fetchUser } from '../api';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const UserProfile = () => {
    const { user_id } = useParams();
    const [user, setUser] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const response = await fetchUser(user_id);
            if (response.success) {
                setUser(response.data.user);
            }
            else{
                toast("Error: " + response.message);
                navigate('/');
            }
        }
        fetchUserDetails();
    }, [user_id, navigate, toast]);

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
                <div className={styles.fieldValue}>Email</div>
            </div>
            <div className={styles.field}>
                <div className={styles.fieldLabel}>Name</div>
                <div className={styles.fieldValue}>Name</div>
            </div>
            <div className={styles.btnGrp}>
                <button className={`button ${styles.saveBtn}`}>Add Friend</button>
            </div>
            <div className={styles.btnGrp}>
                <button className={`button ${styles.editBtn}`}>Remove Friend</button>
            </div>
        </div>
    );
};

export default UserProfile;