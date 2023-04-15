import React from "react";

const NotFound = () => {
  return (
    <div className="bg-green-400 flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 m-6 text-center">
        Oops! This page could not be found or an error has occurred.
      </h2>
      <p className="text-gray-800">
        Go back to{" "}
        <a href="/" className="underline">
          homepage
        </a>
      </p>
    </div>
  );
};

export default NotFound;
