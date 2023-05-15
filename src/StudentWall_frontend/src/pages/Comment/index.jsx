import React, { useEffect, useState } from 'react'
import { BiUpvote, BiDownvote } from 'react-icons/bi'
import { Link, useLocation, useParams } from 'react-router-dom'
import PostCard from '../../components/PostCard'
import { StudentWall_backend as backend } from '../../../../declarations/StudentWall_backend'
import NewComment from '../../components/NewComment'
import NewPostCard from '../../components/NewPostCard'

export const Comment = (props) => {
  const [comments, setComments] = useState()
  const [editPost, setEditPost] = useState({})
  const location = useLocation()
  const [data, setData] = useState(location.state)
  const { id } = useParams()
  const numId = parseInt(id)

  useEffect(() => {
    update()
  }, [])

  const update = () => {
    try {
      backend.getComment(numId).then((comments) => {
        setComments(comments)
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='container justify-content-center'>
      {editPost?.edit
        ? (
          <NewPostCard setEditPost={setEditPost} id={editPost?.id} subject={editPost?.subject} body={editPost?.text} edit={editPost?.edit} update={update} />
          )
        : ''}
      <PostCard id={numId} setEditPost={setEditPost} editPost={editPost} update={update} />
      {comments?.ok?.map((comment, id) => {
        return (
          <div key={id} className='my-2 px-2 mx-1'>
            <div className='row post-card justify-content-center'>
              <div className='col d-flex gap-3'>
                <img src='/user.png' className='user-img my-auto' />
                <div className='my-auto'>
                  <p className='m-0'>
                    {comment?.text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
      <NewComment postId={numId} update={update} />
    </div>
  )
}
