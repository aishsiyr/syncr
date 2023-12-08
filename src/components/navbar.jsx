import React from 'react';
// import logo from '../assets/icon.png'; // Fix the path here
const Navbar = () => {
  return (
    <nav className="bg-[#161C22] p-4 flex justify-between items-center">
      <div className="flex items-center">

        <span className="text-gray-300 text-lg  font-gabarito">Syncr.</span>
        {/* <img src={logo} alt="Logo" className="w-5 h-5 ml-2 first-letter:-2" /> */}
      </div>
    </nav>
  );
};

export default Navbar;
