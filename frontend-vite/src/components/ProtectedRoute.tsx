// src/components/ProtectedRoute.tsx
import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({
    isAllowed,
    children,
}: {
    isAllowed: boolean | null;
    children: JSX.Element;
}) {
    if (isAllowed === null) return <p>Cargando...</p>; // o un spinner
    return isAllowed ? children : <Navigate to="/login" />;
}