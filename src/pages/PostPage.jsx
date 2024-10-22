import PostList from "../components/post/PostList";
import { useDeletePostMutation } from "../redux/services/PostApi";

const PostPage = () => {
  const [deletePost] = useDeletePostMutation();

  const handleDelete = async (id) => {
    await deletePost(id);
    alert("Post deleted successfully.");
  };

  return (
    <>
      <div className="flex flex-col items-center py-6">
        <PostList onDelete={handleDelete} />
      </div>
    </>
  );
};

export default PostPage;
