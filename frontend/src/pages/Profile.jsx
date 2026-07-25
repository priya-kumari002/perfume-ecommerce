
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import { getImageUrl } from "../utils/imageUrl";

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPass, setSavingPass] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      fetchAddresses();
      fetchOrders();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const { data } = await api.get("/users/addresses");
      setAddresses(data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/my-orders");
      setOrders(data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("phone", profile.phone || "");
      if (avatarFile) formData.append("avatar", avatarFile);

      const { data } = await api.put("/users/profile", formData);
      setUser({ ...user, ...data.data });
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (passwords.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setSavingPass(true);
    try {
      await api.put("/users/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success("Password changed");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    } finally {
      setSavingPass(false);
    }
  };

  const openAddressForm = (addr = null) => {
    if (addr) {
      setEditingAddress(addr);
      setAddressForm({
        fullName: addr.fullName || "",
        phone: addr.phone || "",
        address: addr.address || "",
        city: addr.city || "",
        state: addr.state || "",
        pincode: addr.pincode || "",
        isDefault: addr.isDefault || false,
      });
    } else {
      setEditingAddress(null);
      setAddressForm({
        fullName: user?.name || "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });
    }
    setShowAddressForm(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await api.put(`/users/addresses/${editingAddress._id}`, addressForm);
        toast.success("Address updated");
      } else {
        await api.post("/users/addresses", addressForm);
        toast.success("Address added");
      }
      setShowAddressForm(false);
      fetchAddresses();
    } catch (error) {
      toast.error("Failed to save address");
    }
  };

  const deleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await api.delete(`/users/addresses/${id}`);
      toast.success("Address deleted");
      fetchAddresses();
    } catch (error) {
      toast.error("Failed");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Link to="/login" className="text-yellow-500">
          Please login
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "password", label: "Password" },
    { id: "addresses", label: "Addresses" },
    { id: "orders", label: "Order History" },
  ];

  const avatarSrc =
    avatarPreview ||
    (user?.avatar
      ? getImageUrl(user.avatar)
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user?.name || "U"
        )}&background=ca8a04&color=fff&size=128`);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">
          My <span className="text-yellow-500">Account</span>
        </h1>

        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-800 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-yellow-600 text-black"
                  : "bg-gray-900 text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* PROFILE */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <img
                  src={avatarSrc}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-yellow-600"
                />
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-500">
                  <span className="text-black text-sm">📷</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setAvatarFile(file);
                        setAvatarPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              </div>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-5 max-w-md">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-xl outline-none focus:border-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone</label>
                <input
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-xl outline-none focus:border-yellow-500"
                />
              </div>
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 bg-yellow-600 text-black font-medium rounded-xl hover:bg-yellow-500 disabled:opacity-50"
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </motion.div>
        )}

        {/* PASSWORD */}
        {activeTab === "password" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold mb-6">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-xl outline-none focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-xl outline-none focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-xl outline-none focus:border-yellow-500"
                />
              </div>
              <button
                type="submit"
                disabled={savingPass}
                className="px-6 py-2.5 bg-yellow-600 text-black font-medium rounded-xl hover:bg-yellow-500 disabled:opacity-50"
              >
                {savingPass ? "Saving..." : "Change Password"}
              </button>
            </form>
          </motion.div>
        )}

        {/* ADDRESSES */}
        {activeTab === "addresses" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Saved Addresses</h2>
              <button
                onClick={() => openAddressForm()}
                className="px-4 py-2 bg-yellow-600 text-black rounded-xl text-sm font-medium"
              >
                + Add Address
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-5 relative"
                >
                  {addr.isDefault && (
                    <span className="absolute top-3 right-3 text-xs bg-yellow-600 text-black px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                  <p className="font-medium">{addr.fullName}</p>
                  <p className="text-sm text-gray-400 mt-1">{addr.address}</p>
                  <p className="text-sm text-gray-400">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-sm text-gray-400">{addr.phone}</p>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => openAddressForm(addr)}
                      className="text-sm text-yellow-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteAddress(addr._id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {addresses.length === 0 && !showAddressForm && (
              <p className="text-gray-500 text-center py-10">
                No addresses saved
              </p>
            )}

            {showAddressForm && (
              <div className="fixed inset-0 bg-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingAddress ? "Edit Address" : "Add Address"}
                  </h3>
                  <form onSubmit={handleAddressSubmit} className="space-y-3">
                    {[
                      "fullName",
                      "phone",
                      "address",
                      "city",
                      "state",
                      "pincode",
                    ].map((field) => (
                      <input
                        key={field}
                        name={field}
                        value={addressForm[field]}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            [field]: e.target.value,
                          })
                        }
                        placeholder={field.replace(/([A-Z])/g, " $1")}
                        required
                        className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-xl outline-none focus:border-yellow-500"
                      />
                    ))}
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            isDefault: e.target.checked,
                          })
                        }
                      />
                      Set as default
                    </label>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-yellow-600 text-black rounded-xl font-medium"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="px-5 py-2 bg-gray-700 rounded-xl"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-semibold mb-6">Order History</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Link
                    key={order._id}
                    to={`/orders/${order._id}`}
                    className="block bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-yellow-600/50 transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-mono text-sm text-yellow-500">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                          {order.items?.length} item(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-yellow-500">
                          ₹{order.total?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400 capitalize mt-1">
                          {order.orderStatus}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}