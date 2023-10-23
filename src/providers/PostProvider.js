import { createContext } from "react";
import { useProvidePost } from "../hooks";

const initialState = {
    post: [],
    loading: true,
    updatePostState: () => {},
    updatePostLike: () => {},
    addComment: () => {},
    updateCommentLikes: () => {},
    deleteComment: () => {}
}

export const PostContext = createContext(initialState);

export const PostProvider = ({ children }) => {
    const post = useProvidePost();
    return <PostContext.Provider value={post}>{children}</PostContext.Provider>
}