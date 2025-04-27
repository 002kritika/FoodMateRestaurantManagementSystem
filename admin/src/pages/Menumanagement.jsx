import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categories = ["APPETIZER", "MAIN_COURSE", "DESSERT", "BEVERAGE"];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterMenuItems();
    setCurrentPage(1); // reset to first page on filter change
  }, [searchTerm, minPrice, maxPrice, categoryFilter, menuItems]);

  const fetchMenuItems = async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("Unauthorized. Please log in again.");

    try {
      const response = await axios.get("http://localhost:5000/api/admin/menu", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenuItems(response.data);
    } catch (err) {
      console.error("Error fetching menu items:", err);
    }
  };

  const filterMenuItems = () => {
    let filtered = menuItems;

    if (searchTerm)
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (minPrice)
      filtered = filtered.filter((item) => item.price >= parseFloat(minPrice));

    if (maxPrice)
      filtered = filtered.filter((item) => item.price <= parseFloat(maxPrice));

    if (categoryFilter)
      filtered = filtered.filter((item) => item.category === categoryFilter);

    setFilteredItems(filtered);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* <div className="min-h-screen flex justify-center bg-gray-100 p-6"> */}
      <div className=" bg-slate-50 p-6 rounded-lg shadow-lg w-full  ">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Menu Management
        </h1>

        <div className="mb-4 flex justify-between items-center">
          <Link
            to="/add/menu"
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Add Menu Item
          </Link>
          <Link
            to="/menu/list"
            className="text-indigo-600 font-medium hover:underline"
          >
            Go to Edit/Delete Page
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-indigo-100">
              <tr>
                <th className="px-4 py-2 text-left text-blue-700">Name</th>
                <th className="px-4 py-2 text-left text-blue-700">Image</th>
                <th className="px-4 py-2 text-left text-blue-700">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-blue-700">Price</th>
                <th className="px-4 py-2 text-left text-blue-700">Category</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-200 hover:bg-indigo-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">
                      {item.imageUrl ? (
                        <img
                          src={`http://localhost:5000${item.imageUrl}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td className="px-4 py-2">{item.description}</td>
                    <td className="px-4 py-2">Rs.{item.price}</td>
                    <td className="px-4 py-2 capitalize">{item.category}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center px-4 py-4 text-gray-500"
                  >
                    No menu items match the search/filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition duration-300"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 rounded transition duration-300 ${
                currentPage === index + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition duration-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
