import { type SafeParseReturnType, type z, type ZodSchema } from "zod";

type ChangesetReturnType<T> = {
  valid: boolean;
  data: T;
  changes: Partial<T>;
  errors?: ValidationErrorMap<T>;
};
type ValidationErrorMap<T> = Record<keyof T, { message: string; code: string }>;

export function createValidator<T extends Record<string, unknown>>(
  schema: ZodSchema<T>,
) {
  function changeset(
    entity: T,
    changes: Partial<T> = {},
  ): ChangesetReturnType<T> {
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
    ]),
  ) as ValidationErrorMap<E>;
}
