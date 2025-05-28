// src/App.tsx
import { Routes, Route, useLocation } from 'react-router-dom';
import Heather from './components/Heather';

import Index from './pages/PageIndex';
import Compare from './pages/PageCompare';
import Ph from './pages/PagePh';
import Temp from './pages/PageTemp';
import PageNotFound from './pages/404';
import Login from './pages/PageLogin';
import Register from './pages/PageResgister'
import Sensores from './pages/PageSensores';

function App() {
  const location = useLocation();

  let headerProps = {
    texto: 'Principal',
    showCompare: true,
    showSensores: true,
    showPrediciones: true,
    showBack: true,
    showPh: true,
    showTemp: true,
  };

  switch (location.pathname) {
    case '/':
      headerProps = {
        texto: 'Principal',
        showCompare: true,
        showSensores: true,
        showPrediciones: true,
        showBack: false,
        showPh: true,
        showTemp: true,
      };
      break;
    case '/comparacion':
      headerProps = {
        texto: 'Comparación',
        showCompare: false,
        showSensores: true,
        showPrediciones: true,
        showBack: true,
        showPh: true,
        showTemp: true,
      };
      break;
    case '/ph':
      headerProps = {
        texto: 'pH',
        showCompare: true,
        showSensores: true,
        showPrediciones: true,
        showBack: true,
        showPh: false,
        showTemp: true,
      };
      break;
    case '/temperature':
      headerProps = {
        texto: 'Temperatura',
        showCompare: true,
        showSensores: true,
        showPrediciones: true,
        showBack: true,
        showPh: true,
        showTemp: false,
      };
      break;
    case '/login':
      headerProps = {
        texto: 'Login',
        showCompare: false,
        showSensores: false,
        showPrediciones: false,
        showBack: false,
        showPh: false,
        showTemp: false,
      };
      break;
    case '/register':
      headerProps = {
        texto: 'Register',
        showCompare: false,
        showSensores: false,
        showPrediciones: false,
        showBack: false,
        showPh: false,
        showTemp: false,
      };
      break;
    case '/sensores':
      headerProps = {
        texto: 'Sensores',
        showCompare: true,
        showSensores: false,
        showPrediciones: true,
        showBack: true,
        showPh: true,
        showTemp: true,
      };
      break;

    default:
      // Este 'default' se ejecutará si la ruta no coincide con ninguna de las anteriores.
      // Aquí puedes decidir si quieres un texto de "Página Desconocida"
      // o si prefieres que el header de la 404 tome control total.
      // Para la página 404, el headerProps del componente PageNotFound se encargará.
      // Podrías dejar este 'default' vacío si la 404 es autocontenida con su propio Header.
      // O podrías establecer valores que sabes que no son para las rutas específicas.
      headerProps = {
        texto: 'Página Desconocida', // Esto se verá si no hay ruta y no es 404
        showCompare: false,
        showSensores: false,
        showPrediciones: false,
        showBack: false,
        showPh: false,
        showTemp: false,
      };
      break;
  }

  return (
    <>
      <Heather {...headerProps}></Heather>
      <Routes>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/register' element={<Register></Register>}></Route>
        <Route path="/" element={<Index />} />
        <Route path='/comparacion' element={<Compare />} />
        <Route path='/ph' element={<Ph />} />
        <Route path='/temperature' element={<Temp />} />
        <Route path='/sensores' element={<Sensores />} />
        {/* Esta es la ruta para la página 404 - ¡DEBE SER LA ÚLTIMA! */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;