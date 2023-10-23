import PropTypes from 'prop-types';
import styles from '../styles/home.module.css';
import { usePosts, useAuth } from '../hooks';
import { toggleLikes, deleteComment } from '../api';
import { toast } from 'react-toastify';

const Comment = ({ comment, post_id }) => {
    const posts = usePosts();
    const auth = useAuth();

    const handleCommentLike = async () => {
        const response = await toggleLikes(comment._id, 'Comment');
        if (response.success){
            let updateType = (response.data.deleted) ? 'RemoveLike' : 'AddLike';
            posts.updateCommentLikes(post_id, comment._id, auth.user._id, updateType);
            toast((response.data.deleted) ? 'Like Removed Successfully' : 'Like Added Successfully');
        }
        else{
            toast("Error:" + response.message);
        }
    }

    const handleCommentDelete = async () => {
        const response = await deleteComment(comment._id);
        if (response.success){
            posts.deleteComment(post_id, comment._id);
            toast("Comment Deleted Successfully");
        }
        else{
            toast("Error:" + response.message);
        }
    }

    return (
        <div className={styles.postCommentsItem} key={comment.id}>
            <div className={styles.postCommentHeader}>
                <span className={styles.postCommentAuthor}>{comment.user.name}</span>
                <span className={styles.postCommentTime}>{comment.createdAt}</span>
                <span className={styles.postCommentLikes}>{comment.likes.length}</span>
            </div>

            <div className={styles.postCommentContent}>
                {comment.content}
                <span onClick={handleCommentLike}>
                  <img className={styles.likeCommentBtn}
                    src="https://cdn-icons-png.flaticon.com/128/456/456115.png"
                    alt="likes-icon"
                  />
                </span>
                <span onClick={handleCommentDelete}>
                  <img className={styles.deleteCommentBtn}
                    src="https://cdn-icons-png.flaticon.com/128/3221/3221897.png"
                    alt="likes-icon"
                  />
                </span>
            </div>
        </div>
    )
}

Comment.prototype = {
    comment: PropTypes.object.isRequired,
}

export default Comment;    