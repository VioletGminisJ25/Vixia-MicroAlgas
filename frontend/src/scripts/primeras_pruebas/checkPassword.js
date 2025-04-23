//Script para comprobar que la contraña no tenga caracteres no permitidos
document.addEventListener("DOMContentLoaded", () => {
	const form = document.querySelector("form");
	const passwordInput = document.querySelector("#password");

    //Al cargar evento submit boton
	form.addEventListener("submit", (e) => {
        console.log("entra")
		const password = passwordInput.value;
        //Se quitan espacio y comprueba los caracteres no permitidos
		const trimmedPassword = password.trim();
		const forbiddenChars = /[\x00-\x1F\x7F]/;
        //comprobacion
		if (forbiddenChars.test(trimmedPassword)) {
			e.preventDefault(); // Evita que se envíe
			alert("La contraseña contiene caracteres no permitidos.");
			return;
		}
        //Envia
		passwordInput.value = trimmedPassword;
	});
});
