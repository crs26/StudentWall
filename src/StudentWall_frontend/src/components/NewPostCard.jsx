import React, { useState, useEffect } from 'react'
import { StudentWall_backend as backend } from '../../../declarations/StudentWall_backend';

export default function NewPostCard() {
  const [post, setPost] = useState({});

  const createPost = async () => {

  }
  useEffect(() => {
    console.log(post)
  }, [post]);
  return (
    <div className='d-flex post-card my-3'>
      <img src='/user.png' className='user-img my-auto' />
      <div className='d-grid form-inputs'>
        <input name='subject' type='text' placeholder='Pick a topic' className='mb-2' onChange={(e) => setPost({ ...post, subject: e.target.value })} />
        <textarea placeholder='Share something on your mind'
          onChange={(e) => {
            setPost({ ...post, text: e.target.value })
          }}
        ></textarea>
      </div>
      <button className='primary-btn my-auto'>Create Post</button>
    </div>
  )
}
