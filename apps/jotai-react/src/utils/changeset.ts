import { SafeParseReturnType, z, ZodSchema } from 'zod';

type ChangesetReturnType<T> = {
  valid: boolean;
  data: T;
  changes: Partial<T>;
  errors?: ValidationErrorMap<T>;
};
type ValidationErrorMap<T> = Record<keyof T, { message: string; code: string }>;

export function useChangeset<T extends Record<string, any>>(schema: ZodSchema<T>) {
  function changeset(entity: T, changes: Partial<T> = {}): ChangesetReturnType<T> {
    const parseResult = schema.safeParse(Object.assign({}, entity, changes));
    return {
      valid: parseResult.success,
      data: entity,
      changes: parseResult.success ? changes : {},
      errors: getErrorsIfAny(parseResult),
    };
  }

  return {
    changeset,
    schema,
  };
}

function getErrorsIfAny<T>(result: SafeParseReturnType<T, T>) {
  if (result.success) return;
  return prepareErrors(result);
}

function prepareErrors<E>(errorValidation: z.SafeParseError<E>) {
  return Object.fromEntries(
    errorValidation.error.errors.map((error) => [
      error.path[0] as keyof E,
      { message: error.message, code: error.code },
    ])
  ) as ValidationErrorMap<E>;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  const personSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    age: z.number().min(1),
  });

  type PersonType = z.infer<typeof personSchema>;

  const validator = useChangeset(personSchema);

  const invalidPerson: PersonType = {
    id: '',
    name: '',
    age: 0,
  };

  const validPerson: PersonType = {
    id: '0',
    name: 'Hank Green',
    age: 42,
  };

  it('should require a non-empty id, name and non-zero age', () => {
    const changeset = validator.changeset(invalidPerson);
    expect(changeset.valid).toBeFalsy();
    expect(changeset.errors?.id).toBeDefined();
    expect(changeset.errors?.name).toBeDefined();
    expect(changeset.errors?.age).toBeDefined();
  });

  it('should return empty changes on invalid', () => {
    const changeset = validator.changeset(invalidPerson);
    expect(changeset.valid).toBeFalsy();
    expect(changeset.changes).toStrictEqual({});
  });

  it('should accept a valid person and return empty errors', () => {
    const changeset = validator.changeset(validPerson);
    expect(changeset.valid).toBeTruthy();
    expect(changeset.errors).toBeUndefined();
  });
}
