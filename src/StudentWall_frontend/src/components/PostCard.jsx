import React, { useState, useEffect } from 'react'
import { BiUpvote, BiDownvote, BiTrash, BiPencil } from 'react-icons/bi'
import { Link } from '../../../../node_modules/react-router-dom/dist/index'
import { StudentWall_backend as backend } from '../../../declarations/StudentWall_backend';
import { useAuth } from "../helpers/use-auth-client";

export default function PostCard({id}) {

  useEffect(() => {
    console.log("postcard",id);
    getUpdatedMessage(id)
  }, [])
  

  const [deleted, setDeleted] = useState(false);
  const [post, setPost] = useState(null)
  const {isAuthenticated, principal} = useAuth()

  const upVote = async (id) => {
    backend.upVote(id).then(() => getUpdatedMessage(id))
  }

  const downVote = async (id) => {
    backend.downVote(id).then(() => getUpdatedMessage(id))
  }

  const deletePost = async (id) => {
    backend.deleteMessage(id).then(result => {
      setDeleted(true)
    })

    setTimeout(() => {
      setDeleted(false)
    }, 2000);
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
  return (
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
                  {/* <BiPencil onClick={() => {
                    setEditPost({ ...editpost, id: post?.id, subject: post?.text, text: post?.content?.Text, edit: true })
                  }} /> */}
                  <BiTrash onClick={() => Number(deletePost(post?.id))} />
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
  )
}
