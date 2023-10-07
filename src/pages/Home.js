import styles from '../styles/home.module.css';
import Comment from '../components/Comment';
import { useEffect, useState } from 'react';
import { getPosts } from '../api';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const Home = () => {
  const [posts, setPost] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () =>{
      const response = await getPosts();
      if (response.success){
        setPost(response.data.posts)
      }
    }
    fetchPost();
    setLoading(false);
  }, []);

  if (loading){
    return <Loader />
  }
  
  return (
    <div className={styles.postsList}>
      {posts.map((post) => (
        <div className={styles.postWrapper} key={`post-${post._id}`}>
          <div className={styles.postHeader}>
            <div className={styles.postAvatar}>
              <img
                src="https://cdn-icons-png.flaticon.com/128/2202/2202112.png"
                alt="user-pic"
              />
              <div>
                <Link to={`user/:${post.user._id}`} className={styles.postAuthor}>{post.user.name}</Link>
                <span className={styles.postTime}>{post.createdAt}</span>
              </div>
            </div>
            <div className={styles.postContent}>{post.content}</div>

            <div className={styles.postActions}>
              <div className={styles.postLike}>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/4480/4480427.png"
                  alt="likes-icon"
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
              <input placeholder="Start typing a comment" />
            </div>

            <div className={styles.postCommentsList}>
              {post.comments.map((comment) => (
                <Comment comment={comment} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


export default Home;