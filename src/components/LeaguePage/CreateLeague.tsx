import { memo, useCallback, useEffect, useState } from "react";
import CreateLeagueForm from "./CreateLeagueForm";

const CreateLeague = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitSuccessfull, setIsSubmitSuccessfull] =
    useState<boolean>(false);

  useEffect(() => {
    if (isOpen) setIsSubmitSuccessfull(false);
  }, [isOpen]);

  useEffect(() => {
    if (isSubmitSuccessfull) {
      setTimeout(() => setIsSubmitSuccessfull(false), 30000);
    }
  }, [isSubmitSuccessfull]);

  const handleClick = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);

  return (
    <>
      <div className="w-full m-5 flex justify-center">
        <button
          type="button"
          onClick={handleClick}
          className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          {isOpen ? "Close Form" : "Add League"}
        </button>
      </div>
      {isSubmitSuccessfull ? (
        <div className="text-green-800 bg-green-100 border border-green-200 p-3 rounded-md text-center">
          League was successfully created!
        </div>
      ) : null}
      {isOpen ? (
        <CreateLeagueForm
          setIsOpen={setIsOpen}
          setIsSubmitSuccessfull={setIsSubmitSuccessfull}
        />
      ) : null}
    </>
  );
};

export default memo(CreateLeague);
