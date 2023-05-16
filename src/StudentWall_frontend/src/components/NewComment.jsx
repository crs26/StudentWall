import React, { useRef } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../helpers/use-auth-client'

export default function NewComment ({ postId, update }) {
  const inText = useRef()
  const { whoamiActor } = useAuth()

  const addComment = () => {
    whoamiActor.writeComment(inText.current.value, postId).then((e) => {
      console.log(e)
      if (!e.err) {
        update()
        toast.success('Comment added')
      } else {
        toast.error(e.rr)
      }
    })
  }

  return (
    <div className='d-md-flex post-card my-3'>
      <div className='d-flex w-100 justify-content-between'>
        <div className='col-1 m-auto d-flex'>
          <img src='/user.png' className='user-img m-auto' />
        </div>
        <div className='col-11 d-grid form-inputs'>
          <textarea
            placeholder='What do you think?'
            className='ms-2 ms-lg-0 mx-md-2'
            ref={inText}
          />
        </div>
      </div>
      <div className='mx-auto col-12 col-md-3 col-lg-2 d-flex'>
        <button className='primary-btn mt-2 my-md-auto w-100 px-0' onClick={addComment}>Comment</button>
      </div>
    </div>
  )
}
