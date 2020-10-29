var imgAsDataURL = null;

function loadProfile() {
    if (localStorage.getItem('Profile') != null || localStorage.getItem('Profile') != undefined) {
        let profile = JSON.parse(localStorage.getItem('Profile'));
        $('#names').val(profile.name);
        $('#surnames').val(profile.surname);
        $('#date').val(profile.date);
        $('#email').val(profile.email);
        $('#phoneNumber').val(profile.phoneNumber);
        if (profile.profilePic != "" && profile.profilePic != null) {
            $('#profilePic').val(profile.profilePic);
            $('#img-profile').attr("src", profile.profilePic);
        };
    };
    clearAvatarLinkButton()
}

function saveChanges() {
    let profile = {};
    profile.name = $('#names').val();
    profile.surname = $('#surnames').val();
    profile.date = $('#date').val();
    profile.email = $('#email').val();
    profile.phoneNumber = $('#phoneNumber').val();

    if(imgAsDataURL != null){
        profile.profilePic = imgAsDataURL;
    }else{
        profile.profilePic = $('#profilePic').val();
    };

    localStorage.setItem('Profile', JSON.stringify(profile));
    clearAvatarLinkButton()
};

function clearAvatarLinkButton() {
    if($('#profilePic').val()){
        $('#cleaProfilePic').show();
    }else{
        $('#cleaProfilePic').hide();
    };
}

function showSuccessAlert() {
    document.getElementById("resultSpan").innerHTML = "Ha guardado los cambios con éxito! (Cierre esta alerta para actualizar la página)";
    document.getElementById("alertResult").classList.add("show");
}

function draw() {
    var canvas = document.getElementById('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(this, 0, 0);
    imgAsDataURL = canvas.toDataURL("image/png");
}

function failed() {
    alert("No se pudo cargar la imagen.");
};

function uploadFile() {
    document.getElementById('fileInput').onchange = function (e) {
        var img = new Image();
        img.onload = draw;
        img.onerror = failed;
        img.src = URL.createObjectURL(this.files[0]);
    };
}

document.addEventListener("DOMContentLoaded", function (e) {

    checkLoggedUser();

    loadProfile();

    let form = document.getElementById('needs-validation');

    form.addEventListener('submit', function (event) {
        console.log("hola");
        if (form.checkValidity() === true) {
            saveChanges();
            showSuccessAlert();
        };
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
    });

    $('#alertDismiss').on('click', function (e) {
        location.reload();
    });

    uploadFile();
    

    $('#cleaProfilePic').on('click',function(e){
        $('#profilePic').val('');
        $('#cleaProfilePic').hide();
        $('#img-profile').attr('src','img/img_avatar4.png');
    });

});