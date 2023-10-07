import { useEffect, useState } from 'react';
import styles from '../styles/login.module.css';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks';
import { useNavigate, Redirect } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password){
            toast("Enter your email or password");
        }
        const response = await auth.login(email, password);
        if (response.success){
            navigate('/');
            setLoggedIn(true);
            return toast("You have logged in successfully");
        }
        else{
            toast(`Error: ${response.message}`);
            console.log(response.message);
        }
    }

    useEffect(() => {
        if (auth.user){
            navigate('/');
        }
    }, [navigate]);
    

    return (
        <form className={styles.loginForm} onSubmit={handleFormSubmit}>
            <span className={styles.loginSignupHeader}>Log In</span>

            <div className={styles.field}>
                <input type="email" placeholder="Email" value={email} 
                onChange={(e) => {setEmail(e.target.value)}}/>
            </div>

            <div className={styles.field}>
                <input type="password" placeholder="Password" value={password}
                onChange={(e) => {setPassword(e.target.value)}}/>
            </div>

            <div className={styles.field}>
                <button disabled={loggedIn}>{loggedIn ? "Logging In.." : "Login"}</button>
            </div>
        </form>
    );
}

export default Login;