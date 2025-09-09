import { FaHospitalSymbol, FaUserMd, FaClipboardList } from "react-icons/fa";
import hospitalLogo from "./hospital-logo.png";

const Sidebar = ({ activeTab, setActiveTab }) => (
  <nav className="bg-[#072D7E] text-white min-h-screen p-6 w-60 flex flex-col shadow-lg">
    {hospitalLogo && (
      <img src={hospitalLogo} alt="Hospital Logo" className="w-28 mx-auto mb-6" />
    )}
    <ul className="space-y-6 text-lg font-semibold">
      <li
        onClick={() => setActiveTab("dashboard")}
        className={`cursor-pointer flex items-center ${activeTab === "dashboard" ? "text-blue-300" : ""}`}
      >
        <FaHospitalSymbol className="mr-3" /> Dashboard
      </li>
      <li
        onClick={() => setActiveTab("patients")}
        className={`cursor-pointer flex items-center ${activeTab === "patients" ? "text-blue-300" : ""}`}
      >
        <FaClipboardList className="mr-3" /> Patient List
      </li>
      <li
        onClick={() => setActiveTab("upload")}
        className={`cursor-pointer flex items-center ${activeTab === "upload" ? "text-blue-300" : ""}`}
      >
        <FaUserMd className="mr-3" /> Upload Records
      </li>
    </ul>
    <div className="mt-auto text-center pt-8 text-xs text-gray-400">© City Hospital 2025</div>
  </nav>
);

export default Sidebar;
