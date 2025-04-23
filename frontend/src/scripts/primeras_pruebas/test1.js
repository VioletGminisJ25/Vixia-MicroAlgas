
fetch('http://193.146.35.170:5000/colors')
    .then(response => response.json())
    .then(data => console.log(data))
export default function miFuncion() {
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://193.146.35.170:5000/colors')
        .then(response => response.json())
        .then(data => {
            const colors = data.colors;
            document.querySelectorAll('button').forEach(button => {
                const text = button.textContent.trim().toLowerCase();
                const id = button.id.trim().toLowerCase();
                if (colors.hasOwnProperty(id)) {
                    console.log(text, colors[id], id);
                    button.disabled = !colors[id];
                    if (button.disabled) {
                        button.classList.add('opacity-50', 'cursor-not-allowed');
                    } else {
                        button.classList.remove('opacity-50', 'cursor-not-allowed');
                    }
                }
            });
        })
        .catch(error => console.error('Error al obtener los datos:', error));
});