import React, { useEffect, useState } from 'react'
import NewPostCard from '../../components/NewPostCard'
import PostCard from '../../components/PostCard'
import { StudentWall_backend as backend } from "../../../../declarations/StudentWall_backend";


export const Post = () => {
  const [posts, setPosts] = useState([{}])
  const [editPost, setEditPost] = useState({});
  useEffect(() => {
    backend.getAllMessagesRanked().then((posts) => {
      setPosts(posts)
    })
  }, []);

  return (
    <div className="container justify-content-center">
      <NewPostCard setEditPost={setEditPost} id={editPost?.id} subject={editPost?.subject} body={editPost?.text} edit={editPost?.edit} />
      {
        posts?.map((post, id) => {
          return <PostCard key={id} id={id} data={post} setEditPost={setEditPost} editPost={editPost} />
        })
      }
    </div>
  )
}
