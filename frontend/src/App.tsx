import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/shared/layout";
import StatusTabs from "./components/status/status-tabs";
import SignupPage from "./pages/sigup";
import LoginPage from "./pages/login";
import Lawyers from "./components/lawyer/lawyers";
import CreateAgreement from "./pages/createAgreement";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={<MainLayout children={<div>Home</div>} />}
          />
          <Route
            path="/status"
            element={<MainLayout children={<StatusTabs />} />}
          />
          <Route
            path="/lawyers"
            element={<MainLayout children={<Lawyers />} />}
          />
          <Route
            path="/agreements/create"
            element={<MainLayout children={<CreateAgreement />} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
