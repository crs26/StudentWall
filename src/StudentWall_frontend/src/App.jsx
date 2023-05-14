import React from 'react'
import { Home } from './pages/Home/index';
import { Post } from './pages/Post/index';
import { Message } from './pages/Message/index';
import { Comment } from './pages/Comment/index';
import { Route, Routes } from '../../../node_modules/react-router-dom/dist/index';
import { Navbar } from './components/Navbar';


export const App = () => {

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/post" element={<Post />} />
                <Route path="/message" element={<Message />} />
                <Route path="/comment" element={<Comment />} />
            </Routes>
        </>
    )
}
