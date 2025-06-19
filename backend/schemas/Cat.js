import { z } from "zod";

export const CatSchema = z.object({
  photo: z.string().nonempty("Il campo photo non può essere vuoto"), // È equivalente a .min(1), ma è più leggibile per il caso specifico della stringa vuota
  
  // se arrivano come stringhe, usa z.coerce per forzare la trasformazione in number
  longitudine: z.coerce
    .number({ invalid_type_error: "longitudine deve essere un numero" })
    .refine(val => val >= -180 && val <= 180, {
      message: "longitudine fuori dai limiti (-180,180)",
    }),

  latitudine: z.coerce
    .number({ invalid_type_error: "latitudine deve essere un numero" })
    .refine(val => val >= -90 && val <= 90, {
      message: "latitudine fuori dai limiti (-90,90)",
    }),

  title: z.string().min(1, "Il titolo non può essere vuoto"), // Valida che title sia una stringa non vuota

  description: z.string().min(1, "La descrizione non può essere vuoto"),
});
// export type CreateCatInput = z.infer<typeof createCatSchema>; // tipo TypeScript basato automaticamente sullo schema Zod