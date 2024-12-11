import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../Input";
import {
  CreatePlayerSchema,
  CreatePlayer,
  ErrorZodResponse,
  Player,
} from "../../api/schemas";
import { postPlayer } from "../../api/players";
import { getTeams } from "../../api/teams";
import { SelectOptionsType } from "../../models";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsSubmitSuccessfull: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default function CreatePlayerForm({
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
    Player,
    ErrorZodResponse,
    CreatePlayer
  >({
    mutationFn: postPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
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
  } = useForm<CreatePlayer>({
    resolver: zodResolver(CreatePlayerSchema),
  });

  const onSubmit: SubmitHandler<CreatePlayer> = (data) => {
    console.log(data);
    let initialData = { ...data };

    if (!data.teamId && !data.playerNumber) {
      initialData = {
        ...data,
        teamId: null,
        playerNumber: null,
      };
    }

    if (!data.position) {
      initialData.position = null;
    }

    if (!data.dateBirth) {
      initialData.dateBirth = undefined;
    }

    const validatedPlayer = CreatePlayerSchema.parse(initialData);
    mutate(validatedPlayer);
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
          placeholder="First Name"
          {...register("firstName")}
          error={errors.firstName?.message}
        ></Input>
        <Input
          placeholder="Last Name"
          {...register("lastName")}
          error={errors.lastName?.message}
        ></Input>
        <Input
          placeholder="Position"
          {...register("position")}
          error={errors.position?.message}
        ></Input>
        <Input
          placeholder="Birth Date"
          type="date"
          {...register("dateBirth")}
          error={errors.dateBirth?.message}
        ></Input>
        <Input
          placeholder="Player Number"
          {...register("playerNumber")}
          error={errors.playerNumber?.message}
        ></Input>

        <Controller
          control={control}
          name="teamId"
          render={({ field: { onChange, value } }) => (
            <Select
              options={teamOptions}
              value={teamOptions.filter(
                (teamOption) => teamOption.value === value
              )}
              onChange={(chosenTeam) => {
                console.log(chosenTeam);
                return onChange(chosenTeam?.value);
              }}
            />
          )}
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
