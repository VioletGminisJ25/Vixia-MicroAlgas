//WebSocket usado para comunicacion en tiempo real
import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

//Hace la conexion y mediante los estados de la conexion informa con toastify
const useWebSocket_lastData = (url) => {
    const [socket, setSocket] = useState(null);
    const [data, setData] = useState(null);
    const [lights_state, setLightsState] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const socketRef = useRef(null);

    const connect = useCallback(() => {
        if (!socketRef.current) {
            socketRef.current = io(url);
            const currentSocket = socketRef.current;

            currentSocket.on('connect', () => {
                console.log('Conectado al servidor WebSocket');
                setIsConnected(true);
                setError(null);
                toast.success('Conectado al servidor!', {});
            });

            currentSocket.on('connect_error', (err) => {
                console.error('Error de conexión al WebSocket:', err);
                setIsConnected(false);
                setError(err);
                toast.error(`Error de conexión: ${error.message || error}`, {});
            });

            currentSocket.on('connect_timeout', (timeout) => {
                console.error('Tiempo de espera agotado al conectar al WebSocket:', timeout);
                setIsConnected(false);
                setError(new Error(`Tiempo de espera agotado: ${timeout}`));
                toast.error(`Tiempo de espera agotado: ${timeout}`, {});
            });

            currentSocket.on('disconnect', (reason) => {
                console.log('Desconectado del servidor WebSocket:', reason);
                setIsConnected(false);
                toast.warn(`Desconectado del servidor: ${reason}`, {});
            });

            currentSocket.on('arduino_data', (newData) => {
                console.log('Datos recibidos:', newData);
                setData(newData);
                toast.success('Ultimos datos recibidos', {});
            });
            currentSocket.on("lights_state", (data) => {
                console.log("isActive", data)
                setLightsState(data);
            });

            setSocket(currentSocket);
        }
    }, [url]);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
            setSocket(null);
        }
    }, []);

    useEffect(() => {
        connect();

        return () => {
            disconnect();
        };
    }, [url, connect, disconnect]);

    return { socket, lights_state, data, isConnected, error, connect, disconnect };
};

export default useWebSocket_lastData;


