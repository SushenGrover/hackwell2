import { FaHospital, FaUserMd, FaClipboardList } from "react-icons/fa";
import hospitalLogo from "./hospital-logo.png";

const Sidebar = ({ activeTab, setActiveTab }) => (
  <nav className="bg-slate-800 text-white min-h-screen p-6 w-64 flex flex-col shadow-xl">
    {hospitalLogo && (
      <img
        src={hospitalLogo}
        alt="Hospital Logo"
        className="w-32 mx-auto mb-10"
      />
    )}
    <ul className="space-y-4 text-lg font-medium">
      <li
        onClick={() => setActiveTab("dashboard")}
        className={`cursor-pointer flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-slate-700 ${
          activeTab === "dashboard"
            ? "bg-slate-700 text-blue-300 border-l-4 border-blue-400"
            : "text-slate-300"
        }`}
      >
        <FaHospital className="mr-4 text-xl" /> Dashboard
      </li>
      <li
        onClick={() => setActiveTab("patients")}
        className={`cursor-pointer flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-slate-700 ${
          activeTab === "patients"
            ? "bg-slate-700 text-blue-300 border-l-4 border-blue-400"
            : "text-slate-300"
        }`}
      >
        <FaClipboardList className="mr-4 text-xl" /> Patient List
      </li>
      <li
        onClick={() => setActiveTab("upload")}
        className={`cursor-pointer flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-slate-700 ${
          activeTab === "upload"
            ? "bg-slate-700 text-blue-300 border-l-4 border-blue-400"
            : "text-slate-300"
        }`}
      >
        <FaUserMd className="mr-4 text-xl" /> Upload Records
      </li>
    </ul>
    <div className="mt-auto text-center pt-8 text-xs text-slate-500">
      &copy; City Hospital 2025
    </div>
  </nav>
);

export default Sidebar;
