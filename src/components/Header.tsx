import { memo } from "react";
import { PopoverGroup } from "@headlessui/react";
import { Link } from "@tanstack/react-router";

const Header = () => {
  return (
    <header className="bg-white">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              alt=""
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <div className="flex lg:hidden"></div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Link to="/players" className="text-sm/6 font-semibold text-gray-900">
            Players
          </Link>
          <Link to="/teams" className="text-sm/6 font-semibold text-gray-900">
            Teams
          </Link>
          <Link to="/leagues" className="text-sm/6 font-semibold text-gray-900">
            Leagues
          </Link>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className="text-sm/6 font-semibold text-gray-900">
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
    </header>
  );
};

export default memo(Header);
