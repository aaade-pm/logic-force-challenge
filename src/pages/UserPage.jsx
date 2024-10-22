import UserList from "../components/users/UserList";

const UserPage = () => {
  return (
    <>
      <div className="w-full flex flex-col items-center pt-6">
        <h2 className="text-xl font-bold">Users</h2>
        <UserList />
      </div>
    </>
  );
};

export default UserPage;
