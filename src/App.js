import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/index";
import Painel from "./Pages/Painel/index";
import Login from "./Pages/Login/index";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/components/Painel" element={<Painel />} />
        <Route path="/components/Login"  element={<Login />}/>
      </Routes>
    </Router>
  );
}

export default App;