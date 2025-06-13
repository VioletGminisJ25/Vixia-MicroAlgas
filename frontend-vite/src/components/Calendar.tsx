import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, set } from 'date-fns';
import type { CompareData } from '../interface/Global_Interface';
import { toast } from 'react-toastify';
import Loader from './ui/Loader'
import ConfirmModal from './ui/ConfirmModal';
//fuente https://www.npmjs.com/package/react-datepicker

//env de conexion
const urlGetHours: string = import.meta.env.VITE_GET_HOURS;
const urlGetComparasion: string = import.meta.env.VITE_GET_COMPARASION;

interface CalendarProps {
  setDatos: React.Dispatch<React.SetStateAction<CompareData | null>>;
  setData: React.Dispatch<React.SetStateAction<string | null>>;
  isConnected: boolean | null;
}

export default function Calendar({ setDatos, setData, isConnected }: CalendarProps) {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [hoursOptions, setHoursOptions] = useState<string[]>([]);
  const [selectedHour, setSelectedHour] = useState<string>('');
  const [loadingHours, setLoadingHours] = useState(false);
  const [errorHours, setErrorHours] = useState<string | null>(null);
  const [deleteData, setDeleteData] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Se envia la fecha a la api para obtener las horas.
  //Se informa de los errores por consola o toast, si todo va bien lo mismo.
  const fetchHours = async (date: Date) => {
    //Al cargar restauramos valores, se reinican los valores.
    setHoursOptions([]);
    setSelectedHour('');
    setLoadingHours(true);
    setErrorHours(null);

    const hour_send = JSON.stringify({ date: format(date, 'yyyy-MM-dd') });

    fetch(urlGetHours, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: hour_send
    }).then(async response => {
      const data = await response.json();
      if (!response.ok) {
        console.log(data.error + format(date, 'yyyy-MM-dd'));
        toast.warn(data.error + format(date, 'yyyy-MM-dd'), {});
        setErrorHours(data.error);
        return;
      }
      setHoursOptions(data);
    }).catch(error => {
      console.error('Error al conectar con el servidor:', error);
      setErrorHours('No se pudo conectar con el servidor.');

    }).finally(() => {
      setLoadingHours(false);
    });
  };

  useEffect(() => {
    if (startDate) {
      fetchHours(startDate);
    }
  }, []);

  //Se cambia la fecha y se llama a la función fetchHours para obtener las horas.
  const handleDateChange = async (date: Date | null) => {
    setStartDate(date);
    if (date) {
      fetchHours(date);
    }
  };

  //Al selecionar una hora se envia a la api fecha - hora para obtener los datos.
  //Puede haber errores por consola o toast, si todo va bien lo mismo.
  //Al selecionar una hora se guardan los datos en el state de la aplicación.
  //Este state se usa para mostrar los datos en la grafica.
  const handleHour = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTime = e.target.value;
    setSelectedHour(selectedTime);

    // Si el usuario selecciona el valor por defecto, no actualices deleteData
  if (!startDate || !selectedTime || selectedTime === '') {
    setDeleteData(null);
    setDatos(null);
    return;
  }

    const [hours, minutes, seconds] = selectedTime.split(':');
    const combinedDateTime = new Date(startDate);
    combinedDateTime.setHours(parseInt(hours, 10));
    combinedDateTime.setMinutes(parseInt(minutes, 10));
    combinedDateTime.setSeconds(parseInt(seconds, 10));

    const formattedDateTime = format(combinedDateTime, 'yyyy-MM-dd HH:mm:ss');

    console.log("Formato de fecha para el back: " + formattedDateTime);

    fetch(urlGetComparasion, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date: formattedDateTime })
    }).then(async response => {
      const data = await response.json();
      setDeleteData(formattedDateTime)

      if (!response.ok) {
        console.log('Error datos: ', data.error);
        toast.warn(data.error, {});
        setDatos(data)
        return;
      }
      if (data.selected_data.wave_length.length == 0) {
        toast.warn("datos corruptos", {});
        setDatos(data)
        return;
      }

      console.log('Comparación recibida: ', data.selected_data);
      setDatos(data);
      setData(formattedDateTime)
      toast.success('Datos obtenidos', {});
    }).catch(error => {
      console.error('Error al enviar hora:', error);
      toast.error('Error de conexion con el servidor', {});
    });
  };

  const handleDelete = () => {
    setIsModalOpen(true); // Mostrar el modal
  };
  const confirmDelete = () => {
    const baseUrl = import.meta.env.VITE_DELETE;
    const urlWithQuery = `${baseUrl}?date=${encodeURIComponent(deleteData ?? "")}`;
    console.log("borrando " + urlWithQuery);

    fetch(urlWithQuery, { method: "DELETE" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          console.log("Error al borrar datos: ", data.error);
          toast.error("Error al borrar datos");
          return;
        }

        console.log("Datos borrados: ", data.message);
        toast.success(data.message, {});
        setDatos(null);
        setData(null);
        setDeleteData(null);

        fetchHours(startDate ?? new Date()); // Actualiza las horas disponibles
      })
      .catch((error) => {
        console.error("Error al borrar datos:", error);
        toast.error("Error al borrar datos");
      })
      .finally(() => {
        setIsModalOpen(false); // Cerrar el modal
      });
  };

  const cancelDelete = () => {
    setIsModalOpen(false); // Cerrar el modal sin borrar
  };

  //Cuerpo de la componente
  return (
    <div className="flex flex-row justify-center items-center space-x-4">
      <p className='text-black dark:text-white font-bold'>SELECIONAR UNA FECHA</p>
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        maxDate={new Date()}
        placeholderText="Selecciona una fecha"
        className="bg-white dark:bg-[#1d1f21] text-black dark:text-white border dark:border-white border-black rounded  px-2 py-2 text-center text-sm"
        popperPlacement='top-end'
        required
      />

      {loadingHours ? (
        <Loader />
      ) : (
        <select
          onChange={handleHour}
          value={selectedHour}
          disabled={hoursOptions.length === 0}
          className={`bg-white dark:bg-[#1d1f21] border rounded px-2 py-2 text-sm text-center
    ${errorHours ? 'text-red-500 border-red-500 dark:border-red-500' : 'text-black dark:text-white border-black dark:border-white'}`}
        >
          <option value="">{errorHours ?? 'Selecciona una hora'}</option>
          {hoursOptions.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
      )}
      <button
        onClick={handleDelete}
        disabled={!deleteData || !isConnected}
        className={`w-10 h-10 flex justify-center items-center rounded transition border font-bold shadow-md duration-300 ease-in-out focus:outline-none focus:ring-2 
    ${deleteData && isConnected ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white active:scale-95 focus:ring-red-300 dark:focus:ring-red-900' : 'border-gray-400 text-gray-400 cursor-not-allowed'}`}
        aria-label="Eliminar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 
         01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 
         0a2 2 0 00-2-2H9a2 2 0 00-2 2m12 0H5"
          />
        </svg>
      </button>
      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

    </div>
  );
}