import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthenticationGeneral from "../pages/Auth/AuthenticationGeneral";
import IssuerDashBoard from "../pages/Issuer/IssuerDashboard";
import UserDashBoard from "../pages/User/UserDashboard";
import VerifySection from "../pages/VerifySection/VerifySection";
import ProfileSection from "../pages/Settings/ProfileSection";
import { AdminGeneralDashboard } from "../pages/Admin/AdminGeneralDashboard";
import { ContactUs } from "../components/ContactUs";


const CustomRouter = () => {
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<AuthenticationGeneral />}/>
            <Route path="/profile" element={<ProfileSection />}/>
            <Route path="/dashboard/issuer" element={<IssuerDashBoard />}/>
            <Route path="/dashboard/user" element={<UserDashBoard />}/>
            <Route path="/verify/:certid" element={<VerifySection />}/>
            <Route path="/verify" element={<VerifySection />}/>
            <Route path="/dashboard/admin" element={<AdminGeneralDashboard />}/>
            <Route path="/contact-us" element={<ContactUs />}/>
        </Routes>
    </BrowserRouter>
}

export default CustomRouter;