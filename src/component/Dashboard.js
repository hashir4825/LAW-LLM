import React from "react";
import logo from "./logo.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock data for documents
  const documents = [
    { id: 1, name: "Document 1", status: "draft" },
    { id: 2, name: "Document 2", status: "finalized" },
    { id: 3, name: "Document 3", status: "draft" },
    { id: 4, name: "Document 4", status: "finalized" },
    { id: 5, name: "Document 5", status: "draft" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
      }}
    >
      {/* Navigation Bar */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full bg-white shadow-md p-4 flex justify-between items-center z-10"
      >
        <div className="flex items-center">
          <img
            src={logo} // Replace with your logo URL
            alt="Logo"
            className="h-10 w-20 mr-3"
          />
          <span className="text-2xl font-bold text-purple-600">Dashboard</span>
        </div>
        <div className="flex items-center">
          <span className="text-lg font-semibold text-gray-700 mr-4">
            Username
          </span>{" "}
          {/* Replace 'Username' with actual username */}
          <button
            className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
            onClick={() => navigate("/")}
          >
            Log out
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-20 flex flex-col items-center justify-center flex-1"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center items-center pb-5 pt-5"
        >
          <h1 className="text-4xl font-bold text-purple-600">Documents</h1>
        </motion.div>

        <div className="w-full px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-full text-2xl font-semibold text-purple-500 pl-6">
            Drafts
          </div>
          {documents
            .filter((document) => document.status === "draft")
            .map((document) => (
              <motion.div
                key={document.id}
                className="bg-blue-500 border-2 border-black rounded-sm relative shadow-lg"
                style={{
                  height: "200px",
                  padding: "24px",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <p className="text-5xl text-white">{document.name}</p>
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-75 py-2 px-4 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-yellow-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <p className="text-sm text-gray-900 font-semibold italic">
                    Draft
                  </p>
                </div>
              </motion.div>
            ))}
          <div className="col-span-full text-2xl font-semibold text-purple-500 pl-6">
            Finalized
          </div>
          {documents
            .filter((document) => document.status === "finalized")
            .map((document) => (
              <motion.div
                key={document.id}
                className="bg-purple-500 border-2 border-black rounded-sm relative shadow-lg"
                style={{
                  height: "200px",
                  padding: "24px",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <p className="text-5xl text-white">{document.name}</p>
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-75 py-2 px-4 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-sm text-gray-900 font-semibold italic">
                    Finalized
                  </p>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Create Button */}
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-lg px-8 py-3 mt-8 mb-5"
          onClick={() => navigate("/Editor")}
        >
          Create Document
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Dashboard;
