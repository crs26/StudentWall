import React from 'react'
import { BiUpvote, BiDownvote } from 'react-icons/bi'

export default function PostCard() {
  return (
    <div>
      <div className='d-flex post-card my-3'>
        <img src='/user.png' className='user-img my-auto' />
        <div className='d-flex'>
          <div className='post'>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis sapiente voluptatem, omnis ipsa cupiditate blanditiis explicabo mollitia magnam! Eum sed, veniam maiores accusantium totam asperiores amet odio quas! Molestias, possimus?
            </p>
            <img className='my-3' src='/sample.jpg' />
          </div>

          <div className='d-flex gap-3 my-auto text-white'>
            <BiUpvote />
            <BiDownvote />
          </div>
        </div>
      </div>
    </div>
  )
}
