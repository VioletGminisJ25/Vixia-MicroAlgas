import { useEffect, useState } from 'react';
import LastCurrentData from './Grafico';
import type { SampleData } from "../../scripts/data_interface";


export default function ParentComponent() {
    const [datos, setDatos] = useState<SampleData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://193.146.35.170:5000/data');
                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }
                const jsonData: SampleData = await response.json();
                setDatos(jsonData);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setDatos(null);
            }
        };

        fetchData();

        // Creamos intervalo que llama cada X milisegundos
        const interval = setInterval(fetchData, 15 * 60 * 1000); // cada 15 minutos

        // Limpiamos el intervalo cuando el componente se desmonte
        return () => clearInterval(interval);
    }, []); // Solo se ejecuta al montar el componente

    return (
        <div className="flex flex-col h-full">
            <div className="
                flex flex-1 justify-around
                items-center 
            ">
                <LastCurrentData titulo='FECHA MAS RECIENTE' datos={datos ?? null} />
            </div>
        </div>
    );
}
