import React, { useEffect, useState } from 'react'
import { BiUpvote, BiDownvote } from 'react-icons/bi'
import { Link, useLocation } from "react-router-dom";
import PostCard from '../../components/PostCard';
import { StudentWall_backend as backend } from "../../../../declarations/StudentWall_backend";

export const Comment = (props) => {
  const [comments, setComments] = useState();
  const location = useLocation();
  const data = location.state;
  const id = location.id;
  console.log(data);

  useEffect(() => {
    backend.getComment(data?.id).then((comments) => {
      setComments(comments)
    })
  }, [data?.id]);

  return (
    <div className="container justify-content-center" >
      <PostCard data={data} />
      {comments?.ok.map((comment, id) => {
        return (
          <div key={id} className='my-2 px-2 mx-1'>
            <div className='row post-card justify-content-center'>
              <div className='col d-flex gap-3'>
                <img src='/user.png' className='user-img my-auto' />
                <div className='my-auto'>
                  <p className='m-0'>
                    {comment?.text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
