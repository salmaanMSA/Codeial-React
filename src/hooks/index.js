import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import {signUp, login as userLogin, editUser} from "../api/index";
import { setItemInLocalStorage, LOCALSTORAGE_TOKEN_KEY, removeItemFromLocalStorage, getItemFromLocalStorage } from "../utils";
import jwt from 'jwt-decode';

export const useAuth = () => {
    return useContext(AuthContext);
}

export const useProvideAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userToken = getItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
        if (userToken) {
            const user = jwt(userToken);
            setUser(user);
        }
        setLoading(false);
    }, [])

    const login = async (email, password) => {
        const response = await userLogin(email, password);
        if (response.success){
            setUser(response.data.user);
            setItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY, 
                response.data.token ? response.data.token : null);
            return {
                success:  true
            }
        }
        else{
            return {
                success: false,
                message: response.message
            }
        }
    };

    const signup = async (name, email, password, confirmPassword) => {
        const response = await signUp(name, email, password, confirmPassword);
    
        if (response.success) {
          return {
            success: true,
          };
        } else {
          return {
            success: false,
            message: response.message,
          };
        }
    };

    const updateUser = async (id, name, password, confirm_password) => {
        const response = await editUser(id, name, password, confirm_password);
        if (response.success){
            setUser(response.data.user);
            setItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY, 
                response.data.token ? response.data.token : null);
            return {
                success:  true
            }
        }
        else{
            return {
                success: false,
                message: response.message
            }
        }
    }

    const logout = () => {
        setUser(null);
        removeItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
    };

    return {
        user,
        login,
        signup,
        logout,
        loading,
        updateUser,
    }
}