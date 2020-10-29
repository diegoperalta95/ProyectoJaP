const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://diegoperalta95.github.io/ecommerce-api/products/cars/all.json";
const PRODUCT_INFO_URL = "https://diegoperalta95.github.io/ecommerce-api/products/cars/";
const PRODUCT_INFO_COMMENTS_URL = "https://diegoperalta95.github.io/ecommerce-api/comments/cars/all.json";
const CART_INFO_URL = "https://diegoperalta95.github.io/ecommerce-api/cart/cart.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";
const COUNTRIES = "https://diegoperalta95.github.io/ecommerce-api/countries/all.json";
const COUNTRY = "https://restcountries.eu/rest/v2/name/";
const PROFILES = "https://diegoperalta95.github.io/ecommerce-api/profile/all.json";


var showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function(url){
    var result = {};
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        return result;
    });
}

function createCartIfUserLogged(){
  if (JSON.parse(localStorage.getItem('Cart') == null)){
    let a = {};
    a['Cars'] = [];
    localStorage.setItem('Cart',JSON.stringify(a));
  }
}

function checkLoggedUser() {
  if (JSON.parse(localStorage.getItem('Profile')).name == "Invitado") {
      window.location.href = "index.html";
  }
}

document.addEventListener("DOMContentLoaded", function(e){ 

  $(window).scroll(function() {
    if ($(this).scrollTop()) {
        $('#top').fadeIn();
    } else {
        $('#top').fadeOut();
    }
  });

    $('#top').on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop:0}, '300');
  });

  if (JSON.parse(localStorage.getItem('Profile')) == null || JSON.parse(localStorage.getItem('Profile')) == undefined){
    let profile = {};
    profile.name = "Invitado";
    profile.surname = "";
    profile.date = "";
    profile.email = "";
    profile.phoneNumber = "";
    profile.profilePic = "./img/img_avatar4.png";
    localStorage.setItem('Profile',JSON.stringify(profile));
    createCartIfUserLogged();
  };
  
});