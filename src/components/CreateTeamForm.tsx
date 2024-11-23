import { Dispatch, SetStateAction, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./Input";
import { postTeam } from "../api/teams";
import { CreateTeam, CreateTeamSchema, ErrorZodResponse } from "../api/schemas";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsSubmitSuccessfull: Dispatch<SetStateAction<boolean>>;
}

export default function CreateTeamForm({
  setIsOpen,
  setIsSubmitSuccessfull,
}: Props) {
  const queryClient = useQueryClient();

  const [errorMessage, setErrorMessage] = useState<string>(
    "Error with processing request"
  );

  const { mutate, isLoading, isError } = useMutation({
    mutationFn: postTeam,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      console.log(data);
      setIsSubmitSuccessfull(true);
      setIsOpen(false);
    },
    onError: (error: ErrorZodResponse) => {
      const errorData =
        error?.response?.data?.msg || "Error with processing request";
      setErrorMessage(errorData);
    },
  });

  // const errorMessage =
  //   // @ts-ignore
  //   error?.response?.data?.msg || "Error with processing request";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTeam>({
    resolver: zodResolver(CreateTeamSchema),
  });

  const onSubmit: SubmitHandler<CreateTeam> = (data) => {
    let initialData = { ...data };
    const validatedTeam = CreateTeamSchema.parse(initialData);
    mutate(validatedTeam);
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
      </form>
    </>
  );
}
