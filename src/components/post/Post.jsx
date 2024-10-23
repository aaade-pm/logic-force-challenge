import PropTypes from "prop-types";

const Post = ({
  post,
  toggleShowDetails,
  showDetailsId,
  getUserName,
  handleDelete,
}) => (
  <>
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

      <button className="text-red-500" onClick={() => handleDelete(post?.id)}>
        Delete
      </button>
    </div>
  </>
);

Post.propTypes = {
  post: PropTypes.object.isRequired,
  toggleShowDetails: PropTypes.func.isRequired,
  showDetailsId: PropTypes.number,
  getUserName: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Post;
