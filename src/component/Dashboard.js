import React from "react";
import logo from "./logo.png";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <div
        className="min-h-screen"
        style={{
          backgroundImage: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
        }}
      >
        {/* Navigation Bar */}
        <div className="fixed w-full bg-blue-200 shadow-md p-4 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={logo} // Replace with your logo URL
              alt="Logo"
              className="h-10 w-20 mr-3"
            />
            <span className="text-2xl font-bold text-blue-600">Dashboard</span>
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
        </div>

        {/* Main Content */}
        <div className="pt-20 flex flex-col items-center justify-center pb-5">
          <div className="flex justify-center items-center pb-5 pt-5">
            <h1 className="text-4xl font-bold text-blue-600">Forms Page</h1>
          </div>
          <div className="pb-2 flex justify-end w-full pr-14">
            <button
              className="text-white bg-purple-500 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
              onClick={() => navigate("/Editor")}
            >
              Create
            </button>
          </div>

          <div className="grid justify-center items-center grid-cols-3 gap-6">
            <div
              className="bg-orange-200 border border-orange-300 rounded-xl relative"
              style={{
                width: "400px",
                height: "200px",
                padding: "24px",
                backgroundImage:
                  "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)",
              }}
            >
              <p className="text-5xl text-indigo-900">
                Form 2 <br />
              </p>

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
                  Form Draft
                </p>
              </div>
            </div>
            <div
              className="bg-orange-200 border border-orange-300 rounded-xl relative"
              style={{
                width: "400px",
                height: "200px",
                padding: "24px",
                backgroundImage:
                  "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)",
              }}
            >
              <p className="text-5xl text-indigo-900">
                Form 2 <br />
              </p>

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
                  Form Draft
                </p>
              </div>
            </div>

            <div
              className="bg-orange-200 border border-orange-300 rounded-xl relative"
              style={{
                width: "400px",
                height: "200px",
                padding: "24px",
                backgroundImage:
                  "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)",
              }}
            >
              <p className="text-5xl text-indigo-900">
                Form 2 <br />
              </p>

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
                  Form Finalized
                </p>
              </div>
            </div>
            <div
              className="bg-orange-200 border border-orange-300 rounded-xl relative"
              style={{
                width: "400px",
                height: "200px",
                padding: "24px",
                backgroundImage:
                  "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)",
              }}
            >
              <p className="text-5xl text-indigo-900">
                Form 2 <br />
              </p>

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
                  Form Draft
                </p>
              </div>
            </div>

            <div
              className="bg-orange-200 border border-orange-300 rounded-xl relative"
              style={{
                width: "400px",
                height: "200px",
                padding: "24px",
                backgroundImage:
                  "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)",
              }}
            >
              <p className="text-5xl text-indigo-900">
                Form 2 <br />
              </p>

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
                  Form Draft
                </p>
              </div>
            </div>

            <div
              className="bg-orange-200 border border-orange-300 rounded-xl relative"
              style={{
                width: "400px",
                height: "200px",
                padding: "24px",
                backgroundImage:
                  "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)",
              }}
            >
              <p className="text-5xl text-indigo-900">
                Form 2 <br />
              </p>

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
                  Form Draft
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
