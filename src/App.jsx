import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { Suspense } from "react";
import Navbar from "./components/common/Navbar";
import { Toaster } from "react-hot-toast";

const PostPage = React.lazy(() => import("./pages/PostPage"));
const UserPage = React.lazy(() => import("./pages/UserPage"));

function App() {
  return (
    <>
      <div className="w-full flex justify-center place-items-center">
        <main className="border-2 h-full w-full lg:w-1/2 py-3 px-5">
          <Toaster position="top-right" />
          <Navbar />
          <Suspense
            fallback={
              <div className="w-full h-[100vh] flex justify-center place-items-center">
                Loading...
              </div>
            }
          >
            <Router>
              <Routes>
                <Route path="/" element={<PostPage />} />
                <Route path="/users" element={<UserPage />} />
              </Routes>
            </Router>
          </Suspense>
        </main>
      </div>
    </>
  );
}

export default App;
