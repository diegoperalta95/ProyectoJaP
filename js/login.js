function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var id_token = googleUser.getAuthResponse().id_token;
  if (id_token != undefined || id_token != null){
    window.location.href="home.html"
  };    
}

var form = document.forms[0];
form.addEventListener('submit', function(e){
  usr = form[0].value;
  pss = form[1].value;
  if(usr == "" || usr == null || pss == "" || pss == null){
    e.preventDefault();
  }
})
