import React, { useState } from "react";
import axios from "axios";
import DashboardLayout from "../layout/DashboardLayout";

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null, // Add image field
  });
  const [loading, setLoading] = useState(false); // Loading state

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({ ...newItem, image: file }); // Store the file object
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle adding a new menu item
  const handleAddItem = async () => {
    if (
      !newItem.name ||
      !newItem.price ||
      !newItem.category ||
      !newItem.image
    ) {
      alert("Please fill in all required fields and upload an image.");
      return;
    }

    setLoading(true); // Set loading state

    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("description", newItem.description);
    formData.append("price", newItem.price);
    formData.append("category", newItem.category);
    formData.append("image", newItem.image); // Append the image file

    try {
      // Get the token from localStorage or your auth context
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/admin/menu",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Include the token in the header
          },
        }
      );

      // Update local state with the new menu item
      setMenuItems([...menuItems, response.data.menuItem]);

      // Reset the form
      setNewItem({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
      });
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("Failed to add menu item. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Menu Management</h1>

        {/* Add Menu Item Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Menu Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name *"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Description"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              placeholder="Price *"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-md"
            />
            <select
              value={newItem.category}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Category *</option>
              <option value="APPETIZER">Appetizer</option>
              <option value="MAIN_COURSE">Main Course</option>
              <option value="DESSERT">Dessert</option>
              <option value="BEVERAGE">Beverage</option>
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            onClick={handleAddItem}
            disabled={loading} // Disable button while loading
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {loading ? "Adding..." : "Add Item"}
          </button>
        </div>

        {/* Menu Items Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Menu Items</h2>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Image</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Category</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.description}</td>
                  <td className="p-2">${item.price}</td>
                  <td className="p-2">{item.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MenuManagement;
