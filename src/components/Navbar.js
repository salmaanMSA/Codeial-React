import styled from '../styles/navbar.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/index'

const Navbar = () => {
  const auth = useAuth();
  return (
    <div className={styled.nav}>
      <div className={styled.leftDiv}>
        <Link to="/">
          <img
            alt=""
            src="https://ninjasfiles.s3.amazonaws.com/0000000000003454.png"
          />
        </Link>
      </div>

      <div className={styled.rightNav}>
        {auth.user && (
          <div className={styled.user}>
            <Link to="/settings">
              <img
                src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
                alt="userProfile"
                className={styled.userDp}
              />  
            </Link>
            <span>{auth.user.name}</span>
          </div>
        )}

        <div className={styled.navLinks}>
          <ul>
            {auth.user ?
              <>
                <li onClick={auth.logout}>
                  Log out
                </li>
              </>
              :
              <>
                <li>
                  <Link to="/login">Log in</Link>
                </li>

                <li>
                  <Link to="/signup">Register</Link>
                </li>
              </>
            }
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;