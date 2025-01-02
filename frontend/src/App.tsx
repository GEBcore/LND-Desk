import { Routes, Route } from "react-router-dom";
import Main from "./pages/Main/Main";
import LndState from "./pages/LndState/LndState";
import Create from "./pages/Create/Create";
import './App.css';
import React from 'react';

function App() {
    return (
        <Routes>
            <Route path="/" element={< Main />} />
            <Route path="/lndState" element={<LndState />} />
            <Route path="/create" element={<Create/>} />
        </Routes>
    )
}

export default App
