import { useState } from "react";
import PropTypes from "prop-types";

const AddPostForm = ({ onAddPost }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && body) {
      onAddPost({ title, body });
      setTitle("");
      setBody("");
    }
  };

  return (
    <>
      <form className="flex flex-col gap-2 mt-4" onSubmit={handleSubmit}>
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
        <button type="submit" className="p-2 bg-green-500 text-white rounded">
          Post
        </button>
      </form>
    </>
  );
};

AddPostForm.propTypes = {
  onAddPost: PropTypes.func.isRequired,
};

export default AddPostForm;
