import React, { useRef } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../helpers/use-auth-client'

export default function NewComment({ postId, update }) {
  const inText = useRef()
  const { whoamiActor, user } = useAuth()

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

  const shortPrincipal = (p) => {
    if (p) return `${p.substring(0, 5)}...${p.substring(p.length - 3)}`
  }

  return (
    <div className='d-md-flex post-card my-3' style={{ position: 'relative' }}>
      <div className='d-flex w-100 justify-content-between'>
        <div className='col-2 m-auto text-center'>
          <div>
            <img src={user.image || '/user.png'} className='user-img my-auto' />
          </div>
          <p className='m-0'>{user.name}</p>
          <p>{shortPrincipal(user.principal)}</p>
        </div>
        <div className='col-10 d-grid form-inputs'>
          <textarea
            placeholder='What do you think?'
            className='ms-2 ms-lg-0 mx-md-2'
            ref={inText}
          />
        </div>
      </div>
      <div className='mx-auto col-12 col-md-3 col-lg-2 d-flex justify-content-end comment-btn-area'>
        <button className='primary-btn mt-2 my-md-auto px-3' onClick={addComment}>Comment</button>
      </div>
    </div>
  )
}
