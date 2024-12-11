import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../Input";
import {
  CreateLeague,
  CreateLeagueSchema,
  ErrorZodResponse,
  FinalCreateLeague,
  FinalCreateLeagueSchema,
  League,
  ServerCreateLeagueResponseWithQueryParams,
} from "../../api/schemas";
import { postLeague } from "../../api/leagues";
import { getTeams } from "../../api/teams";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsSubmitSuccessfull: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

interface SelectOptionsType {
  value: string;
  label: string;
}

export default function CreateLeagueForm({
  setIsOpen,
  setIsSubmitSuccessfull,
  setIsLoading,
}: Props) {
  const queryClient = useQueryClient();

  const teamsQuery = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
    refetchOnMount: false,
  });

  const teamOptions = useMemo<SelectOptionsType[]>(() => {
    const teamOptionsArray =
      teamsQuery.data?.map((team) => ({
        value: team.id,
        label: team.teamName,
      })) || [];
    return teamOptionsArray;
  }, [teamsQuery.data]);

  const { mutate, isLoading, isError, error } = useMutation<
    League | ServerCreateLeagueResponseWithQueryParams,
    ErrorZodResponse,
    FinalCreateLeague
  >({
    mutationFn: postLeague,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leagues"] });
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
    control,
    reset,
  } = useForm<CreateLeague>({
    resolver: zodResolver(CreateLeagueSchema),
  });

  const onSubmit: SubmitHandler<CreateLeague> = (data) => {
    const validatedLeague = CreateLeagueSchema.parse(data);

    const teamsIdArray: Array<string> = validatedLeague.teamIdToAdd || [];

    const postData = {
      league: {
        leagueName: validatedLeague.leagueName,
      },
      teamsIdToAdd: teamsIdArray,
    };

    const finalLeagueValidation = FinalCreateLeagueSchema.parse(postData);
    mutate(finalLeagueValidation);
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
          placeholder="League Name"
          {...register("leagueName")}
          error={errors.leagueName?.message}
        ></Input>
        <Controller
          control={control}
          name="teamIdToAdd"
          render={({ field: { onChange, value } }) => {
            return (
              <Select
                isMulti
                options={teamOptions}
                value={teamOptions.filter((option) =>
                  value?.includes(option.value)
                )}
                onChange={(chosenTeamArr) => {
                  const chosenTeamIds = chosenTeamArr?.map(
                    (chosenTeamOption) => chosenTeamOption.value
                  );
                  return onChange(chosenTeamIds);
                }}
              />
            );
          }}
        />

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
