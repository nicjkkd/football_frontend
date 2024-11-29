import { Dispatch, SetStateAction, useMemo } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Input from "../Input";
import {
  CreatePlayerSchema,
  CreatePlayer,
  ErrorZodResponse,
  Player,
} from "../../api/schemas";
import { postPlayer } from "../../api/players";
import { getTeams } from "../../api/teams";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsSubmitSuccessfull: Dispatch<SetStateAction<boolean>>;
}

interface SelectOptionsType {
  value: string;
  label: string;
}

export default function CreatePlayerForm({
  setIsOpen,
  setIsSubmitSuccessfull,
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
    AxiosError<ErrorZodResponse>,
    CreatePlayer
  >({
    mutationFn: postPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      setIsSubmitSuccessfull(true);
      setIsOpen(false);
    },
  });

  const errorMessage =
    // @ts-ignore
    error?.response?.data?.msg || "Error with processing request";

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
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
      initialData.dateBirth = null;
    }

    const validatedPlayer = CreatePlayerSchema.parse(initialData);
    mutate(validatedPlayer);

    // const validatedPlayer = CreatePlayerSchema.parse(data);
    // mutate(validatedPlayer);
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

        {/* 
        <Input
          placeholder="Player's team id"
          {...register("teamId")}
          error={errors.teamId?.message}
        ></Input> */}

        <Controller
          control={control}
          name="teamId"
          render={({ field: { value, onChange } }) => (
            <Select
              options={teamOptions}
              value={teamOptions.find(
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
      </form>
    </>
  );
}
