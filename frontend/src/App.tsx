import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/shared/layout";
import StatusTabs from "./components/status/status-tabs";
import SignupPage from "./pages/sigup";
import LoginPage from "./pages/login";
import Lawyers from "./components/lawyer/lawyers";
import CustomerList from "./components/customer/customer-list";
import CompanyProfile from "./pages/profile";
import FollowupTabs from "./components/follow-up/followup-tabs";
import ContactPage from "./pages/landing";
import Home from "./app/page";
import ProposedTabs from "./components/proposed/proposed-tab";
import LawyerTabs from "./components/lawyer-dash/proposed-tab";
import AgreementTab from "./components/add/agreement-tab";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/xyz"
            element={<MainLayout children={<div>Home</div>} />}
          />
          <Route
            path="/landing"
            element={<Home />}
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
          <Route
            path="/proposed"
            element={<MainLayout children={<ProposedTabs />} />}
          />
          <Route
            path="/lawyer-dashboard"
            element={<MainLayout children={<LawyerTabs />} />}
          />
          <Route
            path="/add-agreements"
            element={<MainLayout children={<AgreementTab />} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
