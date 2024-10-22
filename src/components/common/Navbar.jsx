const Navbar = () => {
  return (
    <>
      <div className="logo w-full flex place-items-center justify-between">
        <p className="font-bold text-2xl">
          <span className="text-[#00CCFF]">L</span>ogic
          <span className="text-[#03C03C]">F</span>orce
        </p>

        <div className="flex place-items-center justify-center gap-4">
          <a href="/">Home</a>
          <a href="/users">Users</a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
