// import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./Input";
import { postLeague } from "../api/leagues";
import {
  CreateLeague,
  CreateLeagueSchema,
  FinalCreateLeagueSchema,
} from "../api/schemas";

export default function CreateLeagueForm() {
  const queryClient = useQueryClient();

  const { mutate, isLoading, isError, isSuccess, error } = useMutation({
    mutationFn: postLeague,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["leagues"] });
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
  } = useForm<CreateLeague>({
    resolver: zodResolver(CreateLeagueSchema),
  });

  const onSubmit: SubmitHandler<CreateLeague> = (data) => {
    let initialData = { ...data };

    const validatedLeague = CreateLeagueSchema.parse(initialData);

    const postData = {
      league: validatedLeague,
    };

    const finalLeagueValidation = FinalCreateLeagueSchema.parse(postData);

    mutate(finalLeagueValidation);
  };

  return (
    <>
      {isSuccess ? (
        <div className="text-green-800 bg-green-100 border border-green-200 p-3 rounded-md text-center">
          League was successfully created!
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
              placeholder="League Name"
              {...register("leagueName")}
              error={errors.leagueName?.message}
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
