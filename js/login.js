function onSignIn(googleUser) {

  var profile = googleUser.getBasicProfile();
  //var idToken = googleUser.getAuthResponse().id_token;
  localStorage.setItem('Name',profile.getName());

  if (localStorage.getItem('Name') != undefined || sessionStorage.getItem('Name') != null){
    localStorage.setItem('Name',profile.getName());
    localStorage.setItem('Email',profile.getEmail());
    window.location.href="home.html";
    
  }
}

var form = document.forms[0];
form.addEventListener('submit', function(e){
  usr = form[0].value;
  pss = form[1].value;
  if(usr == "" || usr == null || usr == undefined || pss == "" || pss == null || pass == undefined){
    e.preventDefault();
    alert("Datos no correctos");
  }
  localStorage.setItem('Name',usr);
})

document.addEventListener("DOMContentLoaded", function (e) {
  //Esto funciona solo en chrome, ya que firefox no mantiene localStorage ni sessionStorage entre pestañas
  if (localStorage.getItem('Name') != undefined){
    window.location.href = "home.html";
  }
});

