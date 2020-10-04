import { useState, useEffect } from 'react';

// Code from https://typeofnan.dev/using-local-storage-in-react-with-your-own-custom-uselocalstorage-hook/
export default function useLocalStorage(key, defaultValue) {
  const stored = localStorage.getItem(key);
  const initial = stored ? JSON.parse(stored) : defaultValue;
  const [value, setValue] = useState(initial);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
