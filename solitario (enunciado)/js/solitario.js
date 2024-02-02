/******** INICIO DECLARACIÓN DE VARIABLES GLOBALES ********/

// Array de palos:
let palos = ["ova", "cua", "hex", "cir"];
// Array de número de cartas:
let numeros = [1,2,3,4,5,6,7,8,9, 10, 11, 12];
// Paso en px de una carta a la siguiente en un mazo:
let paso = 5;
// Tapetes
let tapete_inicial   = document.getElementById("inicial");
let tapete_sobrantes = document.getElementById("sobrantes");
let tapete_receptor1 = document.getElementById("receptor1");
let tapete_receptor2 = document.getElementById("receptor2");
let tapete_receptor3 = document.getElementById("receptor3");
let tapete_receptor4 = document.getElementById("receptor4");

///////////////////////// Mazos /////////////////////////

//Mazo de partida
let mazo_inicial = [];
    for (let palo of palos) {
      for (let numero of numeros) {
        mazo_inicial.push("imagenes/baraja/"+ numero + "-" + palo + ".png");
      }
    }

//Mazo de sobrantes
let mazo_sobrantes = [];

//Mazos inferiores
let mazo_receptor1 = [];
let mazo_receptor2 = [];
let mazo_receptor3 = [];
let mazo_receptor4 = [];

////////////////////////////////////////////////////////

// Contadores de cartas
let cont_inicial     = document.getElementById("contador_inicial");
let cont_sobrantes   = document.getElementById("contador_sobrantes");
let cont_receptor1   = document.getElementById("contador_receptor1");
let cont_receptor2   = document.getElementById("contador_receptor2");
let cont_receptor3   = document.getElementById("contador_receptor3");
let cont_receptor4   = document.getElementById("contador_receptor4");
let cont_movimientos = document.getElementById("contador_movimientos");

// Tiempo
let cont_tiempo  = document.getElementById("contador_tiempo");
let segundos 	 = 0;
let temporizador = null; // manejador del temporizador

/******** FIN DECLARACIÓN DE VARIABLES GLOBALES ********/


// Asigno método comenzar_juego al botón Reset
document.getElementById("reset").onclick = comenzar_juego;

// Método para comenzar/resetear el juego (contiene más métodos desarollados debajo)
function comenzar_juego() {

	// Barajar
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

}

// Método para el temporizador
function arrancar_tiempo(){
	if (temporizador) clearInterval(temporizador);
    let hms = function (){
			let seg = Math.trunc( segundos % 60 );
			let min = Math.trunc( (segundos % 3600) / 60 );
			let hor = Math.trunc( (segundos % 86400) / 3600 );
			let tiempo = ( (hor<10)? "0"+hor : ""+hor )
						+ ":" + ( (min<10)? "0"+min : ""+min )
						+ ":" + ( (seg<10)? "0"+seg : ""+seg );
			set_contador(cont_tiempo, tiempo);
            segundos++;
		}
	segundos = 0;
    hms();
	temporizador = setInterval(hms, 1000);
}

//Método para barajar cartas
function barajar(mazo) {
	for (let i = mazo.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));

        // Los intercambiamos guardando en una variable extra
        let temp = mazo[i];
        mazo[i] = mazo[j];
        mazo[j] = temp;
    }
}

//Método para poner las cartas sobre el tapete inicial
function cargar_tapete_inicial(mazo) {
	for(var i = 0; i<mazo.length; i++){
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


/**
 	Esta función debe incrementar el número correspondiente al contenido textual
   	del elemento que actúa de contador
*/
function inc_contador(contador){
    contador.innerHTML = contador.innerHTML + 1;




} // inc_contador

/**
	Idem que anterior, pero decrementando
*/
function dec_contador(contador){
	contador.innerHTML = contador.innerHTML - 1;


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

// event.preventDefault() se utiliza para permitirte soltar el elemento que arrastras
// allowDrop(event) se llama cuando se está arrastrando algo sobre un elemento
// event.dataTransfer.setData("text", event.target.src) establece los datos que se deben transferir durante el arrastre (la URL de la imagen)
// drop(event): Esta función se llama cuando se suelta algo sobre un elemento


function dragStart(event) {
	event.dataTransfer.setData("Text", event.target.id);
  }

  function allowDrop(event) {
	event.preventDefault();
  }

  function drop(event) {
	//te permite soltar datos encima
	event.preventDefault();
	//guardas en variable 'data' la URL de la imagen que arrastras
	var data = event.dataTransfer.getData("Text");
	//añades al destino los datos obtenidos
	event.target.appendChild(document.getElementById(data));
    //deshabilita la capacidad de arrastrar para la imagen colocada
    img.removeAttribute("draggable");
  }

  function meterReceptor(){

  }