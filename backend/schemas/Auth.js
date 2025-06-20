import { z } from "zod";

export const AuthSchema = z.object({
  usr: z.coerce
    .string()
    .nonempty("Il campo usr non può essere vuoto"),

  pwd: z.coerce
    .string()
    .min(4, "La password deve essere minimo 4")
    .max(16, "La password deve essere massimo 16")
});