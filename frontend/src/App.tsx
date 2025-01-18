import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/shared/layout";
import SignupPage from "./pages/sigup";
import LoginPage from "./pages/login";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<MainLayout children={<div>Home</div>} />}
          />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
