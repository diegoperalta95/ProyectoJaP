function actualPath($path){
  if(window.location.pathname.includes($path)){
    return true;
  }
  return false;
}

function showNavBar(){

    document.getElementById("navbar").innerHTML += `
      <div class="navbar-brand disabled">e-COMMERCE</div>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item ${(actualPath('/home.html')) ? 'active' : ''}">
            <a class="nav-link" href="home.html">Inicio</a>
          </li>
          <li class="nav-item ${(actualPath('/categor')) ? 'active' : ''}">
            <a class="nav-link" href="categories.html">Categorias</a>
          </li>
          <li class="nav-item ${(actualPath('/product')) ? 'active' : ''}">
            <a class="nav-link" href="products.html">Productos</a>
          </li>
          <li class="nav-item ${(actualPath('/sell.html')) ? 'active' : ''}">
            <a class="nav-link" href="sell.html">Vender</a>
          </li>
        </ul>
        
        <ul class="mb-0 pl-0">
        
          <li class="dropdown" id="dropdownUser" style="list-style:none;float:right;">
            <button id="menuUser" class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            </button>
              <div id="profileMenu" class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <a class="dropdown-item" id="register" href="index.html">Registrate!</a>
                <a class="dropdown-item" id="profileLink" href="my-profile.html">Perfil</a>
                <a class="dropdown-item" id="cart" href="cart.html">Mi carrito</a>
                <a class="dropdown-item" id="logoutLink" href="logout.html">Logout</a>
              </div>
          </li>
        </ul>
      </div>`
    
    var userLogged = JSON.parse(localStorage.getItem("Profile"));
    var infouser = document.getElementById("menuUser");
    var userLoggedShortName = "";

    if(userLogged){
      if(userLogged.name.length>11){
        userLoggedShortName = userLogged.name.slice(0,11) + `...`;
      }
    } 

    if(userLogged.name != "Invitado"){
      infouser.innerHTML += `<img class="avatar" src="${userLogged.profilePic ? userLogged.profilePic : './img/img_avatar4.png'}"> 
      </img> Bienvenido ${userLoggedShortName ? userLoggedShortName : userLogged.name}`;
      document.getElementById("register").remove();
    }else{
      infouser.innerHTML += `<img class="avatar" src="${userLogged.profilePic}"> </img> Bienvenido ${userLogged.name}`;
      document.getElementById("cart").remove();
      document.getElementById("profileLink").remove();
      document.getElementById("logoutLink").remove();    
    };

}

showNavBar();

document.addEventListener("DOMContentLoaded", function(e){ 

});