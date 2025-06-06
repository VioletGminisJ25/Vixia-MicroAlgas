// src/App.tsx
import WebSocket from './hooks/WebSockect_lasData'
import { Routes, Route, useLocation } from 'react-router-dom';
import Heather from './components/Heather';

import Index from './pages/PageIndex';
import Compare from './pages/PageCompare';
import PageNotFound from './pages/404';
import Login from './pages/PageLogin';
import Register from './pages/PageResgister'
import Sensores from './pages/PageSensores';
import { ToastContainer } from 'react-toastify';


function App() {
  const { data, isManual, isWake, lightsState, isConnected } = WebSocket(import.meta.env.VITE_API_URL)

  const location = useLocation();


  // useEffect(() => {
  //   const url = import.meta.env.VITE_CHECK_AUTH;
  //   console.log("VITE_CHECK_AUTH =", url);

  //   fetch(url, { credentials: 'include' })
  //     .then(res => {
  //       if (res.ok) setLoged(true);
  //       else setLoged(false);
  //     })
  //     .catch(err => {
  //       console.error("Error al verificar autenticación:", err);
  //       setLoged(false);
  //     });
  // }, [location.pathname]);

  let headerProps = {
    texto: 'Principal',
    showCompare: true,
    showSensores: true,
    showPrediciones: true,
    showBack: true,
    showPh: true,
    showTemp: true,
    isConnected: isConnected
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
        isConnected: isConnected
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
        isConnected: isConnected
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
        isConnected: isConnected
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
        isConnected: isConnected
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
        isConnected: isConnected
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
        isConnected: isConnected
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
        isConnected: isConnected
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
        isConnected: isConnected
      };
      break;
  }

  return (
    <>
      <Heather {...headerProps}></Heather>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route path='/' element={
          <Index data={data} isManual={isManual} isWake={isWake} lightsState={lightsState} isConnected={isConnected} />

        } />
        <Route path='/comparacion' element={
          <Compare datosWebSocket={data} isConnected={isConnected} />
        } />
        <Route path='/sensores' element={
          <Sensores />
        } />
        <Route path="*" element={
          <PageNotFound />
        } />
      </Routes>

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
    </>
  );
}

export default App;