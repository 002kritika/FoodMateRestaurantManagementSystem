import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddMenu = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null); // Ensure image is a File object
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store file object
  };

  const handleCreateMenuItem = async (e) => {
    e.preventDefault();

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (!name || !description || !category) {
      setError("Please fill out all required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", parsedPrice);
    formData.append("category", category);

    if (image) {
      formData.append("image", image); // Ensure image is added correctly
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/menu",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // DO NOT manually set Content-Type (Axios handles it)
          },
        }
      );

      setSuccess("Menu item created successfully!");
      setError("");

      setTimeout(() => navigate("/menu"), 1500);
    } catch (err) {
      console.error("Error creating menu item:", err);
      setError(err.response?.data?.message || "Failed to create menu item.");
      setSuccess("");
    }
  };

  // Handle cancel functionality
  const handleCancel = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setImage(null);
    setError("");
    setSuccess("");
    navigate("/menu"); // Redirect to the menu page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Add Menu Item
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <form onSubmit={handleCreateMenuItem}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              placeholder="Enter item description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Price (Rs.)
            </label>
            <input
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
            >
              <option value="">Select category</option>
              <option value="APPETIZER">Appetizer</option>
              <option value="MAIN_COURSE">Main Course</option>
              <option value="DESSERT">Dessert</option>
              <option value="BEVERAGE">Beverage</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              type="file"
              onChange={handleImageChange} // Store the selected file
              accept="image/*" // Restrict to image files only
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Menu Item
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenu;
