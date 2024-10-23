import PropTypes from "prop-types";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <>
      <input
        type="text"
        placeholder="Search by title or body"
        className="w-[60%] p-2 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search posts"
      />
    </>
  );
};

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};

export default SearchBar;
