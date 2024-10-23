import PostList from "../components/post/PostList";

const PostPage = () => {
  return (
    <>
      <div className="flex flex-col items-center py-6">
        <h2 className="text-xl font-bold">Posts</h2>
        <PostList />
      </div>
    </>
  );
};

export default PostPage;
