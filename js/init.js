
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

/*
const CATEGORIES_URL = "http://localhost:3000/categories/all";
const CATEGORY_INFO_URL = "http://localhost:3000/categories/1";
const PRODUCTS_URL = "http://localhost:3000/products/cars/all";
const PRODUCT_INFO_COMMENTS_URL = "http://localhost:3000/comments/cars/all";
const COUNTRIES = "http://localhost:3000/countries/all";
const PROFILES = "http://localhost:3000/profiles/all";
const COUNTRY = "https://restcountries.eu/rest/v2/name/";
const PRODUCT_INFO_URL = "https://diegoperalta95.github.io/ecommerce-api/products/cars/";
const PUBLISH_PRODUCT_URL = "http://localhost:3000/products/publish";
const CART_INFO_URL = "http://localhost:3000/cart/info";
const CART_BUY_URL = "http://localhost:3000/cart/buy.json";
*/

const CART_CONFIRM_ORDER = "http://localhost:3000/guardar-carrito";

var showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function (url) {
  var result = {};
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      return result;
    });
}

var postJSONData = function (url, obj) {
  var result = {};
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(obj)
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      return result;
    });
}

function createCart(empty = false) {
  if (JSON.parse(localStorage.getItem('Cart') == null) || empty) {
    let a = {};
    a['Cars'] = [];
    localStorage.setItem('Cart', JSON.stringify(a));
  }
}

function checkLoggedUser() {
  if (JSON.parse(localStorage.getItem('Profile')).name == "Invitado") {
    window.location.href = "index.html";
  }
}

document.addEventListener("DOMContentLoaded", function (e) {

  $(window).scroll(function () {
    if ($(this).scrollTop()) {
      $('#top').fadeIn();
    } else {
      $('#top').fadeOut();
    }
  });

  $('#top').on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, '300');
  });

  if (JSON.parse(localStorage.getItem('Profile')) == null || JSON.parse(localStorage.getItem('Profile')) == undefined) {
    let profile = {};
    profile.name = "Invitado";
    profile.surname = "";
    profile.date = "";
    profile.email = "";
    profile.phoneNumber = "";
    profile.profilePic = "./img/img_avatar4.png";
    localStorage.setItem('Profile', JSON.stringify(profile));
    createCart();
  };

});