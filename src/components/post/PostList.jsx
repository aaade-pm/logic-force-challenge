import { useState, useEffect } from "react";
import {
  useAddPostMutation,
  useDeletePostMutation,
  useGetPostsQuery,
} from "../../redux/services/PostApi";
import { useGetUsersQuery } from "../../redux/services/UserApi";
import toast from "react-hot-toast";
import Post from "./Post";
import SearchBar from "../common/SearchBar";
import UserFilterDropdown from "./UserFilterDropdown";
import AddPostForm from "./AddPostForm";
import Pagination from "./Pagination";

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
  const [showAddPost, setShowAddPost] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

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

  // Function to add a new post
  const handleAddPost = async ({ title, body }) => {
    try {
      // Add the new post
      const newPost = await addPost({ title, body }).unwrap();

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
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <UserFilterDropdown
          users={users}
          filterPostsByUser={filterPostsByUser}
        />
      </div>

      {currentPosts.map((post) => (
        <Post
          key={post.id}
          post={post}
          toggleShowDetails={toggleShowDetails}
          showDetailsId={showDetailsId}
          getUserName={getUserName}
          handleDelete={handleDelete}
        />
      ))}

      {/* Add post button */}
      <button
        className="p-2 mx-1 my-2 border rounded"
        onClick={() => toggleAddPostForm()}
      >
        Add Post
      </button>

      {showAddPost && <AddPostForm onAddPost={handleAddPost} />}

      {/* Pagination buttons */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default PostList;
