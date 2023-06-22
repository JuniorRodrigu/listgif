import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/index";
import Painel from "./Pages/Painel/index";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/components/Painel" element={<Painel />} />
      </Routes>
    </Router>
  );
}

export default App;