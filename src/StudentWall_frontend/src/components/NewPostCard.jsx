import React, { useState, useEffect } from 'react'
import { useAuth } from '../helpers/use-auth-client'
import { toast } from 'react-toastify'

export default function NewPostCard ({ subject, body, edit, id, setEditPost, update, setData }) {
  const { whoamiActor } = useAuth()
  const [userImg, setUserImg] = useState(null)
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

  useEffect(() => {
    whoamiActor?.getUser([]).then((e) => {
      console.log(e)
      if (e?.ok) {
        const blob = new global.Blob([e.ok.image], { type: 'image/jpeg' })
        const urlCreator = window.URL || window.webkitURL
        const url = urlCreator.createObjectURL(blob)
        setUserImg(url)
      }
    })
  }, [whoamiActor])

  const createPost = () => {
    if (post?.text !== '' && post?.subject !== '') {
      whoamiActor.writeMessage(post?.subject, { Text: post?.text }).then((result) => {
        toast('Post has been uploaded')
        update()
      })
    } else {
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
      <div className='d-flex w-100 gap-md-4 justify-content-between justify-content-md-start'>
        <div className='col-1 my-auto d-flex'>
          <img src={userImg} className='user-img m-auto' />
        </div>
        <div className='col-10 col-md-10 d-grid form-inputs'>
          <input name='subject' type='text' placeholder='Pick a topic' className='mb-2' onChange={(e) => setPost({ ...post, subject: e.target.value })} value={post?.subject} />
          <textarea
            placeholder='Share something on your mind'
            value={post?.text}
            onChange={(e) => {
              setPost({ ...post, text: e.target.value })
            }}
          />
        </div>
      </div>
      <div className='mx-auto col-12 col-md-3 col-lg-2 d-flex'>
        <button className='primary-btn mt-2 my-md-auto w-100 px-0' onClick={handlePost}>{!edit ? 'Create Post' : 'Edit Post'}</button>
      </div>
    </div>
  )
}
