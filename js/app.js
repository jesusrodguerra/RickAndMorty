const formulario = document.getElementById('formulario')
const inputBuscar = document.getElementById('buscar')
const resultados = document.getElementById('resultados')
const divPaginacion = document.getElementById('paginacion')
let totalPaginas;
let iterador;
let paginaActual = 1;

formulario.addEventListener('submit', mostrar)

function mostrar(e) {
    e.preventDefault();
    obtenerApi()

}

async function obtenerApi() {
    const valor = inputBuscar.value
    const url = `https://rickandmortyapi.com/api/character/?page=${paginaActual}&name=${valor}`;
    const res = await fetch(url);
    const data = await res.json();
    totalPaginas = mostrarPagina(data.info.count)
    console.log(data)

    while( resultados.firstChild ) {
        resultados.removeChild(resultados.firstChild);
    }

    mostrarDatos(data.results);

    // Limpiamos la paginacion de la busqueda previa para que no aparezcan las paginaciones repetidas y solo las de la busqueda actual
    while(divPaginacion.firstChild) {
        divPaginacion.removeChild(divPaginacion.firstChild)
    }

    imprimirPaginador();

}

function mostrarDatos(data) {

    data.forEach(datos => {
        resultados.innerHTML += `
            <div class="card">
                <div class="card-image">
                    <img src=${datos.image} alt=${datos.name}>
                </div>                
                <div class="content">
                    <p class="title is-4"> ${datos.name} </p>
                    <p> <strong> Status: </strong> ${datos.status} <i class="fas fa-dot-circle" ${datos.status === 'Dead' ? 'style="color: red;"' : datos.status === 'unknown' ? 'style="color: yellow;"' : 'style="color: green;"'} ></i> </p>
                    <p> <strong> Species: </strong> ${datos.species} </p>
                    <p> <strong> Location: </strong> ${datos.location.name} </p>
                </div>
                </div>
            </div>

        `
    });
}

function mostrarPagina(total) {
    return parseInt(Math.ceil(total / 20))
}

function *generarPaginador(total) {
    for(let i = 1; i <= total ; i++) {
        // con yield en el generador registramos el valor de i para poder imprimirlo
        yield i;
    }
}

function imprimirPaginador() {
    iterador = generarPaginador(totalPaginas)

    while(true) {
        const { done, value } = iterador.next();
        // Si llegamos al final de las paginas, no hara nada
        if(done) return;

        // sino hemos llegado al final de las paginas, genera un boton por cada pagina 
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('btn', 'btn-dark');
        boton.dataset
        
        boton.onclick = () => {
            paginaActual = value;
            console.log(paginaActual)
            boton.classList.add('active')
            
            obtenerApi();
        }
        
        divPaginacion.appendChild(boton)
    }
}