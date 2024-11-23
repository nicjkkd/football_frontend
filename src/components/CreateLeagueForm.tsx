import { Dispatch, SetStateAction, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./Input";
import { postLeague } from "../api/leagues";
import {
  CreateLeague,
  CreateLeagueSchema,
  ErrorZodResponse,
  FinalCreateLeagueSchema,
} from "../api/schemas";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsSubmitSuccessfull: Dispatch<SetStateAction<boolean>>;
}

export default function CreateLeagueForm({
  setIsOpen,
  setIsSubmitSuccessfull,
}: Props) {
  const queryClient = useQueryClient();

  const [errorMessage, setErrorMessage] = useState<string>(
    "Error with processing request"
  );

  const { mutate, isLoading, isError } = useMutation({
    mutationFn: postLeague,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["leagues"] });
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
  } = useForm<CreateLeague>({
    resolver: zodResolver(CreateLeagueSchema),
  });

  const onSubmit: SubmitHandler<CreateLeague> = (data) => {
    const teamsIdArray: Array<string> = [];
    const initialData = { ...data };

    const validatedLeague = CreateLeagueSchema.parse(initialData);

    if (validatedLeague.teamIdToAdd) {
      teamsIdArray.push(validatedLeague.teamIdToAdd);
    }

    const postData = {
      league: {
        leagueName: validatedLeague.leagueName,
      },
      teamsIdToAdd: teamsIdArray,
    };

    const finalLeagueValidation = FinalCreateLeagueSchema.parse(postData);

    mutate(finalLeagueValidation);

    // let initialData = { ...data };

    // const validatedLeague = CreateLeagueSchema.parse(initialData);

    // const postData = {
    //   league: validatedLeague,
    // };

    // const finalLeagueValidation = FinalCreateLeagueSchema.parse(postData);

    // mutate(finalLeagueValidation);
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
          placeholder="League Name"
          {...register("leagueName")}
          error={errors.leagueName?.message}
        ></Input>
        <Input
          placeholder="You can add your first team to this league there"
          {...register("teamIdToAdd")}
          error={errors.teamIdToAdd?.message}
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
