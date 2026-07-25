// import { Link, useLocation } from "react-router-dom";

// const links = [
//   { name: "Dashboard", path: "/admin" },
//   { name: "Products", path: "/admin/products" },
//   { name: "Categories", path: "/admin/categories" },
//   { name: "Brands", path: "/admin/brands" },
//   { name: "Orders", path: "/admin/orders" },
//   { name: "Users", path: "/admin/users" },
//   { name: "Coupons", path: "/admin/coupons" },
// ];

// export default function AdminSidebar() {
//   const location = useLocation();

//   return (
//     <aside className="w-64 bg-gray-950 border-r border-gray-800 min-h-screen p-6 fixed left-0 top-0">
//       <h2 className="text-2xl font-bold text-yellow-500 mb-10">
//         LUXE<span className="text-white">Admin</span>
//       </h2>

//       <nav className="space-y-2">
//         {links.map((link) => (
//           <Link
//             key={link.path}
//             to={link.path}
//             className={`block px-4 py-3 rounded-lg transition ${
//               location.pathname === link.path
//                 ? "bg-yellow-600 text-black font-medium"
//                 : "text-gray-400 hover:bg-gray-900 hover:text-white"
//             }`}
//           >
//             {link.name}
//           </Link>
//         ))}
//       </nav>

//       <Link
//         to="/"
//         className="absolute bottom-8 left-6 right-6 text-center text-sm text-gray-500 hover:text-yellow-500"
//       >
//         ← Back to Store
//       </Link>
//     </aside>
//   );
// }
import { NavLink, Link } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/brands", label: "Brands" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/coupons", label: "Coupons" },
  { to: "/admin/users", label: "Users" },
];

export default function AdminSidebar({ open, onClose }) {
  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-gray-950 border-r border-gray-800
        flex flex-col transition-transform duration-300
        lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="p-5 border-b border-gray-800 flex items-center justify-between">
        <Link to="/admin" className="text-xl font-bold text-yellow-500">
          LUXE<span className="text-white">ADMIN</span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-400 hover:text-white text-xl"
        >
          ×
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onClose}
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-lg text-sm transition ${
                isActive
                  ? "bg-yellow-600 text-black font-medium"
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <Link
          to="/"
          onClick={onClose}
          className="block px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-900 hover:text-white"
        >
          ← Back to Store
        </Link>
      </div>
    </aside>
  );
}