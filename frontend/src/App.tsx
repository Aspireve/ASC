import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/shared/layout";
import StatusTabs from "./components/status/status-tabs";
import SignupPage from "./pages/sigup";
import LoginPage from "./pages/login";
import Lawyers from "./components/lawyer/lawyers";
import CustomerList from "./components/customer/customer-list";
import CompanyProfile from "./pages/profile";
import FollowupTabs from "./components/follow-up/followup-tabs";

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
            path="/customers"
            element={<MainLayout children={<CustomerList />} />}
          />
          <Route
            path="/profile"
            element={<MainLayout children={<CompanyProfile />} />}
          />
          <Route
            path="/follow-up"
            element={<MainLayout children={<FollowupTabs />} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
