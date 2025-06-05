
import styled from 'styled-components';
/**
 * MIT License
 * Copyright (c) 2025 adamiebl
 * See https://uiverse.io/adamgiebl/thin-lionfish-5
 */

//Componente que se usa para la carga de datos
const Loader = () => {
  return (
    <StyledWrapper>
      <section className="dots-container">
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </section>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .dots-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  .dot {
    height: 20px;
    width: 20px;
    margin-right: 10px;
    border-radius: 10px;
    background-color: #b3d4fc;
    animation: pulse 1.5s infinite ease-in-out;
  }

  .dot:last-child {
    margin-right: 0;
  }

  .dot:nth-child(1) {
    animation-delay: -0.3s;
  }

  .dot:nth-child(2) {
    animation-delay: -0.1s;
  }

  .dot:nth-child(3) {
    animation-delay: 0.1s;
  }

 @keyframes pulse {
  0% {
    transform: scale(0.8);
    background-color: #00B657; /* verde medio brillante */
    box-shadow: 0 0 0 0 rgba(0, 182, 87, 0.6);
  }

  50% {
    transform: scale(1.2);
    background-color: #008437; /* verde más oscuro */
    box-shadow: 0 0 0 10px rgba(0, 182, 87, 0);
  }

  100% {
    transform: scale(0.8);
    background-color: #00B657;
    box-shadow: 0 0 0 0 rgba(0, 182, 87, 0.6);
  }
}`;

export default Loader;
