
function loadProfile(){
    if(localStorage.getItem('Profile') != null || localStorage.getItem('Profile') != undefined){
        let profile = JSON.parse(localStorage.getItem('Profile'));
        $('#names').val(profile.name);
        $('#surnames').val(profile.surname);
        $('#date').val(profile.date);
        $('#email').val(profile.email);
        $('#phoneNumber').val(profile.phoneNumber);
        if(profile.profilePic != "" || profile.profilePic.length != 0){
            $('#profilePic').val(profile.profilePic);
            $('#img-profile').attr("src",profile.profilePic);
        };
    };
}

function saveChanges(){
    let profile = {};
    profile.name = $('#names').val();
    profile.surname = $('#surnames').val();
    profile.date = $('#date').val();
    profile.email = $('#email').val();
    profile.phoneNumber = $('#phoneNumber').val();
    profile.profilePic = $('#profilePic').val();
    localStorage.setItem('Profile',JSON.stringify(profile));
};


document.addEventListener("DOMContentLoaded", function (e) {

    loadProfile();

    if (JSON.parse(localStorage.getItem('Profile')).name == "Invitado") {
        window.location.href = "/home.html";
    }

    let form = document.getElementById('needs-validation');

    form.addEventListener('submit', function(event) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      saveChanges();
      form.classList.add('was-validated');   
    });
});