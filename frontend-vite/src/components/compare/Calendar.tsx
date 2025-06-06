import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import type { CompareData } from '../../interface/Global_Interface';
import { toast } from 'react-toastify';
import Loader from '../ui/Loader'

//fuente https://www.npmjs.com/package/react-datepicker

//env de conexion
const urlGetHours: string = import.meta.env.VITE_GET_HOURS;
const urlGetComparasion: string = import.meta.env.VITE_GET_COMPARASION;

interface CalendarProps {
  setDatos: React.Dispatch<React.SetStateAction<CompareData | null>>;
  setData: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Calendar({ setDatos, setData }: CalendarProps) {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [hoursOptions, setHoursOptions] = useState<string[]>([]);
  const [selectedHour, setSelectedHour] = useState<string>('');
  const [loadingHours, setLoadingHours] = useState(false);
  const [errorHours, setErrorHours] = useState<string | null>(null);
  //const [noDataForHour, setNoDataForHour] = useState(false);

  const fetchHours = async (date: Date) => {
    //Al cargar restauramos valores, se reinican los valores de.
    setHoursOptions([]);
    setSelectedHour('');
    setLoadingHours(true);
    setErrorHours(null);
    //setNoDataForHour(false);

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
        console.log(response);
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

  const handleDateChange = async (date: Date | null) => {
    setStartDate(date);
    if (date) {
      fetchHours(date);
    }
  };

  const handleHour = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTime = e.target.value;
    setSelectedHour(selectedTime);
    //setNoDataForHour(false);

    if (!startDate || !selectedTime) return;

    const [hours, minutes, seconds] = selectedTime.split(':');
    const combinedDateTime = new Date(startDate);
    combinedDateTime.setHours(parseInt(hours, 10));
    combinedDateTime.setMinutes(parseInt(minutes, 10));
    combinedDateTime.setSeconds(parseInt(seconds, 10));

    const formattedDateTime = format(combinedDateTime, 'yyyy-MM-dd HH:mm:ss');

    console.log(formattedDateTime);

    fetch(urlGetComparasion, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date: formattedDateTime })
    }).then(async response => {
      const data = await response.json();
      if (!response.ok) {
        console.log('Error datos', data);
        toast.warn(data.error, {});
        setDatos(data)
        return;
      }
      if (data.selected_data.wave_length.length == 0) {
        toast.warn("datos corruptos", {});
        setDatos(data)
        return;
      }

      console.log('Comparación recibida:', data);
      setDatos(data);
      setData(formattedDateTime)
      toast.success('Datos obtenidos', {});
    }).catch(error => {
      console.error('Error al enviar hora:', error);
      toast.error('Error de conexion con el servidor', {});
    });
  };

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
    </div>
  );
}