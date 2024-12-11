import { memo, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ListChildComponentProps } from "react-window";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../Input";
import { UpdatePlayer, UpdatePlayerSchema } from "../../api/schemas";
import { deletePlayer, updatePlayer } from "../../api/players";
import { getTeams } from "../../api/teams";
import { PlayerWithTeamName, SelectOptionsType } from "../../models";
import Button from "../Button";

const PlayersRow: React.FC<ListChildComponentProps<PlayerWithTeamName[]>> = ({
  index,
  style,
  data,
}) => {
  const player = data[index];
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

  const { mutate: deleteMutate, isLoading: isDeleteLoading } = useMutation({
    mutationFn: deletePlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });

  const handleClick = (playerId: string) => {
    deleteMutate(playerId);
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, isSubmitSuccessful },
  } = useForm<UpdatePlayer>({
    resolver: zodResolver(UpdatePlayerSchema),
    values: data[index],
  });

  const { mutate: updateMutate, isLoading: isUpdateLoading } = useMutation({
    mutationFn: ({
      playerId,
      playerChanges,
    }: {
      playerId: string;
      playerChanges: UpdatePlayer;
    }) => updatePlayer(playerId, playerChanges),
    onSuccess: (data) => {
      console.log(`Updated: `, data);
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });

  const onSubmit: SubmitHandler<UpdatePlayer> = (data) => {
    console.log(data);
    let dataToSubmit = { ...data };

    if (!data.teamId && !data.playerNumber) {
      dataToSubmit = {
        ...data,
        teamId: null,
        playerNumber: null,
      };
    }

    if (!data.position) {
      dataToSubmit.position = null;
    }

    if (!data.dateBirth) {
      dataToSubmit.dateBirth = undefined;
    }

    const validatedPlayerChanges = UpdatePlayerSchema.parse(dataToSubmit);
    console.log(validatedPlayerChanges);
    updateMutate({
      playerId: player.id,
      playerChanges: validatedPlayerChanges,
    });
  };

  return (
    <div
      style={style}
      className={`flex items-center gap-4 p-4 border-b border-gray-200 ${
        index % 2 === 0 ? "bg-gray-100" : "bg-white"
      }`}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-4 w-full"
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
                return onChange(chosenTeam?.value);
              }}
              placeholder="Select Team"
              className="min-w-[150px]"
            />
          )}
        />

        {isDirty && (
          <Button
            type="submit"
            disabled={isSubmitSuccessful}
            isLoading={isUpdateLoading}
            className="py-2 px-4 bg-gray-800 text-white rounded-md transition-all duration-300 ease-in-out transform scale-95 opacity-0 hover:scale-105 hover:bg-gray-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-200 whitespace-nowrap"
            style={{
              animation: "fadeIn 0.3s ease-in-out forwards",
            }}
          >
            Save Changes
          </Button>
        )}
      </form>

      <Button
        type="button"
        className={`py-2 px-4 rounded-lg transition-all ${
          isDeleteLoading || isUpdateLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
        }`}
        title="Delete Player"
        onClick={() => {
          handleClick(player.id);
        }}
        disabled={isDeleteLoading || isUpdateLoading}
      >
        X
      </Button>
    </div>
  );
};

export default memo(PlayersRow);
