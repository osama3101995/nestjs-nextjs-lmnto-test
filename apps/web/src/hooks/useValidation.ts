import { useState, useCallback } from 'react';

export function useValidation<T>(schema: any) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((data: T) => {
    const result = schema.safeParse(data);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((error: any) => {
        const path = error.path.join('.') || 'root';
        fieldErrors[path] = error.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    
    setErrors({});
    return true;
  }, [schema]);

  const clearErrors = () => setErrors({});

  return { errors, validate, clearErrors, setErrors };
}