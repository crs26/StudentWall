import React from 'react'

export default function NewPostCard() {
  return (
    <div className='d-flex post-card my-3'>
      <img src='/user.png' className='user-img my-auto' />
      <textarea placeholder='Share something on your mind' className='mx-2'></textarea>
      <button className='primary-btn'>Create Post</button>
    </div>
  )
}
