const cripto = document.querySelector("#cripto");
const moneda = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const principal = document.querySelector(".principal")

const objBusqueda = {
    moneda: "",
    cripto: ""
}
const obtenerCriptomonedas = criptos => new Promise(resolve => {
    resolve(criptos)
});

document.addEventListener("DOMContentLoaded", () => {
    consultarCriptomonedas();
    formulario.addEventListener("submit", cotizarFormulario);
    cripto.addEventListener("change", añadirSeleccion)
    moneda.addEventListener("change", añadirSeleccion)
})


function consultarCriptomonedas() {
    const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

    fetch(url)
        .then(resp => resp.json())
        .then(datos => obtenerCriptomonedas(datos.Data))
        .then(criptos => selectCriptomonedas(criptos))


}

function selectCriptomonedas(criptos) {
    criptos.forEach(individual => {

        const { FullName, Name } = individual.CoinInfo;
        let codigo = `  <option value="${Name}">${FullName}</option>`;
        cripto.innerHTML += codigo;
    });

}

function añadirSeleccion(e) {
    objBusqueda[e.target.name] = e.target.value
        // console.log(objBusqueda)
}

function cotizarFormulario(e) {
    e.preventDefault();
    const { moneda, cripto } = objBusqueda;
    if (moneda == "" || cripto == "") {
        validacion("Completa todos los campos", "error")
    } else {
        validacion("Cotizando...")
        consultarAPI();
        Spinners();
    }


}

function validacion(mensaje, tipo) {
    const er = document.querySelector(".error")
    if (!er) {
        const div = document.querySelector(".validar");
        const p = document.createElement("P");
        p.textContent = mensaje;
        div.appendChild(p)
        if (tipo == "error") {
            p.classList.add("error")
        } else {
            p.classList.add("correcto")
        }
        setTimeout(() => {
            p.remove()
        }, 2000);
    }
}

function consultarAPI() {
    const { moneda, cripto } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cripto}&tsyms=${moneda}`;

    setTimeout(() => {
        limpiar();
        fetch(url)
            .then(resultado => resultado.json())
            .then(datos => mostrarDatosAPI(datos, moneda, cripto))
    }, 2000);
}

function mostrarDatosAPI(dato, moneda, cripto) {

    let resultado = dato.DISPLAY[cripto][moneda];
    const { PRICE, LOWDAY, HIGHDAY, CHANGEPCT24HOUR, LASTUPDATE } = resultado;
    let codigo = ` <h2 class="precio">El precio es: <span>${PRICE}</span></h2>
                     <h2 class="precio">Precio mas alto del dia es: <span>${HIGHDAY}</span></h2>
    <h2 class="precio">Precio mas bajo del dia es: <span>${LOWDAY}</span></h2>
    <h2 class="precio">Variacion ultimas 24 horas: <span>${CHANGEPCT24HOUR}</span></h2>
    <h2 class="precio">Ultima Actualizacion: <span>${LASTUPDATE}</span></h2>`;

    principal.innerHTML = codigo;


}

function Spinners() {
    const div = document.createElement("DIV");
    div.classList.add("spinner");
    div.innerHTML = ` <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>`;
    principal.appendChild(div);
}


function limpiar() {
    principal.innerHTML = "";
}