import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-64">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-8">
          <img
            src="/mello-logo.png"
            alt="App Logo"
            className="h-28 w-auto mt-6 mb-4"
          />
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
