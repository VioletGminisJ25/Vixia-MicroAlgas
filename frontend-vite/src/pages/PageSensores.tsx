import { ToastContainer } from "react-toastify";

export default function PageSensores() {
    return (
        <div className="flex flex-col items-center h-[90%] w-full">
            {/* Selector de fecha */}

            {/* Contenedor de gráficas con divisiones laterales */}


            {/* Contenedor de notificaciones, con estilos únicos, las 'Toastify' son enviadas mediante el websocket */}
            <ToastContainer
                position="bottom-right"
                autoClose={2000}
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