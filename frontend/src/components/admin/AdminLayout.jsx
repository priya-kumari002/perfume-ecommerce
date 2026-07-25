// import { Navigate, Outlet } from "react-router-dom";
// import useAuthStore from "../../store/authStore";
// import AdminSidebar from "./AdminSidebar";

// export default function AdminLayout() {
//   const user = useAuthStore((state) => state.user);

//   console.log("Current User in AdminLayout:", user); // ← yeh line add ki hai debugging ke liye

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (user.role !== "admin") {
//     return <Navigate to="/" replace />;
//   }

//   return (
//     <div className="flex min-h-screen bg-black text-white">
//       <AdminSidebar />
//       <main className="flex-1 ml-64 p-8">
//         <Outlet />
//       </main>
//     </div>
//   );
// }
import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const user = useAuthStore((state) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Top bar (mobile) */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-4 px-4 py-3 bg-gray-950 border-b border-gray-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-700 hover:border-yellow-500"
            aria-label="Open menu"
          >
            ☰
          </button>
          <span className="font-semibold text-yellow-500">Admin</span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}