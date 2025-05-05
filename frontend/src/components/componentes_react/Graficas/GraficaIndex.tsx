import { useEffect, useState } from 'react';
import LastCurrentData from '../Nivo/ComponenteGrafico_Nivo_LongitudDeOnda';
import type { SampleData } from "../../../scripts/Global_Interface";
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify'
import { io } from 'socket.io-client';


const urlenv = import.meta.env.PUBLIC_DATA;
const appearVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.7, ease: [0.25, 0.8, 0.25, 1] }
    }
};

/**
 * Componente padre que contiene el componente de la gráfica
 * @returns 
 */
export default function GraficaIndex() {

    const [datos, setDatos] = useState<SampleData | null>(null);
    /**
     * Efecto que se ejecuta al montar el componente y cada 15 minutos
     */
    useEffect(() => {

        const socket = io(import.meta.env.PUBLIC_DATA);

        socket.on('arduino_data', (data) => {

            console.log('Conectado al servidor de WebSocket' + data);
        });

        return () => {
            socket.disconnect();
        };
    }, []);
    // const fetchData = async () => {
    //     try {
    //         const response = await fetch(import.meta.env.PUBLIC_DATA);
    //         if (!response.ok) {
    //             throw new Error('Error al obtener los datos');
    //         }
    //         const jsonData: SampleData = await response.json();
    //         setDatos(jsonData);
    //         console.log('Datos obtenidos:', jsonData);
    //         toast.success('Datos obtenidos', {
    //             position: "bottom-right",
    //             autoClose: 5000,
    //             hideProgressBar: false,
    //             closeOnClick: false,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //             theme: "colored",
    //         });
    //     } catch (error) {
    //         console.error('Error al cargar datos:', error);
    //         toast.error("Eror de conexion", {
    //             position: "bottom-right",
    //             autoClose: 5000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //             theme: "colored",
    //         });

    //         setDatos(null);
    //     }




    //fetchData();


    //const interval = setInterval(fetchData, 15 * 60 * 1000); // cada 15 minutos

    // Limpiar el intervalo al desmontar el componente
    // Esto es importante para evitar fugas de memoria y llamadas innecesarias a la API



    //return () => clearInterval(interval);


    // Renderizar el componente de la gráfica y pasarle los datos
    // Si los datos son nulos, no se renderiza nada
    return (
        <div className="flex flex-col h-full">
            <div className="
                flex flex-1 justify-around
                items-center  w-[80%] mx-[10%] mt-[1%] mb-[1%]
            ">
                <motion.div
                    id="graficaAnimacion"
                    className="flex-1 h-[90%] mx-2"
                    variants={appearVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <LastCurrentData titulo='FECHA MAS RECIENTE' datos={datos ?? null} />
                </motion.div>
            </div>
        </div>
    );
}
