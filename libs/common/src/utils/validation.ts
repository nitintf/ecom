import type { ClassConstructor } from 'class-transformer';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

function validateConfig<T extends object>(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<T>,
): T {
  const validatedConfig = plainToClass(envVariablesClass, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMsg = errors
      .map(
        (error) =>
          `\nError in ${error.property}:\n` +
          (error.constraints
            ? Object.entries(error.constraints)
                .map(([key, value]) => `+ ${key}: ${value}`)
                .join('\n')
            : ''),
      )
      .join('\n');

    // eslint-disable-next-line no-console
    console.error(`\n${errors.toString()}`);
    throw new Error(errorMsg);
  }
  return validatedConfig;
}

export default validateConfig;
