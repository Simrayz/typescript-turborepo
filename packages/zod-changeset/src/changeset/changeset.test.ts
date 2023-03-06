import { expect, it } from "vitest";
import { z } from "zod";
import { createValidator } from "./changeset";

const personSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  age: z.number().min(1),
});

type PersonType = z.infer<typeof personSchema>;

const validator = createValidator(personSchema);

const invalidPerson: PersonType = {
  id: "",
  name: "",
  age: 0,
};

const validPerson: PersonType = {
  id: "0",
  name: "Hank Green",
  age: 42,
};

it("should require a non-empty id, name and non-zero age", () => {
  const changeset = validator.changeset(invalidPerson);
  expect(changeset.valid).toBeFalsy();
  expect(changeset.errors?.id).toBeDefined();
  expect(changeset.errors?.name).toBeDefined();
  expect(changeset.errors?.age).toBeDefined();
});

it("should return empty changes on invalid", () => {
  const changeset = validator.changeset(invalidPerson);
  expect(changeset.valid).toBeFalsy();
  expect(changeset.changes).toStrictEqual({});
});

it("should accept a valid person and return empty errors", () => {
  const changeset = validator.changeset(validPerson);
  expect(changeset.valid).toBeTruthy();
  expect(changeset.errors).toBeUndefined();
});
