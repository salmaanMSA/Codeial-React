import styled from '../styles/navbar.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/index'
import { useEffect, useState } from 'react';
import { searchUsers } from '../api';

const Navbar = () => {
  const [results, setResults] = useState([]);
  const [searchText, setSearchText] = useState('');
  const auth = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await searchUsers(searchText);
      if (response.success){
        setResults(response.data.users);
      }
    }

    if (searchText.length > 2){
      fetchUser();
    }
    else{
      setResults([]);
    }
  }, [searchText]);

  const closeSearchBar = () =>{
    setSearchText('');
  }

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

      <div className={styled.searchContainer}>
        <img
          className={styled.searchIcon}
          src="https://cdn-icons-png.flaticon.com/128/751/751463.png"
          alt=""
        />

        <input
          placeholder="Search users"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {results.length > 0 && (
          <div className={styled.searchResults}>
            <ul>
              {results.map((user) => (
                <li
                  className={styled.searchResultsRow}
                  key={`user-${user._id}`}
                >
                  <Link to={`/user/${user._id}`} onClick={closeSearchBar}>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/1144/1144709.png"
                      alt=""
                    />
                    <span>{user.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
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