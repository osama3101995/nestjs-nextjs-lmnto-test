import { useState } from 'react';
import { ZodSchema } from 'zod';

export function useSchemaForm<T>(schema: ZodSchema<T>, initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<string | null>(null);

  const handleChange = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const result = schema.safeParse(values);
    if (!result.success) {
      const errorMessage = result.error.errors
        .map((e) => `${e.path.join('.')} ${e.message}`)
        .join(', ');
      setErrors(errorMessage);
      return false;
    }
    setErrors(null);
    return true;
  };

  return { values, handleChange, validate, errors, setValues };
}