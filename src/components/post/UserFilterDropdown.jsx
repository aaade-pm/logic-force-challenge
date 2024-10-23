import { useState } from "react";
import PropTypes from "prop-types";

const UserFilterDropdown = ({ users, filterPostsByUser }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      <div className="relative w-[40%] flex flex-col">
        <button
          className="w-full h-full p-2 border rounded ml-2"
          onClick={() => {
            if (!showDropdown) {
              filterPostsByUser(0);
              setShowDropdown(true);
            } else {
              setShowDropdown(false);
            }
          }}
        >
          All Users
        </button>

        {showDropdown && (
          <div className="absolute top-10 w-full ml-2 py-2 rounded-b border bg-black">
            {users.map((user) => (
              <button
                className="w-full h-full p-1"
                key={user.id}
                onClick={() => {
                  filterPostsByUser(user.id);
                  setShowDropdown(false);
                }}
              >
                {user.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

UserFilterDropdown.propTypes = {
  users: PropTypes.array.isRequired,
  filterPostsByUser: PropTypes.func.isRequired,
};

export default UserFilterDropdown;
