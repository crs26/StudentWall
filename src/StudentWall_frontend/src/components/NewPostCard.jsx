import React, { useState, useEffect } from 'react'
import { StudentWall_backend as backend } from '../../../declarations/StudentWall_backend';

export default function NewPostCard() {
  const [post, setPost] = useState({});
  const [alert, setAlert] = useState({
    message: '',
    status: false,
  });

  const createPost = () => {
    if (post?.text !== '' && post?.subject) {
      backend.writeMessage(post?.subject, { "Text": post?.text }).then((result) => {
        setAlert({ ...alert, message: 'New post added!', status: true })
      })
    }
    else {
      setAlert({ ...alert, message: 'Cannot add an empty post!', status: false })
    }
  }

  const showAlert = () => {
    return (
      <div><p>{alert.message}</p></div>
    )
  }

  return (

    <div className='d-md-flex post-card my-3'>
      {
        !alert.status ?
          <><div className='d-flex w-100 gap-md-4 justify-content-between justify-content-md-start'>
            <div className='col-1 my-auto d-flex'>
              <img src='/user.png' className='user-img m-auto' />
            </div>
            <div className='col-10 col-md-10 d-grid form-inputs'>
              <input name='subject' type='text' placeholder='Pick a topic' className='mb-2' onChange={(e) => setPost({ ...post, subject: e.target.value })} />
              <textarea placeholder='Share something on your mind'
                onChange={(e) => {
                  setPost({ ...post, text: e.target.value });
                }}
              ></textarea>
            </div>
          </div><div className='mx-auto col-12 col-md-3 col-lg-2 d-flex'>
              <button className='primary-btn mt-2 my-md-auto w-100 px-0' onClick={createPost}>Create Post</button>
            </div></>
          : showAlert()
      }
    </div >
  )
}
