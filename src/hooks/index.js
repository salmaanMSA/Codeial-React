import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { signUp, login as userLogin, editUser, fetchFriendsList, getPosts } from "../api/index";
import { setItemInLocalStorage, LOCALSTORAGE_TOKEN_KEY, removeItemFromLocalStorage, getItemFromLocalStorage } from "../utils";
import jwt from 'jwt-decode';
import { PostContext } from "../providers/PostProvider";

export const useAuth = () => {
    return useContext(AuthContext);
}

export const useProvideAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userDetails = async () => {
            const userToken = getItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
            if (userToken) {
                const user = jwt(userToken);
                const response = await fetchFriendsList();
                const friends = (response.success) ? response.data.friends : []
                setUser({
                    ...user,
                    friends: friends,
                });
            }
        }
        setLoading(false);
        userDetails();
    }, [])

    const login = async (email, password) => {
        const response = await userLogin(email, password);
        if (response.success) {
            setItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY,
                response.data.token ? response.data.token : null);
            const friendsListResp = await fetchFriendsList();
            const friends = (friendsListResp.success) ? friendsListResp.data.friends : [];
            setUser({ ...response.data.user, friends: friends });
            return {
                success: true
            }
        }
        else {
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
        if (response.success) {
            setUser(response.data.user);
            setItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY,
                response.data.token ? response.data.token : null);
            return {
                success: true
            }
        }
        else {
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

    const updateUserFriends = (addFriend, friend) => {
        if (addFriend) {
            setUser({
                ...user,
                friends: [...user.friends, friend]
            });
            return;
        }
        else {
            const newUserList = user.friends.filter(item => item.to_user._id != friend);
            setUser({
                ...user,
                friends: newUserList
            });
        }
    }

    return {
        user,
        login,
        signup,
        logout,
        loading,
        updateUser,
        updateUserFriends,
    }
}

export const usePosts = () => {
    return useContext(PostContext);
}

export const useProvidePost = () => {
    const [posts, setPosts] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            const response = await getPosts();
            console.log(response.data.posts);
            if (response.success) {
                setPosts(response.data.posts)
            }
            setLoading(false);
        }
        fetchPost();
    }, []);

    const updatePostState = (new_post) => {
        const newPost = [new_post, ...posts];
        setPosts(newPost);
    }

    const updatePostLike = (post_id, user_id, updateType) => {
        const updatedPost = posts.map(item => {
            if (item._id === post_id) {
                if (updateType === "AddLike"){
                    item.likes.push(user_id);
                }
                else if (updateType === "RemoveLike"){
                    const newArr = item.likes.filter(ele => ele !== user_id);
                    item.likes = newArr;
                }
                return item;
            }
            return item
        });
        setPosts(updatedPost);
    }

    const addComment = (post_id, comment) => {
        const updatedPost = posts.map(item => {
            if (item._id == post_id) {
                item.comments = [...item.comments, comment];
                return item;
            }
            return item
        });
        setPosts(updatedPost);
    }

    const updateCommentLikes = (post_id, comment_id, user_id, updateType) => {
        const updatedPost = posts.map(item => {
            if (item._id === post_id) {
                console.log(item);
                const updatedComment = item.comments.map(cmntItem => {
                    if (cmntItem._id === comment_id) {
                        console.log(cmntItem)
                        if (updateType === "AddLike"){
                            cmntItem.likes.push(user_id);
                        }
                        else if (updateType === "RemoveLike"){
                           const newArr = cmntItem.likes.filter(item => item !== user_id);
                           cmntItem.likes = newArr;
                        }
                    }
                })
                return item;
            }
            return item
        });
        setPosts(updatedPost);
    }

    const deleteComment = (post_id, comment_id) => {
        const updatedPost = posts.map(item => {
            if (item._id === post_id) {
                const newArr = item.comments.filter(item => item._id !== comment_id);
                item.comments = newArr;
                return item;
            }
            return item
        });
        setPosts(updatedPost);
    }

    return {
        data: posts,
        loading,
        updatePostState,
        updatePostLike,
        addComment,
        updateCommentLikes,
        deleteComment
    }
}