//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse().id_token;
    if (id_token != undefined || id_token != null){
      window.location.href="home.html"
    };    
}

document.addEventListener("DOMContentLoaded", function(e){  

}
);