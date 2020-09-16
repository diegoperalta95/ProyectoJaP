function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut();
    auth2.disconnect();
}

function init() {
    localStorage.clear();
    gapi.load('auth2', function() {
    gapi.auth2.init().then(function (e){
        signOut();
        window.location.href="index.html";
    });
});
}