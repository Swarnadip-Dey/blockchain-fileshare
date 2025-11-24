import React from "react";
import * as Icons from "react-icons/md";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";

const SidebarLink = ({ link, isOpen,setIsOpen }) => {
  const Icon = Icons[link.icon];
  const location = useLocation();

  const matchRoute = (route) => {
    return location.pathname.includes(route);
  };
  return (
    <div onClick={()=>setIsOpen(false)}>
      <NavLink
        to={link.path}
        className={`transition-all duration-100 ease-in-out relative rounded-full px-3 py-3 flex gap-4 text-sm font-medium ${
          matchRoute(link.path) ? "bg-blue-100 text-[#1ea9f2]" : null
        }`}
      >
        <div className="flex items-center gap-5">
          <Icon className={` text-2xl ${matchRoute(link.path) ? " text-[#1ea9f2]" : "text-[#a0afb4]"}`} />
          {isOpen && (
            <p
              className={`font-semibold text-black ${
                matchRoute(link.path) ? "text-[#46a7db] " : "text-black"
              }`}
            >
              {link.name}
            </p>
          )}
        </div>
      </NavLink>
      <div className="w-"></div>
    </div>
  );
};

export default SidebarLink;
