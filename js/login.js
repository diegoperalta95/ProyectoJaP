function onSignIn(googleUser) {

  var profile = googleUser.getBasicProfile();
  //var idToken = googleUser.getAuthResponse().id_token;
  localStorage.setItem('Name',profile.getName());

  if (localStorage.getItem('Name') != undefined || sessionStorage.getItem('Name') != null){
    localStorage.setItem('Name',profile.getGivenName());
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
  window.location.href="home.html";
})

document.addEventListener("DOMContentLoaded", function (e) {
  if (localStorage.getItem('Name') != undefined){
    window.location.href = "home.html";
  }
});

