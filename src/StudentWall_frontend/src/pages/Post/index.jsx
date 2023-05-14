import React, { useEffect, useState } from 'react'
import NewPostCard from '../../components/NewPostCard'
import PostCard from '../../components/PostCard'
import { StudentWall_backend as backend } from "../../../../declarations/StudentWall_backend";


export const Post = () => {
  const [posts, setPosts] = useState([{}])
  useEffect(() => {
    update()
  }, []);

  const update = () => {
    backend.getAllMessagesRanked().then((posts) => {
      setPosts(posts)
    })
  }

  return (
    <div className="container justify-content-center">
      <NewPostCard update={update}/>
      {
        posts?.map((post, id) => {
          return <PostCard key={id} id={id} data={post} update={update} />
        })
      }
    </div>
  )
}
