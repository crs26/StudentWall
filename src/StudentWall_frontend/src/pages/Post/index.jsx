import React from 'react'
import NewPostCard from '../../components/NewPostCard'
import PostCard from '../../components/PostCard'

export const Post = () => {
  return (
    <div className="container justify-content-center">
      <NewPostCard />
      <PostCard />
    </div>
  )
}
