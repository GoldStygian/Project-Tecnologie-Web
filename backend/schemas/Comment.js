import { z } from "zod";

export const CommentSchema = z.object({
  content: z.coerce
    .string().nonempty("Il campo photo non può essere vuoto")
    .max(250),
})