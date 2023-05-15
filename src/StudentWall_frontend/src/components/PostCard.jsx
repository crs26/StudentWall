import React, { useState, useEffect } from 'react'
import { BiUpvote, BiDownvote, BiTrash, BiPencil } from 'react-icons/bi'
import { Link } from '../../../../node_modules/react-router-dom/dist/index'
import { StudentWall_backend as backend } from '../../../declarations/StudentWall_backend';

export default function PostCard({
  data,
  editpost,
  setEditPost,
  content,
  comments,
  creator,
  title,
  vote,
  update }) {

  const [deleted, setDeleted] = useState(false);

  const upVote = async (id) => {
    console.log(await backend.upVote(id))
  }

  const downVote = async (id) => {
    console.log(await backend.downVote(id))
  }

  const deletePost = async (id) => {
    backend.deleteMessage(id).then(result => {
      setDeleted(true)
    })

    setTimeout(() => {
      setDeleted(false)
    }, 2000);
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
                  <h5>{data?.message?.text}</h5>
                  <p>
                    {data?.message?.content?.Text}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3 col-lg-2 my-auto">
              <div className='my-auto text-white'>
                <div className='d-flex justify-content-end gap-3 my-auto'>
                  <BiUpvote onClick={() => Number(upVote(data?.id))} />
                  <BiDownvote onClick={() => Number(downVote(data?.id))} />
                </div>
                <div className='d-flex justify-content-end gap-3 mt-2'>
                  <BiPencil onClick={() => {
                    setEditPost({ ...editpost, id: data?.id, subject: data?.message?.text, text: data?.message?.content?.Text, edit: true })
                  }} />
                  <BiTrash onClick={() => Number(deletePost(data?.id))} />
                </div>
              </div>
            </div>
            <div className="row justify-content-end px-0">
              <div className="col-4 col-sm-3 col-md-2 post-card-footer px-0">
                <p>{Number(data?.message?.vote) > 0 ? Number(data?.message?.vote) : '0'} upvotes</p>
              </div>
              <div className="col-4 col-sm-3 col-md-2 post-card-footer px-0">
                <Link to='/comment' state={data} >{data?.message?.comments?.length > 0 ? data?.message?.comments?.length : '0'} comments</Link>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}
