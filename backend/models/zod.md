# Defining a schema

Before you can do anything else, you need to define a schema. For the purposes of this guide, we'll use a simple object schema.

import { z } from "zod/v4"; 
 
const Player = z.object({ 
  username: z.string(),
  xp: z.number()
});

# parsing data

Given any Zod schema, use .parse to validate an input. If it's valid, Zod returns a strongly-typed deep clone of the input.

Player.parse({ username: "billie", xp: 100 }); 
// => returns { username: "billie", xp: 100 }

# Handling errors

When validation fails, the .parse() method will throw a ZodError instance with granular information about the validation issues.

try {
  Player.parse({ username: 42, xp: "100" });
} catch(error){
  if(error instanceof z.ZodError){
    error.issues; 
    /* [
      {
        expected: 'string',
        code: 'invalid_type',
        path: [ 'username' ],
        message: 'Invalid input: expected string'
      },
      {
        expected: 'number',
        code: 'invalid_type',
        path: [ 'xp' ],
        message: 'Invalid input: expected number'
      }
    ] */
  }
}

To avoid a try/catch block, you can use the .safeParse() method to get back a plain result object containing either the successfully parsed data or a ZodError. The result type is a discriminated union, so you can handle both cases conveniently.

const result = Player.safeParse({ username: 42, xp: "100" });
if (!result.success) {
  result.error;   // ZodError instance
} else {
  result.data;    // { username: string; xp: number }
}