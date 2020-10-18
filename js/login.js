var profile = {};
var logged = false;

function onSignIn(googleUser) {
  var googleProfile = googleUser.getBasicProfile();
  let profile = {};
  profile.name = googleProfile.getGivenName();
  profile.surname = googleProfile.getFamilyName();
  profile.date = "";
  profile.email = googleProfile.getEmail();
  profile.phoneNumber = "";
  profile.profilePic = googleProfile.getImageUrl();
  localStorage.setItem('Profile', JSON.stringify(profile));
  window.location.href = "home.html";
}

function signIn() {
  var form = document.forms[0];
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    usr = form[0].value;
    pss = form[1].value;

    if (usr == "" || usr == null || usr == undefined || pss == "" || pss == null || pass == undefined) {
      alert("Datos no correctos");
    };

    profile.name = usr;

    getJSONData(PROFILES).then(function (resultObj) {
      if (resultObj.status === "ok") {
        resultObj.data.forEach(function (user) {
          if (user.name == usr && user.pass == pss) {
            profile.surname = user.surname;
            profile.date = user.date;
            profile.email = user.email;
            profile.phoneNumber = user.number;
            profile.profilePic = user.avatar;
            localStorage.setItem('Profile', JSON.stringify(profile));
            logged = true;
            window.location.href = "home.html";
          }
        });
        if(!logged){
          profile.surname = "";
          profile.date = "";
          profile.email = "";
          profile.phoneNumber = "";
          profile.profilePic = "./img/img_avatar4.png";
          localStorage.setItem('Profile', JSON.stringify(profile));
          window.location.href = "home.html";
        };
        
      }
    });
  })
}

document.addEventListener("DOMContentLoaded", function (e) {
  signIn();
  
  if (JSON.parse(localStorage.getItem('Profile')).name != "Invitado") {
    window.location.href = "home.html";
  }
  
});

