import React, { useState, useEffect } from 'react'
import { useAuth } from '../helpers/use-auth-client'
import { toast } from 'react-toastify'
import { BsFillImageFill } from 'react-icons/bs'

export default function NewPostCard({ update }) {
  const { whoamiActor, principal } = useAuth()
  const [userImg, setUserImg] = useState(null)
  const [userName, setUserName] = useState('')
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
    whoamiActor?.getUser([]).then((e) => {
      if (e?.ok) {
        const blob = new global.Blob([e.ok.image], { type: 'image/jpeg' })
        const urlCreator = window.URL || window.webkitURL
        const url = urlCreator.createObjectURL(blob)
        setUserImg(url)
        setUserName(e.ok.name)
      }
    })
  }, [whoamiActor])

  const createPost = () => {
    if (typeof post?.text !== 'undefined' && typeof post?.subject !== 'undefined') {
      if (imgBlob) {
        whoamiActor.writeMessage(post?.subject, { Image: imgBlob }).then((result) => {
          if (result.ok) {
            console.log('ok')
            toast.success('Post has been created')
            update()
            setPost({ subject: '', text: '' })
          } else {
            toast.error(result.err)
          }
        })
      } else {
        whoamiActor.writeMessage(post?.subject, { Text: post?.text }).then((result) => {
          if (result.ok) {
            console.log('ok 2')
            toast.success('Post has been created')
            update()
            setPost({ subject: '', text: '' })
          } else {
            toast.error(result.err)
          }
        })
      }
    } else {
      toast.error('Cannot create empty post')
      setAlert({ ...alert, message: 'Cannot add an empty post!', status: false })
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

  const shortPrincipal = (p) => {
    if (p) return `${p.substring(0, 5)}...${p.substring(p.length - 3)}`
  }

  const renderContentArea = () => {
    if (!imgBlob) {
      return (
        <div className='post-body'>
          <textarea
            className='w-100'
            placeholder='Share something on your mind'
            value={post?.text}
            onChange={(e) => {
              setPost({ ...post, text: e.target.value })
            }}
          />
          <div className='mx-auto col-6 col-md-3 col-lg-2 justify-content-start mt-2 d-flex w-100'>
            <label htmlFor='file-input' className='file-input'>
              <BsFillImageFill />
            </label>
            <input type='file' id='file-input' accept='image/*' className='col-6 btn btn-primary d-none' onChange={handleFileChange} />
          </div>
        </div>
      )
    } else {
      return (
        <div className='col-6' style={{ position: 'relative' }}>
          <img src={previewImage} className='img-upload-preview' />
          <button className='primary-btn close-preview-btn' onClick={() => setImgBlob(null)}>x</button>
        </div>
      )
    }
  }

  return (

    <div className='d-md-flex post-card my-3'>
      <div className='d-flex w-100 justify-content-between justify-content-md-start'>
        <div className='col-1 mx-auto'>
          <img src={userImg || '/user.png'} className='d-flex user-img mx-auto' />
          <p>{userName}</p>
          <p>{shortPrincipal(principal?.toString())}</p>
        </div>
        <div className='col-10 col-md-11 d-grid form-inputs'>
          <input name='subject' type='text' placeholder='Pick a topic' className='mb-2' onChange={(e) => setPost({ ...post, subject: e.target.value })} value={post?.subject} />
          {renderContentArea()}
          <div className='row'>
            <div className='mx-auto col-6 col-md-3 col-lg-2 justify-content-end mt-3 d-flex w-100'>
              <button className='primary-btn create-post-btn my-md-auto' onClick={createPost}>Create Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
