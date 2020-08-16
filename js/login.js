function onSignIn(googleUser) {

  var profile = googleUser.getBasicProfile();
  //var idToken = googleUser.getAuthResponse().id_token;
  sessionStorage.setItem('Name',profile.getName());

  if (sessionStorage.getItem('Name') != undefined || sessionStorage.getItem('Name') != null){
    sessionStorage.setItem('Name',profile.getName());
    sessionStorage.setItem('Email',profile.getEmail());
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
  sessionStorage.setItem('Name',usr);
  sessionStorage.setItem('Password',pss);
})
