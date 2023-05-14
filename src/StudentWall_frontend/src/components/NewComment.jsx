import React, { useState, useEffect, useRef } from 'react'
import { StudentWall_backend as backend } from '../../../declarations/StudentWall_backend';

export default function NewComment({ postId, update }) {
  const [post, setPost] = useState({});
  const inText = useRef()

  const addComment = async () => {
    backend.writeComment(inText.current.value, postId).then(() => {
      update()
    })
  }

  useEffect(() => {
    console.log(post)
  }, [post]);
  return (
    <div className='d-md-flex post-card my-3'>
      <div className='d-flex w-100 justify-content-between'>
        <div className='col-1 m-auto d-flex'>
          <img src='/user.png' className='user-img m-auto' />
        </div>
        <div className='col-11 d-grid form-inputs'>
          <textarea placeholder='What do you think?'
            className='ms-2 ms-lg-0 mx-md-2'
            ref={inText}
          ></textarea>
        </div>
      </div>
      <div className='mx-auto col-12 col-md-3 col-lg-2 d-flex'>
        <button className='primary-btn mt-2 my-md-auto w-100 px-0' onClick={addComment}>Comment</button>
      </div>
    </div>
  )
}
