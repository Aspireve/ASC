import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/shared/layout";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<MainLayout children={<div>Home</div>} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
