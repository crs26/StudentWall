import React from 'react'
import { Home } from './pages/Home/index';
import { Post } from './pages/Post/index';
import { Message } from './pages/Message/index';
import { Route, Routes } from '../../../node_modules/react-router-dom/dist/index';


export const App = () => {

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/post" element={<Post />} />
                <Route path="/message" element={<Message />} />
            </Routes>
        </>
    )
}
