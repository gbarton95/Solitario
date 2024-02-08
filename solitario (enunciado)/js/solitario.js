/************ DECLARACIÓN DE VARIABLES GLOBALES ************/
// Array de palos:
let palos = ["ova", "cua", "hex", "cir"];

// Array de número de cartas:
let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Paso (top y left) en pixeles:
let paso = 5;

// Tapetes
let tapete_inicial = document.getElementById("inicial");
let tapete_sobrantes = document.getElementById("sobrantes");
let tapete_receptor1 = document.getElementById("receptor1");
let tapete_receptor2 = document.getElementById("receptor2");
let tapete_receptor3 = document.getElementById("receptor3");
let tapete_receptor4 = document.getElementById("receptor4");

//Mazos
let mazo_inicial = [];
let mazo_sobrantes = [];
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

// Tiempo
let cont_tiempo = document.getElementById("contador_tiempo");
let segundos = 0;
let temporizador = null;

/********** FIN DECLARACIÓN DE VARIABLES GLOBALES **********/


// Asigno método comenzar_juego al botón Reset
document.getElementById("reset").onclick = comenzar_juego;

// MÉTODO PRINCIPAL: comenzar/resetear el juego
function comenzar_juego() {

	//resetear tapetes
	resetTapete(tapete_inicial);
	resetTapete(tapete_receptor1);
	resetTapete(tapete_receptor2);
	resetTapete(tapete_receptor3);
	resetTapete(tapete_receptor4);
	resetTapete(tapete_sobrantes);

	//resetear mazos
	mazo_inicial.length = 0;
	mazo_receptor1.length = 0;
	mazo_receptor2.length = 0;
	mazo_receptor3.length = 0;
	mazo_receptor4.length = 0;
	mazo_sobrantes.length = 0;

	llenarMazo();
	barajar(mazo_inicial);
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

	// Hacer la última carta del tapete draggeable
	draggeable();

	//???
	if (cont_inicial.innerHTML == 0) {
		mazo_inicial = mazo_sobrantes;
		barajar(mazo_inicial);
		cargar_tapete_inicial(mazo_inicial);
		mazo_sobrantes.length = 0;
		resetTapete(tapete_sobrantes);
	}

}

// MÉTODO PRINCIPAL: desarrollo del juego
function jugada(mazo, tapete, cont) {
	if ((mazo.length == 0 && comprobarReyInicial()) || comprobarNumeroPaloMazoReceptor(mazo_inicial, mazo)) {
		//meto en el mazo receptor la ultima carta del mazo inicial, borrando a la vez esta carta
		var ultimaCarta = mazo_inicial.pop();
		mazo.push(ultimaCarta);

		// Crear la imagen para mostrar la carta en el receptor1
		var img = document.createElement("img");
		img.src = mazo[mazo.length - 1];
		img.style.position = "absolute";
		img.style.top = "25px";
		img.style.left = "25px";
		img.style.width = "50px";
		img.style.height = "75px";
		img.draggable = false;

		tapete.appendChild(img);

		// Actualizar contadores y eliminar carta de mazo_inicial
		inc_contador(cont);
		dec_contador(cont_inicial);
		inc_contador(cont_movimientos);

		var imagenes = tapete_inicial.getElementsByTagName("img");
		imagenes[imagenes.length - 1].remove();
		draggeable();
	}
	verificarMazoInicial();
	verificarVictoria();
}

function jugadaSobrantes() {
	var ultimaCarta = mazo_inicial.pop();
	mazo_sobrantes.push(ultimaCarta);

	// Crear la imagen para mostrar la carta en el receptor1
	var img = document.createElement("img");
	img.src = mazo_sobrantes[mazo_sobrantes.length - 1];
	img.style.position = "absolute";
	img.style.top = "25px";
	img.style.left = "25px";
	img.style.width = "50px";
	img.style.height = "75px";
	img.draggable = true;
	img.setAttribute("id","carta");
	img.setAttribute("ondragstart", "dragStartSobrantes(event)");
	tapete_sobrantes.appendChild(img);

	// Actualizar contadores y eliminar carta de mazo_inicial
	inc_contador(cont_sobrantes);
	dec_contador(cont_inicial);
	inc_contador(cont_movimientos);

	var imagenes = tapete_inicial.getElementsByTagName("img");
	imagenes[imagenes.length - 1].remove();
	draggeable();
	verificarMazoInicial();
	verificarVictoria();
}

function desdeSobrantes(mazo, tapete, cont) {
	if ((mazo.length == 0 && comprobarReySobrantes()) || comprobarNumeroPaloMazoReceptor(mazo_sobrantes, mazo)) {
		var ultimaCarta = mazo_sobrantes.pop();
		mazo.push(ultimaCarta);

		// Crear la imagen para mostrar la carta en el receptor1
		var img = document.createElement("img");
		img.src = mazo[mazo.length - 1];
		img.style.position = "absolute";
		img.style.top = "25px";
		img.style.left = "25px";
		img.style.width = "50px";
		img.style.height = "75px";
		img.draggable = false;
		tapete.appendChild(img);

		// Actualizar contadores y eliminar carta de mazo_inicial
		inc_contador(cont);
		dec_contador(cont_sobrantes);
		inc_contador(cont_movimientos);

		var imagenes = tapete_sobrantes.getElementsByTagName("img");
		imagenes[imagenes.length - 1].remove();
	}
}

// Mazos
function llenarMazo() {
	for (let palo of palos) {
		for (let numero of numeros) {
			mazo_inicial.push("imagenes/baraja/" + numero + "-" + palo + ".png");
		}
	}
}

function barajar(mazo) {
	for (let i = mazo.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));

		// Variable auxiliar para intercambiar los datos
		let temp = mazo[i];
		mazo[i] = mazo[j];
		mazo[j] = temp;
	}
}

function verificarMazoInicial() {
	if (parseInt(cont_inicial.innerHTML) === 0) {
		mazo_inicial = mazo_sobrantes.slice(); // Copiamos el mazo de sobrantes
		barajar(mazo_inicial);
		cargar_tapete_inicial(mazo_inicial);
		mazo_sobrantes.length = 0;
		resetTapete(tapete_sobrantes);
		set_contador(cont_sobrantes, 0);
		set_contador(cont_inicial, mazo_inicial.length);
		draggeable();
	}
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

function comprobarReyInicial() {
	let ultimaCarta = obtenerUltimaCarta(mazo_inicial);
	if (ultimaCarta.numero == 12) {
		return true;
	} else {
		return false;
	}
}

function comprobarReySobrantes() {
	let ultimaCarta = obtenerUltimaCarta(mazo_sobrantes);
	if (ultimaCarta.numero == 12) {
		return true;
	} else {
		return false;
	}
}

function comprobarNumeroPaloMazoReceptor(mazoQueMandaLaCarta, mazo_receptor) {
	let ultimaCarta = obtenerUltimaCarta(mazoQueMandaLaCarta);
	let cartaPuesta = obtenerUltimaCarta(mazo_receptor);
	let palosRojos = ["cua", "ova"];
	let palosGrises = ["cir", "hex"];
	//falta comprobar los palos
	if (ultimaCarta.numero == cartaPuesta.numero - 1) {
		if ((palosRojos.includes(ultimaCarta.palo) && palosGrises.includes(cartaPuesta.palo)) || (palosGrises.includes(ultimaCarta.palo) && palosRojos.includes(cartaPuesta.palo)))
			return true;
	} else {
		return false;
	}
}

// Tapetes
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
}

function resetTapete(tapete) {
	var imagenes = tapete.getElementsByTagName("img");
	for (var i = imagenes.length - 1; i >= 0; i--) {
		imagenes[i].remove();
	}
}

// Contadores
function inc_contador(contador) {
	contador.innerHTML = parseInt(contador.innerHTML) + 1;
}
function dec_contador(contador) {
	contador.innerHTML = parseInt(contador.innerHTML) - 1;
}
function set_contador(contador, valor) {
	contador.innerHTML = valor;
}

// Tiempo
function arrancar_tiempo() {
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
}

function parar_tiempo() {
	if (temporizador) {
		clearInterval(temporizador);
		temporizador = null;
	}
}

// Drag & Drop

function dragStart(event) {
	event.dataTransfer.setData("Text", event.target.id);
}

function dragStartSobrantes(event) {
	event.dataTransfer.setData("Text", event.target.id);
	event.dataTransfer.setData("fromSobrantes", "true");
}

function allowDrop(event) {
	event.preventDefault();
}

function drop(event) {
	event.preventDefault();
	if (event.target == tapete_receptor1 || event.target == tapete_receptor1.lastChild) {
		if (event.dataTransfer.getData("fromSobrantes") === "true") {
			desdeSobrantes(mazo_receptor1, tapete_receptor1, cont_receptor1);
		} else {
			jugada(mazo_receptor1, tapete_receptor1, cont_receptor1);
		}
	} else if (event.target == tapete_receptor2 || event.target == tapete_receptor2.lastChild) {
		if (event.dataTransfer.getData("fromSobrantes") === "true") {
			desdeSobrantes(mazo_receptor2, tapete_receptor2, cont_receptor2);
		} else {
			jugada(mazo_receptor2, tapete_receptor2, cont_receptor2);
		}
	} else if (event.target == tapete_receptor3 || event.target == tapete_receptor3.lastChild) {
		if (event.dataTransfer.getData("fromSobrantes") === "true") {
			desdeSobrantes(mazo_receptor3, tapete_receptor3, cont_receptor3);
		} else {
			jugada(mazo_receptor3, tapete_receptor3, cont_receptor3);
		}
	} else if (event.target == tapete_receptor4 || event.target == tapete_receptor4.lastChild) {
		if (event.dataTransfer.getData("fromSobrantes") === "true") {
			desdeSobrantes(mazo_receptor4, tapete_receptor4, cont_receptor4);
		} else {
			jugada(mazo_receptor4, tapete_receptor4, cont_receptor4);
		}
	} else if (event.target == tapete_sobrantes || event.target == tapete_sobrantes.lastChild) {
		jugadaSobrantes();
	}
}

function draggeable() {
	if (mazo_inicial.length > 0) {
		var imagenes = tapete_inicial.getElementsByTagName("img");
		var carta = imagenes[imagenes.length - 1];
		carta.setAttribute("ondragstart", "dragStart(event)");
		carta.setAttribute("draggable", "true");
		carta.setAttribute("id", "carta");
	}
}

// MÉTODO PRINCIPAL: finalización del juego

function verificarVictoria() {
	if (cont_inicial.innerHTML == 0 && cont_sobrantes.innerHTML == 0) {
		parar_tiempo();

		victoria();
	}
}

function victoria() {
	// Mostrar la ventana emergente
	const ventanaVictoria = document.getElementById('ventanaVictoria');
	ventanaVictoria.style.display = 'block';

	// Reproducir sonido
	const sonido = new Audio('../victorySoundEffect.mp3');
	sonido.play();

	lanzarConfeti();
}

function lanzarConfeti() {
	const contenedorConfeti = document.getElementById('ventanaVictoria');
	for (let i = 0; i < 50; i++) {
		const confeti = document.createElement('div');
		confeti.className = 'confeti';
		confeti.style.left = Math.random() * window.innerWidth + 'px';
		confeti.style.animationDuration = Math.random() * 2 + 1 + 's';
		contenedorConfeti.appendChild(confeti);
	}
}
