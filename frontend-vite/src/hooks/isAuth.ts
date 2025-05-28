// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(import.meta.env.VITE_CHECK_AUTH, {
                    credentials: 'include',
                });
                setIsAuthenticated(res.ok);
            } catch (e) {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    return isAuthenticated;
}