import { Routes, Route } from "react-router-dom";
import Main from "./pages/Main/Main";
import LndState from "./pages/LndState/LndState";
import Create from "./pages/Create/Create";
import './App.css';
import React from 'react';
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"


function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <Routes>
        <Route path="/" element={< Main />} />
        <Route path="/lndState" element={<LndState />} />
        <Route path="/create" element={<Create/>} />
      </Routes>
    </ChakraProvider>
  )
}

export default App
