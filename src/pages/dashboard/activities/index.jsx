/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { getCookie } from "cookies-next";

const DashboardActivities = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
        { headers: { apiKey } }
      );
      const sortedActivitesByDate = response.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setActivities(sortedActivitesByDate);
      setFilteredActivities(sortedActivitesByDate);
    } catch (error) {
      console.error("Failed to fetch activities:", error.response?.data || error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
        { headers: { apiKey } }
      );
      setCategories(response.data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error.response?.data || error.message);
    }
  };

  const handleFilterByCategory = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleDelete = async (activityId) => {
    const token = getCookie("token"); // Pastikan token disimpan dalam cookies saat login
    if (!token) {
      alert("You must be logged in to perform this action.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this activity? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-activity/${activityId}`,
        {
          headers: {
            apiKey,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Menghapus aktivitas dari state untuk memperbarui UI
      const updatedActivities = activities.filter((activity) => activity.id !== activityId);
      setActivities(updatedActivities);
      setFilteredActivities(updatedActivities);

      alert("Activity successfully deleted.");
    } catch (error) {
      console.error("Failed to delete activity:", error.response?.data || error.message);
      alert("Failed to delete activity. Please try again later.");
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchCategories();
  }, []);

  useEffect(() => {
    const categoryFiltered = selectedCategory
      ? activities.filter((activity) => activity.category.id === selectedCategory)
      : activities;

    const searchFiltered = categoryFiltered.filter((activity) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        activity.title.toLowerCase().includes(searchLower) ||
        activity.category.name.toLowerCase().includes(searchLower) ||
        activity.province.toLowerCase().includes(searchLower) ||
        activity.city.toLowerCase().includes(searchLower)
      );
    });

    setFilteredActivities(searchFiltered);
  }, [activities, selectedCategory, searchQuery]);

  return (
    <div className="p-4 ml-16 md:p-8">
      <h1 className="mb-4 text-2xl font-bold">Manage Activities</h1>

      <div className="flex flex-col gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => handleFilterByCategory(e.target.value)}
          className="px-3 py-2 border rounded w-[400px]">
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by title, category, province, or city"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 border rounded w-[400px]"
        />

        <Link
          href="/dashboard/activities/create"
          className="px-4 py-2 text-white bg-blue-500 rounded w-fit">
          Create Activities
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">No</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Images</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Price Discount</th>
              <th className="px-4 py-2 border">Rating</th>
              <th className="px-4 py-2 border">Total Reviews</th>
              <th className="px-4 py-2 border">Facilities</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">Province</th>
              <th className="px-4 py-2 border">City</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((activity, index) => (
              <tr key={activity.id}>
                <td className="px-4 py-2 text-center border">{index + 1}</td>
                <td className="px-4 py-2 border">{activity.title}</td>
                <td className="px-4 py-2 border">{activity.category.name}</td>
                <td className="px-4 py-2 border">
                  {activity.imageUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Activity Image ${idx + 1}`}
                      className="object-cover w-16 h-16"
                    />
                  ))}
                </td>
                <td className="px-4 py-2 border">{activity.price}</td>
                <td className="px-4 py-2 border">{activity.price_discount}</td>
                <td className="px-4 py-2 border">{activity.rating}</td>
                <td className="px-4 py-2 border">{activity.total_reviews}</td>
                <td className="px-4 py-2 border">{activity.facilities}</td>
                <td className="px-4 py-2 border">{activity.address}</td>
                <td className="px-4 py-2 border">{activity.province}</td>
                <td className="px-4 py-2 border">{activity.city}</td>
                <td className="px-4 py-2 text-center border">
                  <div className="flex-col gap-2 flex-center">
                    <Link
                      href={`/dashboard/activities/update/${activity.id}`}
                      className="w-full px-2 py-1 mx-1 text-white bg-yellow-500 rounded hover:bg-yellow-600">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(activity.id)}
                      className="w-full px-2 py-1 mx-1 text-white bg-red-500 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardActivities;
