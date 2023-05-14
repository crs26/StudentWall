import React, { useState, useEffect } from 'react'
import { BiUpvote, BiDownvote } from 'react-icons/bi'
import { Link } from '../../../../node_modules/react-router-dom/dist/index'

export default function PostCard({
  data,
  id,
  content,
  comments,
  creator,
  title,
  vote }) {
  const [propsData, setPropsData] = useState(data);

  useEffect(() => {
    setPropsData({ ...propsData, id: id })
  }, []);

  return (
    <div className='px-2 mx-1'>
      <div className='row post-card my-3 justify-content-center'>
        <div className='row'>
          <div className='col-1 my-auto'>
            <img src='/user.png' className='user-img my-auto' />
          </div>
          <div className="col-9">
            <div className='d-flex'>
              <div className='post'>
                <p>
                  {data?.content?.Text}
                </p>
                <img className='my-3' src='/sample.jpg' />
              </div>
            </div>
          </div>
          <div className="col-2 my-auto">
            <div className='d-flex justify-content-end gap-3 my-auto text-white'>
              <BiUpvote />
              <BiDownvote />
            </div>
          </div>
          <div className="row justify-content-end px-0">
            <div className="col-2 post-card-footer">
              <p>{data?.vote?.length > 0 ? data?.vote?.length : '0'} upvotes</p>
            </div>
            <div className="col-2 post-card-footer">
              <Link to='/comment' state={propsData} >{data?.comments?.length > 0 ? data?.comments?.length : '0'} comments</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
