import "./UserItem.css";
import { uploads } from "../utils/config";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

const PostItem = ({ post }) => {
  const { user, loading } = useSelector((state) => state.user);
  const { user: userAuth } = useSelector((state) => state.auth);

  return (
    <div className="post-item">
      <div className="profile-header-home">
        {user.profileImage && (
          <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} className="profilepic" />
        )}
        <div className="profile-description">
          <h2>{user.name}</h2>
        </div>
      </div>
      
      <p>{post.publicacao}</p>
      {post.image && (
        <img className="img-post" src={`${uploads}/posts/${post.image}`} alt={post.publicacao} />
      )}
      <p className="post-author">
        Publicada por:{" "}
        <Link to={`/users/${post.userId}`}>{post.userName}</Link>
      </p>
    </div>
  );
};

export default PostItem;
