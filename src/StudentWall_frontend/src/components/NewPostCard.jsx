import React, { useState, useEffect } from 'react'
import { useAuth } from '../helpers/use-auth-client'
import { toast } from 'react-toastify'

export default function NewPostCard ({ subject, body, edit, id, setEditPost, update, setData }) {
  const { whoamiActor } = useAuth()
  const [userImg, setUserImg] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [imgBlob, setImgBlob] = useState(null)
  const MAX_FILE_SIZE = 1048576
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
      if (e?.ok) {
        const blob = new global.Blob([e.ok.image], { type: 'image/jpeg' })
        const urlCreator = window.URL || window.webkitURL
        const url = urlCreator.createObjectURL(blob)
        setUserImg(url)
      }
    })
  }, [whoamiActor])

  const createPost = () => {
    if (typeof post?.text !== 'undefined' && typeof post?.subject !== 'undefined') {
      if (imgBlob) {
        whoamiActor.writeMessage(post?.subject, { Image: imgBlob }).then((result) => {
          toast('Post has been created')
          update()
          setPost({ subject: '', text: '' })
        })
      } else {
        whoamiActor.writeMessage(post?.subject, { Text: post?.text }).then((result) => {
          toast('Post has been created')
          update()
          setPost({ subject: '', text: '' })
        })
      }
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

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file && file.size <= MAX_FILE_SIZE) {
      const urlCreator = window.URL || window.webkitURL
      const url = urlCreator.createObjectURL(file)
      setPreviewImage(url)
      // Convert the selected image to a Blob

      // Perform upload logic with the Blob object
      const reader = new global.FileReader()
      reader.onloadend = () => {
        const arrayBuffer = reader.result
        const uint8Array = new Uint8Array(arrayBuffer)
        setImgBlob(uint8Array)
      }
      reader.readAsArrayBuffer(file)
    } else {
      toast('File too large')
    }
  }

  return (

    <div className='d-md-flex post-card my-3'>
      <div className='d-flex w-100 justify-content-between justify-content-md-start'>
        <div className='col-1 mx-auto'>
          <img src={userImg || '/user.png'} className='d-flex user-img mx-auto' />
        </div>
        <div className='col-10 col-md-11 d-grid form-inputs'>
          <input name='subject' type='text' placeholder='Pick a topic' className='mb-2' onChange={(e) => setPost({ ...post, subject: e.target.value })} value={post?.subject} />
          <img src={previewImage} />
          <textarea
            placeholder='Share something on your mind'
            value={post?.text}
            onChange={(e) => {
              setPost({ ...post, text: e.target.value })
            }}
          />
          <div className='row'>
            <div className='mx-auto col-6 col-md-3 col-lg-2 justify-content-end mt-3 d-flex w-100'>
              <label htmlFor='file-input' className='btn btn-primary'>
                Image
              </label>
              <input type='file' id='file-input' accept='image/*' className='col-6 btn btn-primary d-none' onChange={handleFileChange} />
            </div>
            <div className='mx-auto col-6 col-md-3 col-lg-2 justify-content-end mt-3 d-flex w-100'>
              <button className='primary-btn mt-2 my-md-auto' onClick={handlePost}>{!edit ? 'Create Post' : 'Edit Post'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
