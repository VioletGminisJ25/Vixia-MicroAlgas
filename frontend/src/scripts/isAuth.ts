
export function isAuth() {
    if (!localStorage.getItem("isAuth")) {
        // Si no tiene token, redirige al login
        window.location.href = "/login";
    }
}
