import { useState } from 'react';
import styles from '../styles/home.module.css';
import { createNewPost } from '../api';
import { toast } from 'react-toastify';
import { usePosts } from '../hooks';

const CreatePost = () => {
    const posts = usePosts();
    const [post, setPost] = useState("");
    const [isPosted, setIsPosted] = useState(false);

    const handlePostSubmit = async () => {
        setIsPosted(true);
        const response = await createNewPost(post);
        if (response.success){
            setPost('');
            posts.updatePostState(response.data.post)
            toast("Post created successfully");
        }
        else{
            toast("Error:", response.message);
        }
        setIsPosted(false);
    }

    return (
        <div className={styles.createPost}>
            <textarea className={styles.addPost} value={post} onChange={(e) => setPost(e.target.value)}></textarea>
            <div>
                <button className={styles.addPostBtn}
                onClick={handlePostSubmit} disabled={isPosted}>
                    {isPosted ? "Posting" : "Add Post"}</button>
            </div>
        </div>
    );
}

export default CreatePost;