const input = document.getElementById("input");
const output = document.getElementById("p");
const button = document.getElementById("button")

button.addEventListener("click", clik);

function clik() {
    output.textContent = window.atob(input.value);
}