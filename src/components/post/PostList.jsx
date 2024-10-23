import { useState, useEffect } from "react";
import {
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

  const [posts, setPosts] = useState([]); // Local state for posts
  const [filteredPosts, setFilteredPosts] = useState([]); // State for filtered posts
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [showDetailsId, setShowDetailsId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Initialize local state with fetched posts
  useEffect(() => {
    if (fetchedPosts) {
      setPosts(fetchedPosts);
      setFilteredPosts(fetchedPosts); // Ensure filtered state matches initially
    }
  }, [fetchedPosts]);

  // Function to toggle the showDetails state for a specific post
  const toggleShowDetails = (postId) => {
    setShowDetailsId((prevId) => (prevId === postId ? null : postId));
  };

  // Function to get the username of the user who created the post
  const getUserName = (userId) => {
    const user = users?.find((user) => user.id === userId);
    return user?.name || "Unknown User";
  };

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Filter posts based on the debounced search term
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

  // Function to filter posts by user
  const filterPostsByUser = (userId) => {
    if (userId) {
      const filtered = posts.filter((post) => post.userId === parseInt(userId));
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  };

  // Function to delete a post locally after successful deletion from the server
  const handleDelete = async (id) => {
    try {
      await deletePost(id).unwrap(); // Ensure the mutation resolves successfully
      const updatedPosts = posts.filter((post) => post.id !== id);
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
      toast.success("Post deleted successfully");
    } catch (err) {
      if (err) {
        toast.error("Failed to delete post");
      }
    }
  };

  if (isLoading || isUserLoading) return <p>Loading ...</p>;
  if (error) return <p>Error loading posts.</p>;
  if (usersError) return <p>Error loading users.</p>;

  return (
    <div className="p-4">
      <div className="mb-4 w-full flex justify-between place-items-center">
        {/* Search bar to search by title or content */}
        <input
          type="text"
          placeholder="Search by title or body"
          className="w-[60%] p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Filter by user dropdown */}
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

      {/* List of posts */}
      {filteredPosts?.map((post) => (
        <div key={post?.id} className="border-t py-2">
          <h3
            className="text-md font-medium cursor-pointer"
            onClick={() => toggleShowDetails(post?.id)}
          >
            {post?.title}
          </h3>

          {/* Other details of the post that shows when a user clicks on the title */}
          {showDetailsId === post?.id && (
            <div
              className="flex flex-col gap-2 py-1"
              onClick={() => toggleShowDetails(post?.id)}
            >
              <p>{post?.body}</p>
              <p className="text-sm text-green-500">
                Created by: {getUserName(post?.userId)}
              </p>
            </div>
          )}

          {/* Delete button to simulate post deletion */}
          <button
            className="text-red-500"
            onClick={() => handleDelete(post?.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default PostList;
