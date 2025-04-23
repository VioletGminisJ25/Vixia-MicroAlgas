fetch('http://193.146.35.170:5000/temp_ph')
    .then(response => response.json())
    .then(data => console.log(data))
export default function miFuncion() {
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://193.146.35.170:5000/temp_ph')
        .then(response => response.json())
        .then(data => {
            const dataSea = data.data;
            document.querySelectorAll('button').forEach(button => {
                const text = button.textContent.trim().toLowerCase();
                const id = button.id.trim().toLowerCase();
                if (dataSea.hasOwnProperty(id)) {
                    console.log(id, dataSea[id]);
                    button.textContent = dataSea[id] + "" +id;
                }
            });
        })
        .catch(error => console.error('Error al obtener los datos:', error));
});