"use client";

import { useState } from "react";
import { Search, Menu, Rocket, Plus } from "lucide-react";

export default function HomePage() {
  const [selectedActivity, setSelectedActivity] = useState(0);
  const [selectedTab, setSelectedTab] = useState("one-to-many");
  const [selectedPersona, setSelectedPersona] = useState(null);

  const activities = [
    { id: 1, title: "Lorem Ipsum", createdDate: "25-11-2025" },
    { id: 2, title: "Lorem Ipsum", createdDate: "25-11-2025" },
    { id: 3, title: "Lorem Ipsum", createdDate: "25-11-2025" },
    { id: 4, title: "Lorem Ipsum", createdDate: "25-11-2025" },
    { id: 5, title: "Lorem Ipsum", createdDate: "25-11-2025" },
    { id: 6, title: "Lorem Ipsum", createdDate: "25-11-2025" },
    { id: 7, title: "Lorem Ipsum", createdDate: "25-11-2025" },
    { id: 8, title: "Lorem Ipsum", createdDate: "25-11-2025" },
  ];

  const personas = [
    { name: "Diana", role: "Engineer" },
    { name: "Mark", role: "Police" },
    { name: "David", role: "Security" },
    { name: "Anthony", role: "Doctor" },
    { name: "Angel", role: "Housekeeper" },
    { name: "Diana", role: "Engineer" },
    { name: "Mark", role: "Police" },
    { name: "Robbie", role: "Chef" },
    { name: "Steve", role: "Manager" },
    { name: "Brooke", role: "Actor" },
  ];

  const personaDetails = {
    name: "Mark Spencer",
    maritalStatus: "Single",
    interests: "Swimming, Skiing, Music",
    location: "San Francisco",
    foodPreferences: "Non Vegetarian",
    profession: "Police Officer",
    age: 32,
    gender: "Male",
    income: "USD 25K",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-4">
          <button className="text-gray-600 hover:text-gray-900">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold">echo</h1>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Type / to search"
              className="w-full rounded-md border border-gray-300 py-1.5 pl-10 pr-4 text-sm focus:border-gray-400 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-300">
            <img
              src="https://via.placeholder.com/32"
              alt="User"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Home</span>
          <span>&gt;</span>
          <span>Services</span>
          <span>&gt;</span>
          <span>Survey Simulation</span>
          <span>&gt;</span>
          <span className="font-medium text-gray-900">Activities</span>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-200">
          <div className="border-b bg-white border-gray-200 px-4 py-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Rocket className="h-5 w-5" />
              <span>Activities</span>
            </div>
          </div>
          <div className="overflow-y-auto">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                onClick={() => setSelectedActivity(index)}
                className={`cursor-pointer border-b border-gray-100 px-4 py-3 transition-colors ${
                  selectedActivity === index
                    ? "bg-blue-50 border-l-4 border-l-blue-500 bg-white"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="font-medium text-gray-900">
                  {index + 1}. {activity.title}
                </div>
                <div className="text-xs text-gray-500">
                  Created {activity.createdDate}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white p-6">
          {/* Activity Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Lorem Ipsum Activity</h2>
            <p className="text-sm text-gray-500">Created On: 25-12-2025</p>
          </div>

          <div className="border-b">
          {/* Tabs */}
          <div className="mb-6 flex items-center gap-2">
            <button
              onClick={() => setSelectedTab("one-to-many")}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedTab === "one-to-many"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 4L4 8L12 12L20 8L12 4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 12L12 16L20 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              One to Many
              {selectedTab === "one-to-many" && (
                <span className="rounded-full bg-green-200 px-2 py-0.5 text-xs font-semibold text-green-800">
                  New
                </span>
              )}
            </button>
            <button
              onClick={() => setSelectedTab("one-to-one")}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedTab === "one-to-one"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              One to One
            </button>
            <button
              onClick={() => setSelectedTab("many-to-many")}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedTab === "many-to-many"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Many to Many
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>
          </div>

          {/* Personas Grid */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3">
              {personas.map((persona, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPersona(persona)}
                  className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all hover:border-gray-400 hover:shadow-sm"
                >
                  <span className="font-semibold text-gray-900">
                    {persona.name}
                  </span>
                  <span className="text-gray-600">, {persona.role}</span>
                </button>
              ))}
              <button className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-all hover:border-gray-400 hover:bg-gray-50">
                <Plus className="h-4 w-4" />
                Add Persona
              </button>
            </div>
          </div>
          </div>

          {/* Persona Details */}
          <div className="border-gray-200 bg-white p-6">
            <h3 className="mb-6 text-lg font-semibold">Persona Details</h3>
            <div className="flex gap-8">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div className="relative mb-2 h-32 w-32 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-purple-600">
                  {/*<div className="absolute bottom-0 left-1/2 h-20 w-12 -translate-x-1/2 rounded-t-full bg-purple-300"></div
                  <div className="absolute left-1/2 top-8 h-10 w-10 -translate-x-1/2 rounded-full bg-purple-300"></div>>*/}
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {personaDetails.name}
                </h4>
              </div>

              {/* Details Grid */}
              <div className="grid flex-1 grid-cols-2 gap-x-12 gap-y-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-700">
                    Marital Status
                  </h5>
                  <p className="text-base text-gray-900">
                    {personaDetails.maritalStatus}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700">
                    Profession
                  </h5>
                  <p className="text-base text-gray-900">
                    {personaDetails.profession}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700">
                    Interests
                  </h5>
                  <p className="text-base text-gray-900">
                    {personaDetails.interests}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Age</h5>
                  <p className="text-base text-gray-900">
                    {personaDetails.age}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700">
                    Location
                  </h5>
                  <p className="text-base text-gray-900">
                    {personaDetails.location}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Gender</h5>
                  <p className="text-base text-gray-900">
                    {personaDetails.gender}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700">
                    Food Preferences
                  </h5>
                  <p className="text-base text-gray-900">
                    {personaDetails.foodPreferences}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Income</h5>
                  <p className="text-base text-gray-900">
                    {personaDetails.income}
                  </p>
                </div>
              </div>

              {/* Duplicate column on the right */}
              <div className="grid flex-1 grid-cols-1 gap-y-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-700">
                    Profession
                  </h5>
                  <p className="text-base text-gray-900">
                    {personaDetails.profession}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Age</h5>
                  <p className="text-base text-gray-900">
                    {personaDetails.age}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Gender</h5>
                  <p className="text-base text-gray-900">
                    {personaDetails.gender}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Income</h5>
                  <p className="text-base text-gray-900">
                    {personaDetails.income}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
