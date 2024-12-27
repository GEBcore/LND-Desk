import { Routes, Route } from "react-router-dom";
import Main from "./pages/Main/Main";
import LndState from "./pages/LndState/LndState";
import './App.css';

function App() {
    return (
        <Routes>
            <Route path="/" element={< Main />} />
            <Route path="/lndState" element={<LndState />} />
        </Routes>
    )
}

export default App
