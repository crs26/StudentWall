import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import PostCard from '../../components/PostCard'
import NewComment from '../../components/NewComment'
import NewPostCard from '../../components/NewPostCard'
import { useAuth } from '../../helpers/use-auth-client'
import { BiTrash, BiPencil } from 'react-icons/bi'
import { Modal } from '../../../../../node_modules/react-bootstrap/esm/index'

export const Comment = (props) => {
  const [comments, setComments] = useState()
  const [editPost, setEditPost] = useState({})
  const [editComment, setEditComment] = useState({})
  const { messageId } = useParams()
  const numId = parseInt(messageId)
  const { whoamiActor, principal, user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const newCommref = useRef(null)

  useEffect(() => {
    update()
  }, [whoamiActor])

  const update = () => {
    try {
      whoamiActor?.getAllComment(numId).then((comments) => {
        setComments(comments)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const updateComment = () => {
    whoamiActor.updateComment(numId, editComment.id, newCommref.current.value).then((e) => {
      if (e.err) {
        toast.error(e.err)
      } else {
        setShowModal(false)
        toast.success('Comment successfully updated.')
        update()
      }
    })
  }

  const deleteComment = (commentId) => {
    whoamiActor.deleteComment(commentId, numId).then((e) => {
      if (e.err) {
        toast.error(e.err)
      } else {
        toast.success('Comment deleted successfully.')
        update()
      }
    })
  }

  const renderOwnerAction = (creator, id, text) => {
    if (creator === principal.toString()) {
      return (
        <div className='col-4' id={id}>
          <div className='col-1'>
            <BiPencil onClick={() => {
              setEditComment({ id, text })
              setShowModal(true)
            }}
            />
          </div>

          <div className='col-1'>
            <BiTrash onClick={() => deleteComment(id)} />
          </div>
        </div>
      )
    }
  }

  const renderEditModal = () => {
    return (
      <Modal show={showModal}>
        <Modal.Header>
          <h5 className='modal-title'>Edit Comment</h5>
          <button type='button' className='primary-btn-danger close' onClick={() => setShowModal(false)}>
            <span aria-hidden='true'>&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <input type='text' defaultValue={editComment.text} ref={newCommref} />
        </Modal.Body>
        <Modal.Footer>
          <button onClick={() => updateComment()}>Update Comment</button>
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    <div className='container justify-content-center'>
      {editPost?.edit
        ? (
          <NewPostCard setEditPost={setEditPost} id={editPost?.id} subject={editPost?.subject} body={editPost?.text} edit={editPost?.edit} update={update} />
          )
        : ''}
      <PostCard id={numId} setEditPost={setEditPost} editPost={editPost} update={update} />
      {comments?.ok?.map((comment, id) => {
        return (
          <div key={id} className='my-2 px-2 mx-1'>
            <div className='row post-card justify-content-center'>
              <div className='col-8 d-flex gap-3'>
                <img src={user.image || '/user.png'} className='user-img my-auto' />
                <div className='text-light'>
                  {user.name}
                  <br />
                  {user.principalShort}
                </div>
                <div className='my-auto'>
                  <p className='m-0'>
                    {comment?.text}
                  </p>
                  <p className='m-0'>
                    {comment?.creator.toString()}
                  </p>
                </div>
                <div className='text-light'>
                  {comment.updatedAt.length ? `Edited: ${Date(parseInt(comment.updatedAt))}` : `Posted: ${Date(parseInt(comment.createdAt))}`}
                </div>
              </div>
              {renderOwnerAction(comment.creator.toString(), id, comment.text)}
            </div>
          </div>
        )
      })}
      <NewComment postId={numId} update={update} />
      {renderEditModal()}
    </div>
  )
}
