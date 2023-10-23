import { useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/settings.module.css';
import { useState } from 'react';
import { fetchUserProfile, createFriendship, removeFriendship } from '../api';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { useAuth } from '../hooks';

const UserProfile = () => {
    const auth = useAuth();
    const { userId } = useParams();
    console.log(userId);
    const [user, setUser] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [requestInProgress, setRequestInProgress] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const response = await fetchUserProfile(userId);
            if (response.success) {
                setUser(response.data.user);
            }
            else {
                toast("Error: " + response.message);
                navigate('/');
            }
            setLoading(false);
        }
        fetchUserDetails();
    }, [userId, navigate]);

    if (loading) {
        return <Loader />
    }

    const isUserAFriend = () => {
        const friendList = auth.user.friends;
        if (friendList.length > 0) {
            const friendIds = friendList.map(friend => friend.to_user._id);
            const index = friendIds.indexOf(userId);
            return (index != -1) ? true : false;
        }
        else {
            return false;
        }
    }

    const handleAddFriend = async () => {
        setRequestInProgress(true);
        const response = await createFriendship(userId);
        if (response.success) {
            const { friendship } = response.data;
            auth.updateUserFriends(true, friendship);
            toast("Friend added successfully");
        }
        else {
            toast("Error" + response.message);
        }
        setRequestInProgress(false);
    }

    const handleRemoveFriend = async () => {
        setRequestInProgress(true);
        const response = await removeFriendship(userId);
        auth.updateUserFriends(false, userId);
        if (response.success){
            auth.updateUserFriends(false, userId);
            toast("Friend removed successfully");
        }
        else {
            toast("Error" + response.message);
        }
        setRequestInProgress(false);
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
                <div className={styles.fieldValue}>{user.email}</div>
            </div>
            <div className={styles.field}>
                <div className={styles.fieldLabel}>Name</div>
                <div className={styles.fieldValue}>{user.name}</div>
            </div>
            <div className={styles.btnGrp}>
                {isUserAFriend() ?
                    <>
                        <button className={`button ${styles.editBtn}`}
                        onClick={handleRemoveFriend} disabled={requestInProgress}>
                            {requestInProgress ? "Removing Friend" : "Remove Friend"}</button>

                    </>
                    :
                    <>
                        <button className={`button ${styles.saveBtn}`} 
                        onClick={handleAddFriend} disabled={requestInProgress}>
                            {requestInProgress ? "Adding Friend" : "Add Friend"}</button>
                    </>
                }
            </div>
        </div>
    );
};

export default UserProfile;