import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./Input";
import { postPlayer, CreatePlayerSchema, CreatePlayer } from "../api/players";

export default function CreatePlayerForm() {
  const queryClient = useQueryClient();

  const { mutate, isLoading, isError, isSuccess, error } = useMutation({
    mutationFn: postPlayer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
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
  } = useForm<CreatePlayer>({
    resolver: zodResolver(CreatePlayerSchema),
  });

  const onSubmit: SubmitHandler<CreatePlayer> = (data) => {
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
      {isSuccess ? (
        <div className="text-green-800 bg-green-100 border border-green-200 p-3 rounded-md text-center">
          Player was successfully created!
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
            <Input
              placeholder="Player's team id"
              {...register("teamId")}
              error={errors.teamId?.message}
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
