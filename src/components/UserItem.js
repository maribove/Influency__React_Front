import "./PostItem.css";

import { uploads } from "../utils/config";

import { Link } from "react-router-dom";

const UserItem = ({ user }) => {
  return (
    <div className="post-item">
     {user.profileImage && (
          <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} className="user-pic" />
        )}
       <h3>{user.type}</h3>
      <h2>{user.name}</h2>
      
      <p className="post-author">
        <Link to={`/users/${user.userId}`}>{user.userName}</Link>
      </p>
      {/* <p className="user-bio">{user.bio}</p> */}
    </div>
  );
};

export default UserItem;