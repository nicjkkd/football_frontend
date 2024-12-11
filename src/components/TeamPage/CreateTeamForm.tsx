import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../Input";
import {
  CreateTeam,
  CreateTeamSchema,
  ErrorZodResponse,
  Team,
} from "../../api/schemas";
import { postTeam } from "../../api/teams";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsSubmitSuccessfull: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default function CreateTeamForm({
  setIsOpen,
  setIsSubmitSuccessfull,
  setIsLoading,
}: Props) {
  const queryClient = useQueryClient();

  const { mutate, isLoading, isError, error } = useMutation<
    Team,
    ErrorZodResponse,
    CreateTeam
  >({
    mutationFn: postTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      setIsLoading(false);
      setIsSubmitSuccessfull(true);
      setIsOpen(false);
    },
  });

  const errorMessage =
    error?.response?.data?.msg || "Error with processing request";

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTeam>({
    resolver: zodResolver(CreateTeamSchema),
  });

  const onSubmit: SubmitHandler<CreateTeam> = (data) => {
    let initialData = { ...data };
    const validatedTeam = CreateTeamSchema.parse(initialData);
    mutate(validatedTeam);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <>
      {isError && (
        <div className="text-red-800 bg-red-100 border border-red-200 p-3 rounded-md text-center mb-4">
          {errorMessage}
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto m-5"
      >
        <Input
          placeholder="Team Name"
          {...register("teamName")}
          error={errors.teamName?.message}
        ></Input>
        <Input
          placeholder="City"
          {...register("city")}
          error={errors.city?.message}
        ></Input>
        <Input
          placeholder="Created in year..."
          {...register("since")}
          error={errors.since?.message}
        ></Input>
        <button
          type="submit"
          className="w-full py-2 bg-gray-800 text-white rounded-md transition hover:bg-gray-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-200"
          disabled={isLoading}
        >
          Submit
        </button>
        <button
          type="button"
          className="w-full py-2 bg-gray-800 text-white rounded-md transition hover:bg-gray-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-200"
          onClick={handleReset}
        >
          Reset Form
        </button>
      </form>
    </>
  );
}
