import { useGetPostsQuery } from "../../redux/services/PostApi";
import PropType from "prop-types";

const PostList = ({ onPostSelect, onDelete }) => {
  const { data: posts, error, isLoading } = useGetPostsQuery();

  if (isLoading) return <p>Loading posts...</p>;
  if (error) return <p>Error loading posts.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Posts</h2>
      {posts.map((post) => (
        <div key={post.id} className="border-b py-2">
          <h3
            className="text-lg cursor-pointer"
            onClick={() => onPostSelect(post.id)}
          >
            {post.title}
          </h3>
          <button className="text-red-500" onClick={() => onDelete(post.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

PostList.propTypes = {
  onPostSelect: PropType.func.isRequired,
  onDelete: PropType.func.isRequired,
};

export default PostList;
