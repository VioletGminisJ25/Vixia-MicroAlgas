fetch('http://193.146.35.170:5000/color')
    .then(response => response.json())
    .then(data => console.log(data))
export default function miFuncion() {
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://193.146.35.170:5000/color')
        .then(response => response.json())
        .then(data => {

            if (data.hasOwnProperty('color') && Array.isArray(data.color)) {
                const colorRGB = data.color;

                if (colorRGB.length === 3) {
                    const rgbString = `rgb(${colorRGB[0]}, ${colorRGB[1]}, ${colorRGB[2]})`;
                    const rgbDiv = document.getElementById('rgb');
                    
                    if (rgbDiv) {
                        console.log("Colores rgb "+rgbString)
                        rgbDiv.style.backgroundColor = rgbString;
                    } else {
                        console.error('No se encontró el div con id "rgb"');
                    }
                } else {
                    console.error('El arreglo color no tiene 3 elementos:', colorRGB);
                }
            }
        })
        .catch(error => console.error('Error al obtener los datos:', error));
});