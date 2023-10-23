import styles from '../styles/home.module.css';
import Comment from '../components/Comment';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import FriendsList from '../components/FriendsList';
import CreatePost from '../components/CreatePost';
import { useAuth, usePosts } from '../hooks';
import { addComment, toggleLikes } from '../api';
import { toast } from 'react-toastify';

const Home = () => {
  const auth = useAuth();
  const posts = usePosts();
  const [comment, setComment] = useState("");
  const [isCommented, setIsCommented] = useState(false);

  const handleCommentFormSubmit = async (e) => {
    e.preventDefault();
    setIsCommented(true);
    const post_id = e.target[1].value;
    const response = await addComment(post_id, comment);
    if (response.success){
      setComment('');
      posts.addComment(post_id, response.data.comment);
      toast("Comments Added Succesfully");
    }
    else{
      toast("Error:" + response.message);
    }
    setIsCommented(false);
  }

  const handlePostLike = async (e) => {
    const post_id = e.target.getAttribute("data-post-id");
    const response = await toggleLikes(post_id, 'Post');
    if (response.success){
        let updateType = (response.data.deleted) ? 'RemoveLike' : 'AddLike';
        posts.updatePostLike(post_id, auth.user._id, updateType);
        toast((response.data.deleted) ? 'Like Removed Successfully' : 'Like Added Successfully');
    }
    else{
        toast("Error:" + response.message);
    }
}

  if (posts.loading) {
    return <Loader />
  }

  return (
    <div className={styles.home}>
      <div className={styles.postsList}>
        <CreatePost />
        {posts.data.map((post) => (
          <div className={styles.postWrapper} key={`post-${post._id}`}>
            <div className={styles.postHeader}>
              <div className={styles.postAvatar}>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/2202/2202112.png"
                  alt="user-pic"
                />
                <div>
                  <Link to={`user/${post.user._id}`} className={styles.postAuthor}>{post.user.name}</Link>
                  <span className={styles.postTime}>{post.createdAt}</span>
                </div>
              </div>
              <div className={styles.postContent}>{post.content}</div>

              <div className={styles.postActions}>
                <div className={styles.postLike} onClick={handlePostLike} value={post._id}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/4480/4480427.png"
                    alt="likes-icon"
                    data-post-id={post._id}
                  />
                  <span>{post.likes.length}</span>
                </div>

                <div className={styles.postCommentsIcon}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/2190/2190552.png"
                    alt="comments-icon"
                  />
                  <span>{post.comments.length}</span>
                </div>
              </div>
              <div className={styles.postCommentBox}>
                <form onSubmit={handleCommentFormSubmit}>
                  <input placeholder="Start typing a comment"
                    value={comment} onChange={(e) => setComment(e.target.value)} />
                  <input type='hidden' value={post._id} />
                  <span>
                    <button className={styles.addCommentBtn} disabled={isCommented ? true : false}>
                      {isCommented ? "Commenting" : "Comment"}
                    </button>
                  </span>
                </form>
              </div>

              <div className={styles.postCommentsList}>
                {post.comments.map((comment) => (
                  <Comment comment={comment} post_id={post._id}/>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {auth.user && <FriendsList />}
    </div>
  );
};


export default Home;