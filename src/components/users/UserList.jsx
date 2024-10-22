import { useState } from "react";
import { useGetUsersQuery } from "../../redux/services/UserApi";

const UserList = () => {
  //Query to get the list of users
  const {
    data: users,
    error: usersError,
    isLoading: isUserLoading,
  } = useGetUsersQuery();

  //State to store the id of the user whose details are to be shown
  const [showUserDetailsId, setShowUserDetailsId] = useState(null);

  //Function to toggle the showDetails state for a specific user
  const toggleShowUserDetails = (userId) => {
    if (showUserDetailsId === userId) {
      setShowUserDetailsId(null);
    } else {
      setShowUserDetailsId(userId);
    }
  };

  //Return loading message if data is being fetched
  if (isUserLoading) return <p>Loading ...</p>;

  //Return error message if there is an error fetching data
  if (usersError) return <p>Error loading users.</p>;

  return (
    <>
      <div className="w-full flex flex-col items-center py-6">
        <div className="px-4 w-full">
          {users?.map((user) => (
            <div
              key={user?.id}
              className="border-y py-2 w-full"
              onClick={() => toggleShowUserDetails(user?.id)}
            >
              <h3 className="text-md font-medium">{user?.name}</h3>
              {showUserDetailsId === user?.id && (
                <div className="flex flex-col gap-2 py-1">
                  <p>
                    Username:
                    <span className="text-green-500"> {user.username}</span>
                  </p>
                  <p>
                    Email:
                    <span className="text-green-500"> {user.email}</span>
                  </p>
                  <p>
                    Phone Number:
                    <span className="text-green-500"> {user.phone}</span>
                  </p>
                  <p>
                    Website:
                    <span className="text-green-500"> {user.website}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserList;
