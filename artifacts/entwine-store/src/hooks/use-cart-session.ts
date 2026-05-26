import { useEffect, useState } from 'react';

export function useCartSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const storedSession = localStorage.getItem('entwine_session_id');
    if (storedSession) {
      setSessionId(storedSession);
    } else {
      const newSession = crypto.randomUUID();
      localStorage.setItem('entwine_session_id', newSession);
      setSessionId(newSession);
    }
  }, []);

  return sessionId;
}
