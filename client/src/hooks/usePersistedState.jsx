import { useState, useEffect } from "react";

export default function usePersistedState(key, initialValue) {
    const [state, setState] = useState(initialValue);

    useEffect(() => {
        const stored = localStorage.getItem(key);
        if (stored) {
            try {
                setState(JSON.parse(stored))
            } catch {
                setState(initialValue);
            }
        }
    }, [key]);

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
}