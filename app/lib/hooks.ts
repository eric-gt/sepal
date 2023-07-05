import { ChangeEvent, useState } from "react";

export function useFormFields<T>(
  initialState: T
): [T, (e: ChangeEvent<HTMLInputElement>) => void] {
  const [fields, setValues] = useState(initialState);
  return [
    fields,
    (event: ChangeEvent<HTMLInputElement>) => {
      setValues({
        ...fields,
        [event.target.id]: event.target.value,
      });
    },
  ];
}
