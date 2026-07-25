// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import api from "../../api/axios";

// export default function AdminUsers() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchUsers = async () => {
//     try {
//       const { data } = await api.get("/admin/users");
//       setUsers(data.data || []);
//     } catch (error) {
//       toast.error("Failed to load users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const toggleBlock = async (id) => {
//     try {
//       await api.put(`/admin/users/${id}/block`);
//       toast.success("User updated");
//       fetchUsers();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed");
//     }
//   };

//   const changeRole = async (id, role) => {
//     try {
//       await api.put(`/admin/users/${id}/role`, { role });
//       toast.success("Role updated");
//       fetchUsers();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed");
//     }
//   };

//   if (loading) return <div className="text-gray-400 p-10">Loading users...</div>;

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-8">
//         Users <span className="text-gray-500 text-lg">({users.length})</span>
//       </h1>

//       <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-x-auto">
//         <table className="w-full text-left text-sm">
//           <thead className="bg-gray-800 text-gray-400">
//             <tr>
//               <th className="p-4">User</th>
//               <th className="p-4">Email</th>
//               <th className="p-4">Role</th>
//               <th className="p-4">Status</th>
//               <th className="p-4">Joined</th>
//               <th className="p-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user, i) => (
//               <motion.tr
//                 key={user._id}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: i * 0.03 }}
//                 className="border-t border-gray-800 hover:bg-gray-800/40"
//               >
//                 <td className="p-4">
//                   <div className="flex items-center gap-3">
//                     <img
//                       src={
//                         user.avatar
//                           ? `http://localhost:5000${user.avatar}`
//                           : `https://ui-avatars.com/api/?name=${user.name}&background=ca8a04&color=fff&size=40`
//                       }
//                       alt=""
//                       className="w-9 h-9 rounded-full object-cover"
//                     />
//                     <span className="font-medium">{user.name}</span>
//                   </div>
//                 </td>
//                 <td className="p-4 text-gray-400">{user.email}</td>
//                 <td className="p-4">
//                   <select
//                     value={user.role}
//                     onChange={(e) => changeRole(user._id, e.target.value)}
//                     className="bg-black border border-gray-700 rounded px-2 py-1 text-xs capitalize"
//                   >
//                     <option value="customer">Customer</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                 </td>
//                 <td className="p-4">
//                   <span
//                     className={`px-2 py-1 rounded text-xs ${
//                       user.isBlocked
//                         ? "bg-red-900 text-red-400"
//                         : "bg-green-900 text-green-400"
//                     }`}
//                   >
//                     {user.isBlocked ? "Blocked" : "Active"}
//                   </span>
//                 </td>
//                 <td className="p-4 text-gray-400 text-xs">
//                   {new Date(user.createdAt).toLocaleDateString()}
//                 </td>
//                 <td className="p-4">
//                   {user.role !== "admin" && (
//                     <button
//                       onClick={() => toggleBlock(user._id)}
//                       className={`px-3 py-1.5 rounded text-xs font-medium ${
//                         user.isBlocked
//                           ? "bg-green-700 hover:bg-green-600"
//                           : "bg-red-700 hover:bg-red-600"
//                       }`}
//                     >
//                       {user.isBlocked ? "Unblock" : "Block"}
//                     </button>
//                   )}
//                 </td>
//               </motion.tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { getImageUrl } from "../../utils/imageUrl";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data.data || []);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlock = async (id) => {
    try {
      await api.put(`/admin/users/${id}/block`);
      toast.success("User updated");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  const changeRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      toast.success("Role updated");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  const avatarSrc = (user) =>
    user.avatar
      ? getImageUrl(user.avatar)
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.name || "U"
        )}&background=ca8a04&color=fff&size=40`;

  if (loading) {
    return (
      <div className="text-gray-400 py-10 text-center">Loading users...</div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
        Users{" "}
        <span className="text-gray-500 text-base sm:text-lg">
          ({users.length})
        </span>
      </h1>

      {/* Desktop table */}
      <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-2xl overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-t border-gray-800 hover:bg-gray-800/40"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatarSrc(user)}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-400">{user.email}</td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) => changeRole(user._id, e.target.value)}
                    className="bg-black border border-gray-700 rounded px-2 py-1 text-xs capitalize"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      user.isBlocked
                        ? "bg-red-900 text-red-400"
                        : "bg-green-900 text-green-400"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="p-4 text-gray-400 text-xs">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => toggleBlock(user._id)}
                      className={`px-3 py-1.5 rounded text-xs font-medium ${
                        user.isBlocked
                          ? "bg-green-700 hover:bg-green-600"
                          : "bg-red-700 hover:bg-red-600"
                      }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {users.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No users found</p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={avatarSrc(user)}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs shrink-0 ${
                    user.isBlocked
                      ? "bg-red-900 text-red-400"
                      : "bg-green-900 text-green-400"
                  }`}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <select
                  value={user.role}
                  onChange={(e) => changeRole(user._id, e.target.value)}
                  className="bg-black border border-gray-700 rounded px-2 py-1.5 text-xs capitalize"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>

                <span className="text-xs text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>

                {user.role !== "admin" && (
                  <button
                    onClick={() => toggleBlock(user._id)}
                    className={`ml-auto px-3 py-1.5 rounded text-xs font-medium ${
                      user.isBlocked
                        ? "bg-green-700"
                        : "bg-red-700"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}