import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<h1>404 Page not found</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
