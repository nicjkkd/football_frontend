import { PositionSchema, Player } from "../generated/zod";
import { z } from "zod";

export const CreatePlayerSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Field must contain more than 2 characters" })
    .max(100, { message: "Field must contain less than 100 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Field must contain more than 2 characters" })
    .max(100, { message: "Field must contain less than 100 characters" }),
  // position: z
  // .lazy(() => PositionSchema.optional().nullable())
  // .optional()
  // .nullable(),
  // dateBirth: z.coerce.date().optional().nullable(),
  position: z
    .union([PositionSchema, z.literal("")])
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .optional(),
  dateBirth: z
    .string()
    .transform((val) => (val === "" ? null : new Date(val)))
    .optional()
    .nullable()
    // .refine(
    //   (val) => val === null || val === undefined || !isNaN(val.getTime()),
    //   {
    //     message: "Invalid date",
    //   }
    // ),
    .pipe(z.coerce.date().nullable().optional()),
  playerNumber: z.coerce.number().int().optional().nullable(),
  teamId: z.string().optional().nullable(),
});

export type CreatePlayer = z.infer<typeof CreatePlayerSchema>;

export type { Player };
