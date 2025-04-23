import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import type { CompareData } from '../../scripts/data_interface';

//env de conexiones
const urlGetHours: string = import.meta.env.PUBLIC_GET_HOURS;
const urlGetComparasion: string = import.meta.env.PUBLIC_GET_COMPARASION;
interface CalendarProps {
  setDatos: React.Dispatch<React.SetStateAction<CompareData | null>>;
}
//metodo react
export default function Calendar({ setDatos }: CalendarProps) {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [hoursOptions, setHoursOptions] = useState<string[]>([]);
  const [selectedHour, setSelectedHour] = useState<string>('');

  //state del componente para la gestion de errores y conexion
  const [loadingHours, setLoadingHours] = useState(false);
  const [errorHours, setErrorHours] = useState<string | null>(null);

  //este evento manda la fecha selecionada al servidor y espera una respuesta
  const handleDateChange = async (date: Date | null) => {
    setStartDate(date);
    //Se limpian los datos para evitar desincronizaciones
    setHoursOptions([]);
    setSelectedHour('');
    if (!date) return;
    //Se cargan los states de load a true y error a null
    setLoadingHours(true);
    setErrorHours(null);

    const payload = JSON.stringify({ date: format(date, 'yyyy-MM-dd') });

    try {
      const response = await fetch(urlGetHours, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: payload
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 404) {
          setErrorHours(data.error);
        } else {
          setErrorHours(data.error);
        }
        return;
      }
      console.log(data)
      setHoursOptions(data);

    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setErrorHours('No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.');
    } finally {
      setLoadingHours(false);
    }
  };

  //evento que manda la hora (y fecha) al servidor y esprea una respuesta
  const handleHour = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTime = e.target.value;
    setSelectedHour(selectedTime);

    if (!startDate || !selectedTime) return;

    // Combinar fecha y hora
    const [hours, minutes, seconds] = selectedTime.split(':');
    const combinedDateTime = new Date(startDate);
    combinedDateTime.setHours(parseInt(hours, 10));
    combinedDateTime.setMinutes(parseInt(minutes, 10));
    combinedDateTime.setSeconds(parseInt(seconds, 10));

    // Formatear según requerimiento
    const formattedDateTime = format(combinedDateTime, 'yyyy-MM-dd HH:mm:ss');

    console.log(formattedDateTime)
    // // Enviar al servidor
    fetch(urlGetComparasion, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date: formattedDateTime })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Comparación recibida:', data);
        setDatos(data)
      })
      .catch(error => {
        console.error('Error al enviar hora:', error);
      });

  }
  //Estructura y diseño de los componentes
  //atach de los eventos a los componentes
  return (
    <div className="flex flex-row  justify-center items-center space-x-4">
      <p className='text-black dark:text-white font-bold'>SELECIONAR UNA FECHA</p>
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        maxDate={new Date()}
        placeholderText="Selecciona una fecha"
        className="bg-white dark:bg-[#1d1f21] text-black dark:text-white border dark:border-white border-black rounded  px-2 py-2 text-center text-sm"
        popperPlacement='top-end'
        required
      />

      {loadingHours ? (
        <span className="text-black dark:text-white font-bold"> Cargando datos...</span>
      ) : errorHours ? (
        <span className="text-red-600">{errorHours}</span>
      ) : (
        <select
          onChange={handleHour}
          value={selectedHour}
          disabled={hoursOptions.length === 0}
          className=" bg-white dark:bg-[#1d1f21] text-black dark:text-white border dark:border-white border-black rounded px-2 py-2 text-sm text-center"
        >
          <option value="">Selecciona una hora</option>
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
