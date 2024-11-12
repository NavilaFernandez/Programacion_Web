document.getElementById("miboton").addEventListener("click", function(event) {
    // Type
    console.log("Tipo de evento:", event.type);




    // Target
    console.log("Elemento:", event.target); 





    // Handler
    ejecutarAccion();





    // Object
    console.log("Objeto del evento:", event);
});

function ejecutarAccion() {

    let numero=1;
    let numero2=10;
    let suma= numero + numero2;
     console.log("Funcion:"+suma);
    }






// Propagation
document.getElementById("container").addEventListener("click", function() {
    console.log("Div clickeado");
});

document.getElementById("miboton2").addEventListener("click", function(event) {
    console.log("Botón clickeado");
    event.stopPropagation(); // Esto evita que el clic se propague al 'div'
});

