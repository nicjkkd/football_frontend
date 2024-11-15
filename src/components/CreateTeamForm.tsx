// import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./Input";
import { CreateTeam, CreateTeamSchema, postTeam } from "../api/teams";

export default function CreateTeamForm() {
  const queryClient = useQueryClient();

  const { mutate, isLoading, isError, isSuccess, error } = useMutation({
    mutationFn: postTeam,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      console.log(data);
    },
    onError: (error: any) => {
      console.log(error.response);
    },
  });

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
      {isSuccess ? (
        <div className="text-green-800 bg-green-100 border border-green-200 p-3 rounded-md text-center">
          Team was successfully created!
        </div>
      ) : (
        <>
          {isError && (
            <div className="text-red-800 bg-red-100 border border-red-200 p-3 rounded-md text-center mb-4">
              {error.response.data.msg}
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
      )}
    </>
  );
}
