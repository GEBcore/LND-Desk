import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from "react-router-dom";
import './style.css'
import App from './App'
import { Header } from '@/components/Header';

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
    <React.StrictMode>
        <HashRouter basename={"/"}>
          <>
            <Header/>
            <App />
          </>
        </HashRouter>
    </React.StrictMode>
)
