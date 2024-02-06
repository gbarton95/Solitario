/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Array de palos:
let palos = ["ova", "cua", "hex", "cir"];
// Array de número de cartas:
//let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// En las pruebas iniciales solo se trabajará con cuatro cartas por palo:
let numeros = [ 11, 12];

// Paso (top y left) en pixeles de una carta a la siguiente en un mazo:
let paso = 5;

// Tapetes
let tapete_inicial = document.getElementById("inicial");
let tapete_sobrantes = document.getElementById("sobrantes");
let tapete_receptor1 = document.getElementById("receptor1");
let tapete_receptor2 = document.getElementById("receptor2");
let tapete_receptor3 = document.getElementById("receptor3");
let tapete_receptor4 = document.getElementById("receptor4");

///////////////////////////////// Mazos ///////////////////////////////////

//Mazo de partida
let mazo_inicial = [];

//Mazo de sobrantes
let mazo_sobrantes = [];

//Mazos inferiores
let mazo_receptor1 = [];
let mazo_receptor2 = [];
let mazo_receptor3 = [];
let mazo_receptor4 = [];

// Contadores de cartas
let cont_inicial = document.getElementById("contador_inicial");
let cont_sobrantes = document.getElementById("contador_sobrantes");
let cont_receptor1 = document.getElementById("contador_receptor1");
let cont_receptor2 = document.getElementById("contador_receptor2");
let cont_receptor3 = document.getElementById("contador_receptor3");
let cont_receptor4 = document.getElementById("contador_receptor4");
let cont_movimientos = document.getElementById("contador_movimientos");

///Arrays de valores para las jugadas(mirar jugada())
let tapetesReceptores = [tapete_receptor1, tapete_receptor2, tapete_receptor3, tapete_receptor4];
let mazosReceptores = [mazo_receptor1, mazo_receptor2, mazo_receptor3, mazo_receptor4];
let cont_receptores = [cont_receptor1, cont_receptor2, cont_receptor3, cont_receptor4];

// Tiempo
let cont_tiempo = document.getElementById("contador_tiempo"); // span cuenta tiempo
let segundos = 0;    // cuenta de segundos
let temporizador = null; // manejador del temporizador

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/


// Rutina asociada a boton reset: comenzar_juego
document.getElementById("reset").onclick = comenzar_juego;

// El juego arranca ya al cargar la página: no se espera a reiniciar
/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/

// Desarrollo del comienzo del juego
function comenzar_juego() {

	resetTapete(tapete_inicial);
	resetTapete(tapete_receptor1);
	resetTapete(tapete_receptor2);
	resetTapete(tapete_receptor3);
	resetTapete(tapete_receptor4);
	resetTapete(tapete_sobrantes);

	mazo_inicial = [];
	mazo_receptor1 = [];
	mazo_receptor2 = [];
	mazo_receptor3 = [];
	mazo_receptor4 = [];
	mazo_sobrantes = [];

	llenarMazo(); //llenamos mazo inicial
	barajar(mazo_inicial);

	// Dejar mazo_inicial en tapete inicial
	cargar_tapete_inicial(mazo_inicial);

	// Puesta a cero de contadores de mazos
	set_contador(cont_sobrantes, 0);
	set_contador(cont_receptor1, 0);
	set_contador(cont_receptor2, 0);
	set_contador(cont_receptor3, 0);
	set_contador(cont_receptor4, 0);
	set_contador(cont_movimientos, 0);
	set_contador(cont_inicial, mazo_inicial.length)

	// Arrancar el conteo de tiempo
	arrancar_tiempo();

	//hacemos la ultima carta del tapete draggeable
	draggeable();

} // comenzar_juego


/**
	Se debe encargar de arrancar el temporizador: cada 1000 ms se
	debe ejecutar una función que a partir de la cuenta autoincrementada
	de los segundos (segundos totales) visualice el tiempo oportunamente con el
	format hh:mm:ss en el contador adecuado.

	Para descomponer los segundos en horas, minutos y segundos pueden emplearse
	las siguientes igualdades:

	segundos = truncar (   segundos_totales % (60)                 )
	minutos  = truncar ( ( segundos_totales % (60*60) )     / 60   )
	horas    = truncar ( ( segundos_totales % (60*60*24)) ) / 3600 )

	donde % denota la operación módulo (resto de la división entre los operadores)

	Así, por ejemplo, si la cuenta de segundos totales es de 134 s, entonces será:
	   00:02:14

	Como existe la posibilidad de "resetear" el juego en cualquier momento, hay que
	evitar que exista más de un temporizador simultáneo, por lo que debería guardarse
	el resultado de la llamada a setInterval en alguna variable para llamar oportunamente
	a "clearInterval" en su caso.
*/

function llenarMazo(){
	for (let palo of palos) {
		for (let numero of numeros) {
			mazo_inicial.push("imagenes/baraja/" + numero + "-" + palo + ".png");
		}
	}
}

function resetTapete(tapete){
	var imagenes = tapete.getElementsByTagName("img");
	for(var i = imagenes.length-1; i>=0; i--){
		imagenes[i].remove();
	}
}



function arrancar_tiempo() {
	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/
	if (temporizador) clearInterval(temporizador);
	let hms = function () {
		let seg = Math.trunc(segundos % 60);
		let min = Math.trunc((segundos % 3600) / 60);
		let hor = Math.trunc((segundos % 86400) / 3600);
		let tiempo = ((hor < 10) ? "0" + hor : "" + hor)
			+ ":" + ((min < 10) ? "0" + min : "" + min)
			+ ":" + ((seg < 10) ? "0" + seg : "" + seg);
		set_contador(cont_tiempo, tiempo);
		segundos++;
	}
	segundos = 0;
	hms(); // Primera visualización 00:00:00
	temporizador = setInterval(hms, 1000);

} // arrancar_tiempo


/**
	Si mazo es un array de elementos <img>, en esta rutina debe ser
	reordenado aleatoriamente. Al ser un array un objeto, se pasa
	por referencia, de modo que si se altera el orden de dicho array
	dentro de la rutina, esto aparecerá reflejado fuera de la misma.
	Para reordenar el array puede emplearse el siguiente pseudo código:

	- Recorramos con i todos los elementos del array
		- Sea j un indice cuyo valor sea un número aleatorio comprendido
			entre 0 y la longitud del array menos uno. Este valor aleatorio
			puede conseguirse, por ejemplo con la instrucción JavaScript
				Math.floor( Math.random() * LONGITUD_DEL_ARRAY );
		- Se intercambia el contenido de la posición i-ésima con el de la j-ésima




*/


function barajar(mazo) {
	for (let i = mazo.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));

		// Los intercambiamos guardando en una variable extra
		let temp = mazo[i];
		mazo[i] = mazo[j];
		mazo[j] = temp;
	}

}



/**
	Al final se debe ajustar el contador de cartas a la cantidad oportuna
*/
function cargar_tapete_inicial(mazo) {
	for (var i = 0; i < mazo.length; i++) {
		var img = document.createElement("img");
		img.src = mazo[i];
		img.style.position = "absolute";
		img.style.top = paso * i + "px";
		img.style.left = paso * i + "px";
		img.style.width = "50px";
		img.style.height = "75px";
		img.draggable = false;
		tapete_inicial.appendChild(img);
	}

} // cargar_tapete_inicial


/**
	  Esta función debe incrementar el número correspondiente al contenido textual
		  del elemento que actúa de contador
*/
function inc_contador(contador) {
	contador.innerHTML = parseInt(contador.innerHTML) + 1;




} // inc_contador

/**
	Idem que anterior, pero decrementando
*/
function dec_contador(contador) {
	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! ***/
	contador.innerHTML = parseInt(contador.innerHTML) - 1;



} // dec_contador

/**
	Similar a las anteriores, pero ajustando la cuenta al valor especificado
*/
function set_contador(contador, valor) {
	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/
	contador.innerHTML = valor;
} // set_contador


// Desarrollo de la continuación del juego
// Funciones drag & drop


/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/

function dragStart(event) {
	event.dataTransfer.setData("Text", event.target.id);
}

function allowDrop(event) {
	event.preventDefault();
}

function obtenerUltimaCarta(mazo) {
	let ultimaCarta = mazo[mazo.length - 1];
	// Extraer el número y el palo de la ruta de la imagen
	let partes = ultimaCarta.split("/");
	//cogemos solo la tercera parte, despues de baraja/
	let nombreArchivo = partes[partes.length - 1];
	//quitamos el mng del final y dividimos en numero y palo
	let [numero, palo] = nombreArchivo.split("-").map(item => item.replace(".png", ""));
	return { numero, palo };
}

function comprobarRey() {
	let ultimaCarta = obtenerUltimaCarta(mazo_inicial);
	if (ultimaCarta.numero == 12) {
		return true;
	} else {
		return false;
	}
}



function comprobarNumeroPaloMazoReceptor(mazo_receptor) {
	let ultimaCarta = obtenerUltimaCarta(mazo_inicial);
	let cartaPuesta = obtenerUltimaCarta(mazo_receptor);
	let palosRojos = ["cua", "ova"];
	let palosGrises = ["cir", "hex"];
	//falta comprobar los palos
	if (ultimaCarta.numero == cartaPuesta.numero - 1 ) {
		if((palosRojos.includes(ultimaCarta.palo) && palosGrises.includes(cartaPuesta.palo)) || (palosGrises.includes(ultimaCarta.palo) && palosRojos.includes(cartaPuesta.palo)))
		return true;
	} else {
		return false;
	}
}

function drop(event) {
	event.preventDefault();
	for (let i = 0; i < tapetesReceptores.length; i++) {
        if (event.target === tapetesReceptores[i]) {
            jugada(mazosReceptores[i], tapetesReceptores[i], cont_receptores[i]);
			console.log(cont_receptor1);
			console.log(mazo_receptor1.length);

        }
    }
}

function jugada(mazo_receptor, tapete_receptor, cont_receptor) {
	if ((mazo_receptor.length == 0 && comprobarRey()) || comprobarNumeroPaloMazoReceptor(mazo_receptor)) {
		//meto en el mazo receptor la ultima carta del mazo inicial, borrando a la vez esta carta
		mazo_receptor.push(mazo_inicial.pop());

		// Crear la imagen para mostrar la carta en el receptor1
		var img = document.createElement("img");
		img.src = mazo_receptor[mazo_receptor.length - 1];
		img.style.position = "absolute";
		img.style.top = "25px";
		img.style.left = "25px";
		img.style.width = "50px";
		img.style.height = "75px";
		img.draggable = false;
		tapete_receptor.appendChild(img);

		// Actualizar contadores y eliminar carta de mazo_inicial
		inc_contador(cont_receptor);
		dec_contador(cont_inicial);
		inc_contador(cont_movimientos);

		var tapete = tapete_inicial.getElementsByTagName("img");
		tapete[tapete.length - 1].remove();
		draggeable();
	}

}

//metodo para convertir la ultima carta en draggeable
function draggeable() {
	var imagenes = tapete_inicial.getElementsByTagName("img");
	var carta = imagenes[imagenes.length - 1];
	carta.setAttribute("ondragstart", "dragStart(event)");
	carta.setAttribute("draggable", "true");
}