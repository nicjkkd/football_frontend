import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./Input";
import { postPlayer, CreatePlayerSchema, CreatePlayer } from "../api/players";

export default function CreatePlayerForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      console.log("success");
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
    const validatedPlayer = CreatePlayerSchema.parse(data);
    console.log(validatedPlayer);

    mutation.mutate(validatedPlayer);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md mx-auto"
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

      <input
        type="submit"
        className="w-full py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 cursor-pointer transition"
      />
    </form>
  );
}
