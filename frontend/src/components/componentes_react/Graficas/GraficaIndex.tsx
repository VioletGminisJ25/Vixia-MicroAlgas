import LastCurrentData from '../Nivo/ComponenteGrafico_Nivo_LongitudDeOnda';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import useWebSocket_lastData from '../../../hooks/WebSockect_lasData';

// Propiedades de las animaciones de carga de los componentes.
const appearVariants = { /* ... */ };

// Componente pagaina principal, se actualiza en tiempo real gracias al WebSocket
// Se utiliza el hook useWebSocket_lastData para obtener los datos del WebSocket.
// Podrá mostar si el medidión está conectado o no, así como apagarlo y encenderlo.
// También se podra solicitar una medición manual al servidor, si el medidor está apagado.
export default function GraficaIndex() {
    const { data: datos, isConnected, error } = useWebSocket_lastData("http://193.146.35.170:5000");
    
    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-1 justify-around items-center w-[80%] mx-[10%] mt-[1%] mb-[1%]">
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
            {/* Contenedor de notificaciones, con estilos unicos, las 'Toastify' son enviadas mediante el websocket */}
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                limit={3}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'}
            />
        </div>
    );
}