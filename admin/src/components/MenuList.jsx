import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "./DeleteButton"; // New import

const MenuList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = menuItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(menuItems.length / itemsPerPage);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized. Please log in again.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/admin/menu", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenuItems(response.data);
    } catch (err) {
      setError("Error fetching menu items");
      console.error("Error:", err);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setImageFile(null);
    setEditModalOpen(true);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("name", editItem.name);
    formData.append("description", editItem.description);
    formData.append("price", parseFloat(editItem.price));
    formData.append("category", editItem.category);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await axios.put(
        `http://localhost:5000/api/admin/menu/${editItem.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setEditModalOpen(false);
      fetchMenuItems();
    } catch (err) {
      console.error("Error updating menu item:", err);
      setError("Failed to update menu item.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Menu Items
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-100">
              <th className="px-4 py-2 text-left text-blue-800">Name</th>
              <th className="px-4 py-2 text-left text-blue-800">Image</th>
              <th className="px-4 py-2 text-left text-blue-800">Description</th>
              <th className="px-4 py-2 text-left text-blue-800">Price</th>
              <th className="px-4 py-2 text-left text-blue-800">Category</th>
              <th className="px-4 py-2 text-left text-blue-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id} className="border-t border-gray-300">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">
                  {item.imageUrl ? (
                    <img
                      src={`http://localhost:5000${item.imageUrl}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td className="px-4 py-2">{item.description}</td>
                <td className="px-4 py-2">Rs.{item.price}</td>
                <td className="px-4 py-2 capitalize">{item.category}</td>
                <td className="px-4 py-2 flex items-center gap-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-800 transition-all duration-200"
                  >
                    <FaEdit size={20} />
                  </button>
                  <DeleteButton
                    id={item.id}
                    onSuccess={fetchMenuItems}
                    setError={setError}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-all duration-200"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              } transition-all duration-200`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-all duration-200"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Edit Menu Item
            </h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={editItem.name}
                  onChange={(e) =>
                    setEditItem({ ...editItem, name: e.target.value })
                  }
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  value={editItem.description}
                  onChange={(e) =>
                    setEditItem({ ...editItem, description: e.target.value })
                  }
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Price (Rs.)
                </label>
                <input
                  type="number"
                  value={editItem.price}
                  onChange={(e) =>
                    setEditItem({ ...editItem, price: e.target.value })
                  }
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={editItem.category}
                  onChange={(e) =>
                    setEditItem({ ...editItem, category: e.target.value })
                  }
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="APPETIZER">Appetizer</option>
                  <option value="MAIN_COURSE">Main Course</option>
                  <option value="DESSERT">Dessert</option>
                  <option value="BEVERAGE">Beverage</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Current Image
                </label>
                {editItem.imageUrl && !imageFile && (
                  <img
                    src={`http://localhost:5000${editItem.imageUrl}`}
                    alt="Current menu item"
                    className="w-20 h-20 object-cover rounded mt-2"
                  />
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Upload New Image
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-200"
              >
                Update Menu Item
              </button>
            </form>
            <button
              onClick={() => setEditModalOpen(false)}
              className="mt-4 w-full text-red-600 hover:text-red-800 py-2 px-4 rounded-md border border-gray-300 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuList;
