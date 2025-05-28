import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import type { SampleData,LightsState } from '../interface/Global_Interface';

export interface UseWebSocketLastDataResult {
    lightsState: LightsState | null;
    data: SampleData | null;
    isManual: boolean | null;
    isWake: boolean | null;
    socket: Socket | null;
    isConnected: boolean;
    error: Error | null;
    connect: () => void;
    disconnect: () => void;
}

/**
 * Custom hook to connect to a WebSocket via socket.io,
 * handle real-time events, and expose connection state.
 * @param url WebSocket server URL
 */
export default function useWebSocketLastData(
    url: string
): UseWebSocketLastDataResult {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [data, setData] = useState<SampleData | null>(null);
    const [lightsState, setLightsState] = useState<LightsState | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isManual, setManual] = useState<boolean | null>(null);
    const [isWake, setWake] = useState<boolean | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const socketRef = useRef<Socket | null>(null);

    const connect = useCallback(() => {
        if (!socketRef.current) {
            const newSocket = io(url, { timeout: 10000 });
            socketRef.current = newSocket;

            newSocket.on('connect', () => {
                console.log('Connected to WebSocket server');
                setIsConnected(true);
                setError(null);
                toast.success('Connected to server!');
            });

            newSocket.on('connect_error', (err: Error) => {
                console.error('WebSocket connection error:', err);
                setIsConnected(false);
                setError(err);
                toast.error(err.message);
            });

            newSocket.on('connect_timeout', (timeout: number) => {
                const err = new Error(`Connection timeout: ${timeout}`);
                console.error(err.message);
                setIsConnected(false);
                setError(err);
                toast.error(err.message);
            });

            newSocket.on('disconnect', (reason: string) => {
                console.log('Disconnected from WebSocket server:', reason);
                setIsConnected(false);
                toast.warn(`Disconnected: ${reason}`);
            });

            newSocket.on('arduino_data', (newData: SampleData) => {
                console.log('Received data from WebSocket:', newData);
                setData(newData);
                toast.success('New data received!');
            });

            newSocket.on('lights_state', (state) => {
                console.log('Lights state:', state);
                setLightsState(state);
            });

            newSocket.on('manual_mode', (manual: boolean) => {
                console.log('Manual mode:', manual,);
                setManual(manual);
            });

            newSocket.on('wake_up_state', (wake: boolean) => {
                console.log('Wake up state:', wake);
                setWake(wake);
            });

            newSocket.on('onreboot', (onReboot: any) => {
                console.log('Reboot event:', onReboot);
            });

            setSocket(newSocket);
        }
    }, [url]);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setSocket(null);
            setIsConnected(false);
        }
    }, []);

    useEffect(() => {
        connect();
        return () => {
            disconnect();
        };
    }, [connect, disconnect]);

    return {
        lightsState,
        data,
        isManual,
        isWake,
        socket,
        isConnected,
        error,
        connect,
        disconnect,
    };
}
