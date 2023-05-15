import React, { useState, useEffect } from 'react'
import { BiUpvote, BiDownvote, BiTrash, BiPencil } from 'react-icons/bi'
import { Link } from '../../../../node_modules/react-router-dom/dist/index'
import { StudentWall_backend as backend } from '../../../declarations/StudentWall_backend';
import { useAuth } from "../helpers/use-auth-client";
import { Modal } from '../../../../node_modules/react-bootstrap/esm/index';
import { ToastContainer, toast } from 'react-toastify';


export default function PostCard({id}) {

  useEffect(() => {
    console.log("postcard",id);
    getUpdatedMessage(id)
  }, [])
  

  const [deleted, setDeleted] = useState(false);
  const [post, setPost] = useState(null)
  const {isAuthenticated, principal, whoamiActor} = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [postEdit, setPostEdit] = useState(null)
  const [postEditId, setPostEditId] = useState(null)

  const upVote = async (id) => {
    backend.upVote(id).then(() => {
      getUpdatedMessage(id)
      toast("Vote has been updated")
    })
  }

  const downVote = async (id) => {
    backend.downVote(id).then(() => {
      getUpdatedMessage(id)
      toast("Vote has been updated")
    })
  }

  const deletePost = async (id) => {
    backend.deleteMessage(id).then(result => {
      setDeleted(true)
      toast("Post has been deleted")
    })

    setTimeout(() => {
      setDeleted(false)
    }, 2000);
  }

  const updatePost = () => {
    backend.getMessage(id).then((m) => {
      console.log(m.ok)
      setPostEditId(id)
      setPostEdit(m.ok)
    })
  }

  const editPost = () => {
    console.log(postEdit)
    whoamiActor.updateMessage(id, postEdit?.text, { "Text": postEdit?.content?.Text }).then((result) => {
      getUpdatedMessage(id)
      setShowModal(false)
      toast("Post has been updated")
    })
  }

  const getUpdatedMessage = async (id) => {
    backend.getMessage(id).then(m => {
      console.log("postcard", m.ok)
      setPost(m.ok)
    })
  }

  const deleteAlert = () => {
    return (
      <div className='my-auto'>
        <h4 className='alert-text'>Deleted successfully</h4>
      </div>
    )
  }

  const renderEditModal = () => {
    return(
      <>
        <Modal show={showModal} className="" centered onHide={() => setShowModal(false)}>
          <Modal.Header>
          <h5 className="modal-title">Edit Post</h5>
          <button type="button" className="close" onClick={() => setShowModal(false)}>
            <span aria-hidden="true">&times;</span>
          </button>
          </Modal.Header>
          <Modal.Body>
            <div className='d-md-flex post-card my-3'>
              <div className='d-flex w-100 gap-md-4 justify-content-between justify-content-md-start'>
                <div className='col-1 my-auto d-flex'>
                  <img src='/user.png' className='user-img m-auto' />
                </div>
                <div className='col-10 col-md-10 d-grid form-inputs'>
                  <input name='subject' type='text' placeholder='Pick a topic' className='mb-2' defaultValue={postEdit?.text} onChange={(e) => setPostEdit({...postEdit, text:e.target.value})}/>
                  <textarea placeholder='Share something on your mind' defaultValue={postEdit?.content.Text} onChange={(e) => setPostEdit({...postEdit, content:{Text:e.target.value}})} 
                  ></textarea>
                </div>
              </div>
              <div className='mx-auto col-12 col-md-3 col-lg-2 d-flex'>
                <button className='primary-btn mt-2 my-md-auto w-100 px-0' onClick={editPost}>Edit Post</button>
              </div>
            </div >
          </Modal.Body>
          <Modal.Footer>
            Save Post
          </Modal.Footer>
        </Modal>
      </>
    )
  }
  return (
    <>
      <div className='px-2 mx-1'>
        <div className='row post-card my-3 justify-content-center'>
          {deleted ?
            deleteAlert() :
            <div className='row'>
              <div className='col-1 my-auto'>
                <img src='/user.png' className='user-img my-auto' />
              </div>
              <div className="col-5 col-md-8 col-lg-9 my-auto">
                <div className='d-flex'>
                  <div className='post my-auto'>
                    <h5>{post?.text}</h5>
                    <p>
                      {post?.content?.Text}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3 col-lg-2 my-auto">
                <div className='my-auto text-white'>
                  <div className='d-flex justify-content-end gap-3 my-auto'>
                    <BiUpvote onClick={() => Number(upVote(id))} />
                    <BiDownvote onClick={() => Number(downVote(id))} />
                  </div>
                  <div className={`d-flex justify-content-end gap-3 mt-2 ${ post?.creator.toString() == principal?.toString() ? 'd-block' : 'd-none' }`}>
                    <BiPencil onClick={() => {
                      updatePost()
                      setShowModal(true)
                    }} />
                    <BiTrash onClick={() => Number(deletePost(id))} />
                  </div>
                </div>
              </div>
              <div className="row justify-content-end px-0">
                <div className="col-4 col-sm-3 col-md-2 post-card-footer">
                  <p>{Number(post?.vote) > 0 ? Number(post?.vote) : '0'} upvotes</p>
                </div>
                <div className="col-4 col-sm-3 col-md-2 post-card-footer">
                  <Link to={`/comment/${id}`} state={post} >{post?.comments?.length > 0 ? post?.comments?.length : '0'} comments</Link>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
      {renderEditModal()}
    </>
  )
}
