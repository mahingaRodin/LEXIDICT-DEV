import { useCallback, useState } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);

  const show = useCallback((message, type = 'success') => {
    setToast({ message, type, key: Date.now() });
  }, []);

  const hide = useCallback(() => setToast(null), []);

  return { toast, show, hide, visible: Boolean(toast?.message) };
}
