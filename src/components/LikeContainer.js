import React from 'react'
import './LikeContainer.css'

import { BsHeart, BsHeartFill } from 'react-icons/bs'

const LikeContainer = ({ post, user, handleLike }) => {
    return (
        <div className="like">
            {post.likes && user && (
                <>
                    {post.likes.includes(user.id) ? (
                        <BsHeartFill onClick={() => handleLike(post)} /> // Ícone preenchido ao curtir
                    ) : (
                        <BsHeart onClick={() => handleLike(post)} /> // Ícone vazio antes de curtir
                    )}
                <p>{post.likes.length} like(s)</p>
                </>
            )}
        </div>
    )
}

export default LikeContainer
