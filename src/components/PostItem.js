import "./UserItem.css";

import { uploads } from "../utils/config";

import { Link } from "react-router-dom";

const PostItem = ({ post }) => {
  return (
    <div className="post-item">
      {post.image && (
        <img src={`${uploads}/posts/${post.image}`} alt={post.publicacao} />
      )}
      <h2>{post.title}</h2>
      <p className="post-author">
        Publicada por:{" "}
        <Link to={`/users/${post.userId}`}>{post.userName}</Link>
      </p>
    </div>
  );
};

export default PostItem;