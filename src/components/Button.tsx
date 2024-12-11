import React from "react";
import Loader from "./Loader";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

function Button({
  type = "button",
  className = "",
  disabled = false,
  isLoading = false,
  children,
  ...props
}: Props) {
  return (
    <button type={type} className={className} disabled={disabled} {...props}>
      {isLoading && <Loader styles="flex items-center justify-center" />}
      {!isLoading && children}
    </button>
  );
}

export default Button;

{
  /* <button
type="submit"
className="py-2 px-4 bg-gray-800 text-white rounded-md transition-all duration-300 ease-in-out transform scale-95 opacity-0 hover:scale-105 hover:bg-gray-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-200 whitespace-nowrap"
style={{
  animation: "fadeIn 0.3s ease-in-out forwards",
}}
disabled={disabled}
>
{isLoading && <Loader styles="flex items-center justify-center" />}
{isLoading ? null : children}
</button> */
}
