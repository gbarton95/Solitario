/************ DECLARACIÓN DE VARIABLES GLOBALES ************/
// Array de palos:
let palos = ["ova", "cua", "hex", "cir"];

// Array de número de cartas:
let numeros = [11,12];

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

// Ventana de la victoria y audio
const ventanaVictoria = document.getElementById('ventanaVictoria');
const sonido = new Audio('imagenes/victorySoundEffect.mp3');

/********** FIN DECLARACIÓN DE VARIABLES GLOBALES **********/

// MÉTODO PRINCIPAL: comenzar/resetear el juego
function comenzar_juego() {
	var tablaPodio = document.getElementById("body");
	while (tablaPodio.rows.length > 2) {
		tablaPodio.deleteRow(2); // Eliminar la tercera y las siguientes
	}
	var puntuaciones = obtenerPodio();
	puntuaciones.forEach(function(puntuacion) {
		var fila = document.createElement("tr");

		var celdaNombre = document.createElement("td");
		celdaNombre.textContent = puntuacion.nombre;
		fila.appendChild(celdaNombre);

		var celdaTiempo = document.createElement("td");
		celdaTiempo.textContent = puntuacion.tiempo;
		fila.appendChild(celdaTiempo);

		var celdaMovimientos = document.createElement("td");
		celdaMovimientos.textContent = puntuacion.movimientos;
		fila.appendChild(celdaMovimientos);

		tablaPodio.appendChild(fila);
	});
	//parar victoria
	pararVictoria();

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
	cargar_tapete(mazo_inicial, tapete_inicial);

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

	//comprobamos si el mazo inicial esta vacio y metemos las cartas del mazo sobrante al inicial
	verificarMazoInicial();

}

// MÉTODO PRINCIPAL: desarrollo del juego
function jugada(mazo, tapete, cont) {
	if (mazo == mazo_sobrantes) {
		var ultimaCarta = mazo_inicial.pop();
		mazo.push(ultimaCarta);

		// Crear la imagen para mostrar la carta en el receptor1
		var img = document.createElement("img");
		img.src = mazo[mazo.length - 1];
		img.draggable = true;
		img.setAttribute("class", "carta");
		img.setAttribute("ondragstart", "dragStartSobrantes(event)");
		tapete.appendChild(img);

		// Actualizar contadores y eliminar carta de mazo_inicial
		inc_contador(cont);
		dec_contador(cont_inicial);
		inc_contador(cont_movimientos);
		var imagenes = tapete_inicial.getElementsByTagName("img");
		imagenes[imagenes.length - 1].remove();
	} else//jugada que realizamos si soltamos una carta del mazo inicial a un tapete
		if ((mazo.length == 0 && comprobarRey(mazo_inicial)) || compatibilidadCarta(mazo_inicial, mazo)) {
			//meto en el mazo receptor la ultima carta del mazo inicial, borrando a la vez esta carta
			var ultimaCarta = mazo_inicial.pop();
			mazo.push(ultimaCarta);
			// Crear la imagen para mostrar la carta en el receptor1
			var img = document.createElement("img");
			img.src = mazo[mazo.length - 1];
			img.setAttribute("class", "carta");
			img.draggable = false;
			tapete.appendChild(img);

			// Actualizar contadores y eliminar carta de mazo_inicial
			inc_contador(cont);
			dec_contador(cont_inicial);
			inc_contador(cont_movimientos);

			var imagenes = tapete_inicial.getElementsByTagName("img");
			imagenes[imagenes.length - 1].remove();
		}
	draggeable();
	verificarMazoInicial();
	victoria();
}

function desdeSobrantes(mazo, tapete, cont) {
	//jugada que realizamos si la carta es desde el mazo de sobrantes
	if ((mazo.length == 0 && comprobarRey(mazo_sobrantes)) || compatibilidadCarta(mazo_sobrantes, mazo)) {
		var ultimaCarta = mazo_sobrantes.pop();
		mazo.push(ultimaCarta);

		// Crear la imagen para mostrar la carta en el receptor1
		var img = document.createElement("img");
		img.src = mazo[mazo.length - 1];
		img.setAttribute("class", "carta");
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
	//cada vez que el mazo inicial se queda sin cartas, se pasan las cartas del mazo sobrante al mazo inicial
	if (parseInt(cont_inicial.innerHTML) === 0) {
		mazo_inicial = mazo_sobrantes.slice(); // Copiamos el mazo de sobrantes
		barajar(mazo_inicial);
		cargar_tapete(mazo_inicial, tapete_inicial);
		mazo_sobrantes.length = 0;
		resetTapete(tapete_sobrantes);
		set_contador(cont_sobrantes, 0);
		set_contador(cont_inicial, mazo_inicial.length);
		draggeable();
	}
}

function obtenerUltimaCarta(mazo) {
	//obtiene el numero y el palo de la ultima carta del mazo que necesitemos
	let ultimaCarta = mazo[mazo.length - 1];
	// Extraer el número y el palo de la ruta de la imagen
	let partes = ultimaCarta.split("/");
	//cogemos solo la tercera parte, despues de baraja/
	let nombreArchivo = partes[partes.length - 1];
	//quitamos el mng del final y dividimos en numero y palo
	let [numero, palo] = nombreArchivo.split("-").map(item => item.replace(".png", ""));
	return { numero, palo };
}

function comprobarRey(mazo) {
	let ultimaCarta = obtenerUltimaCarta(mazo);
	if (ultimaCarta.numero == 12) {
		return true;
	} else {
		return false;
	}
}

function compatibilidadCarta(mazo_origen, mazo_receptor) {
	//comprobamos los numeros de la carta que soltamos y la carta ya puesta en el mazo, para que cumpla siempre la regla de que la que soltamos tiene que ser una menor si ya esta
	//el rey puesto y la regla de los palos
	let ultimaCarta = obtenerUltimaCarta(mazo_origen);
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
function cargar_tapete(mazo, tapete) {
	if (mazo_inicial == mazo) {
		for (var i = 0; i < mazo.length; i++) {
			var img = document.createElement("img");
			img.src = mazo[i];
			img.style.top = paso * i + "px";
			img.style.left = paso * i + "px";
			img.draggable = false;
			img.setAttribute("class", "carta");
			tapete.appendChild(img);
		}
	} else {
		for (var i = 0; i < mazo.length; i++) {
			var img = document.createElement("img");
			img.src = mazo[i];
			img.setAttribute("class", "carta");
			tapete.appendChild(img);
		}
	}
}

function resetTapete(tapete) {
	var imagenes = tapete.getElementsByTagName("img");
	for (var i = imagenes.length - 1; i >= 0; i--) {
		imagenes[i].remove();
	}
}

// Contadores
function inc_contador(contador) {/* */
	contador.innerHTML = parseInt(contador.innerHTML) + 1;
}
function dec_contador(contador) {/* */
	contador.innerHTML = parseInt(contador.innerHTML) - 1;
}
function set_contador(contador, valor) {/* */
	contador.innerHTML = valor;
}

// Tiempo
function arrancar_tiempo() {/* */
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

function parar_tiempo() {/* */
	if (temporizador) {
		clearInterval(temporizador);
		temporizador = null;
	}
}

// Drag & Drop

function dragStart(event) {/**/
	event.dataTransfer.setData("Text", event.target.id);
	event.dataTransfer.setData("fromSobrantes", "false");
}

function dragStartSobrantes(event) {/* */
	event.dataTransfer.setData("Text", event.target.id);
	event.dataTransfer.setData("fromSobrantes", "true");
}

function allowDrop(event) {/* */
	event.preventDefault();
}

function drop(event) {
	event.preventDefault();
	//comprobamos que soltemos la carta o en un tapete o encima de la ultima carta de ese tapete
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
		if (event.dataTransfer.getData("fromSobrantes") === "false") {
			jugada(mazo_sobrantes, tapete_sobrantes, cont_sobrantes);
			//comprobamos que la carta no venga de sobrantes, ya que sino se podría soltar una cara del mazo sobrantes al tapete de sobrantes y pillaria la carta del mazo inicial,
			//ya que asi esta hecha la jugada
		}
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

function victoria() {
	if (cont_inicial.innerHTML == 0 && cont_sobrantes.innerHTML == 0) {
		// Parar el tiempo
		parar_tiempo();
		// Mostrar la ventana emergente y el confeti
		ventanaVictoria.style.display = 'block';
		confeti.style.display = 'block';
		// Reproducir sonido
		sonido.play();

		do{
			var nombre = prompt("Introduce un nombre menor de 10 caracteres para guardar tu puntuación");
			if (nombre == "") {
				nombre = null;
			}
		}while(nombre.length>=10)

		guardarPuntuacion(segundos - 1, cont_movimientos.innerHTML, nombre);
	}
}


function pararVictoria() {
	ventanaVictoria.style.display = 'none';
	confeti.style.display = 'none';

	// Detener la reproducción del sonido
	sonido.pause();
	sonido.currentTime = 0;  // Reiniciar el tiempo de reproducción al principio

}

function guardarPuntuacion(tiempo, movimientos, nombre) {
	if (nombre == null) {
		nombre = "Anónimo";
	}
	let podio = obtenerPodio();

	podio.push({ nombre, tiempo, movimientos });

	podio.sort((a, b) => a.tiempo - b.tiempo);

	const max = 5;
	podio = podio.slice(0, max);

	// Guardar las puntuaciones actualizadas
	localStorage.setItem('podio', JSON.stringify(podio));
	console.log(localStorage.getItem('podio'));
}

function obtenerPodio() {
	return JSON.parse(localStorage.getItem('podio')) || [];
}