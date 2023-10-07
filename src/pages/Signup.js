import { useState, useEffect } from 'react';
import styles from '../styles/signup.module.css';
import { toast } from 'react-toastify';
import { signUp } from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [signedIn, setSignedIn] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!email || !name || !password || !confirmPass) {
            toast('Enter all the input fields');
        }
        else if (password !== confirmPass){
            toast("Password and confirm password not match");
        }
        else {
            const response = await signUp(name, email, password, confirmPass);
            if (response.success) {
                navigate('/login');
                setSignedIn(true);
                return toast('User Registration Successfull');
                
            }
            else {
                toast("Error " + response.message);
            }
        }
    }

    useEffect(() => {
        if (auth.user){
            navigate('/');
        }
    }, [navigate]);

    return (
        <form className={styles.signupForm} onSubmit={handleFormSubmit}>
            <span className={styles.signupHeader}>SignUp</span>
            <div className={styles.field}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
            </div>
            <div className={styles.field}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => { setName(e.target.value) }} />
            </div>
            <div className={styles.field}>
                <input type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
            </div>
            <div className={styles.field}>
                <input type="password" placeholder="Confirm Password" value={confirmPass} onChange={(e) => { setConfirmPass(e.target.value) }} />
            </div>
            <div className={styles.field}>
                <button disabled={signedIn}>{signedIn ? "Signing In.." : "SignIn"}</button>
            </div>
        </form>
    );
}

export default SignUp;