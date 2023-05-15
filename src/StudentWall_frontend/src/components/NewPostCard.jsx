import React, { useState, useEffect } from 'react'
import { useAuth } from '../helpers/use-auth-client'
import { toast } from 'react-toastify'

export default function NewPostCard ({ subject, body, edit, id, setEditPost, update, setData }) {
  const { whoamiActor } = useAuth()

  const [post, setPost] = useState({
    subject: '',
    text: ''
  })
  const [alert, setAlert] = useState({
    message: '',
    status: false
  })

  useEffect(() => {
    setPost({ ...post, subject, text: body })
  }, [edit])

  useEffect(() => {
    if (alert.status) {
      setTimeout(() => {
        setAlert(false)
        setPost({ subject: '', text: '' })
        setEditPost({})
      }, 2000)
    }
  }, [alert.status])

  const createPost = () => {
    console.log('here')
    if (typeof post?.text !== 'undefined' && typeof post?.subject !== 'undefined') {
      whoamiActor.writeMessage(post?.subject, { Text: post?.text }).then((result) => {
        toast('Post has been created')
        update()
        setPost({ subject: '', text: '' })
      })
    } else {
      toast('Cannot create empty post')
      setAlert({ ...alert, message: 'Cannot add an empty post!', status: false })
    }
  }

  const updatePost = () => {
    if (subject !== '' && body !== '') {
      whoamiActor.updateMessage(id, post?.subject, { Text: post?.text }).then((result) => {
        toast('Post has been updated')
        update()
      })
    } else {
      toast('Cannot create empty post')
      setAlert({ ...alert, message: 'Cannot add an empty post!', status: false })
    }
  }

  const handlePost = () => {
    if (!edit) {
      createPost()
    } else if (edit) {
      updatePost()
    }
  }

  return (

    <div className='d-md-flex post-card my-3'>
      <div className='d-flex w-100 justify-content-between justify-content-md-start'>
        <div className='col-1 mx-auto'>
          <img src='/user.png' className='d-flex user-img mx-auto' />
        </div>
        <div className='col-10 col-md-11 d-grid form-inputs'>
          <input name='subject' type='text' placeholder='Pick a topic' className='mb-2' onChange={(e) => setPost({ ...post, subject: e.target.value })} value={post?.subject} />
          <textarea
            placeholder='Share something on your mind'
            value={post?.text}
            onChange={(e) => {
              setPost({ ...post, text: e.target.value })
            }}
          />
          <div className='mx-auto col-12 col-md-12 col-lg-2 justify-content-end mt-2 d-flex w-100'>
            <button className='primary-btn create-post-btn my-md-auto' onClick={handlePost}>{!edit ? 'Create Post' : 'Edit Post'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
