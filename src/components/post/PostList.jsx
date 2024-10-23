import { useState, useEffect } from "react";
import {
  useAddPostMutation,
  useDeletePostMutation,
  useGetPostsQuery,
} from "../../redux/services/PostApi";
import { useGetUsersQuery } from "../../redux/services/UserApi";
import toast from "react-hot-toast";

const PostList = () => {
  const { data: fetchedPosts, error, isLoading } = useGetPostsQuery();
  const {
    data: users,
    error: usersError,
    isLoading: isUserLoading,
  } = useGetUsersQuery();
  const [deletePost] = useDeletePostMutation();
  const [addPost] = useAddPostMutation();

  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [showDetailsId, setShowDetailsId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  // Limit the number of page buttons to display at once
  const maxPageButtons = 5;

  useEffect(() => {
    if (fetchedPosts) {
      setPosts(fetchedPosts);
      setFilteredPosts(fetchedPosts);
    }
  }, [fetchedPosts]);

  const toggleShowDetails = (postId) => {
    setShowDetailsId((prevId) => (prevId === postId ? null : postId));
  };

  const getUserName = (userId) => {
    const user = users?.find((user) => user.id === userId);
    return user?.name || "Unknown User";
  };

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const filtered = posts.filter(
        (post) =>
          post.title
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          post.body.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [debouncedSearchTerm, posts]);

  const filterPostsByUser = (userId) => {
    if (userId) {
      const filtered = posts.filter((post) => post.userId === parseInt(userId));
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id).unwrap();
      const updatedPosts = posts.filter((post) => post.id !== id);
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
      toast.success("Post deleted successfully");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = filteredPosts.slice(firstPostIndex, lastPostIndex);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Create a dynamic list of visible page numbers
  const getPageNumbers = () => {
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    const pages = [];

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Function to add a new post
  const handleAddPost = async () => {
    try {
      // Add the new post
      const newPost = await addPost({ title, body }).unwrap();

      // Reset input fields and close the form
      setTitle("");
      setBody("");
      setShowAddPost(false);

      // Add the new post to the beginning of both posts and filteredPosts
      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);

      toast.success("Post added successfully");
    } catch (error) {
      if (error) {
        toast.error("Failed to add post");
      }
    }
  };

  const toggleAddPostForm = () => {
    setShowAddPost(!showAddPost);
  };

  if (isLoading || isUserLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts.</p>;
  if (usersError) return <p>Error loading users.</p>;

  return (
    <div className="p-4">
      <div className="mb-4 w-full flex justify-between place-items-center">
        <input
          type="text"
          placeholder="Search by title or body"
          className="w-[60%] p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="relative w-[40%] flex flex-col">
          <button
            className="w-full h-full p-2 border rounded ml-2"
            onClick={() => {
              filterPostsByUser("");
              setShowDropdown(!showDropdown);
            }}
          >
            All Users
          </button>

          {showDropdown && (
            <div className="absolute top-10 w-full ml-2 py-2 rounded-b border bg-black">
              {users?.map((user) => (
                <button
                  className="w-full h-full p-1"
                  key={user?.id}
                  onClick={() => {
                    filterPostsByUser(user?.id);
                    setShowDropdown(!showDropdown);
                  }}
                >
                  {user?.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {currentPosts.map((post) => (
        <div key={post?.id} className="border-t py-2">
          <h3
            className="text-md font-medium cursor-pointer"
            onClick={() => toggleShowDetails(post?.id)}
          >
            {post?.title}
          </h3>

          {showDetailsId === post?.id && (
            <div className="flex flex-col gap-2 py-1">
              <p>{post?.body}</p>
              <p className="text-sm text-green-500">
                Created by: {getUserName(post?.userId)}
              </p>
            </div>
          )}

          <button
            className="text-red-500"
            onClick={() => handleDelete(post?.id)}
          >
            Delete
          </button>
        </div>
      ))}

      {/* Add post button */}
      <button
        className="p-2 mx-1 my-2 border rounded"
        onClick={() => toggleAddPostForm()}
      >
        Add Post
      </button>

      {showAddPost && (
        <div className="flex flex-col gap-2 mt-4">
          <input
            type="text"
            placeholder="Title"
            className="p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Body"
            className="p-2 border rounded"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <button
            className="p-2 bg-green-500 text-white rounded"
            onClick={handleAddPost}
          >
            Post
          </button>
        </div>
      )}

      {/* Pagination buttons */}
      <div className="flex justify-center mt-4">
        <button
          disabled={currentPage === 1}
          className="p-2 mx-1 border rounded"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            className={`p-2 mx-1 border rounded ${
              page === currentPage ? "bg-gray-200" : ""
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}

        {currentPage < totalPages && totalPages > maxPageButtons && (
          <span className="p-2 mx-1">...</span>
        )}

        <button
          disabled={currentPage === totalPages}
          className="p-2 mx-1 border rounded"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostList;
