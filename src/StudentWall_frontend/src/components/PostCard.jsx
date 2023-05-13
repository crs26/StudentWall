import React from 'react'

export default function PostCard() {
  return (
    <div className='d-flex post-card'>
      <img src='/user.png' className='user-img my-auto' />
      <textarea placeholder='Share something on your mind' className='mx-2'></textarea>
      <button className='primary-btn'>Create Post</button>
    </div>
  )
}
