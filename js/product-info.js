CommentsArray = [];
ProductArray = [];
ProductsArray = [];
RelatedProductArray = [];
var CarId = 0;

const ORDER_DESC_BY_DATE = "Date";

function sortComments(criteria) {
    let result = [];
    if (criteria === ORDER_DESC_BY_DATE) {
        result = CommentsArray.sort(function (a, b) {
            if (a.dateTime < b.dateTime) { return -1; }
            if (a.dateTime > b.dateTime) { return 1; }
            return 0;
        });
    }
    return result;
}

function showProduct() {
    htmlContentToAppend = `
            <div class="row mt-3">
                <div class="col-12">
                    <h5>${ProductArray.description}</h5>
                </div>
                <br>                
            </div>     
        </a>
    `

    for (let i = 0; i < ProductArray['images'].length; i++) {
        document.getElementById("c" + i).src = ProductArray['images'][i];
    }

    document.getElementById("titulo").innerHTML = ProductArray.name;
    document.getElementById("product").innerHTML = htmlContentToAppend;

    $('#productButtons').append(`
        <div style="align-items:center;float:left" class="d-flex justify-content-around text-center col-12 pl-0 pr-0">
        <h5 class="mt-2"><b>${ProductArray.cost} ${ProductArray.currency}</b> - ${ProductArray.soldCount} Ya vendidos!</h5>
        <button id="addToCart" onclick="addToCart();" class=" cartButton btn btn-lg btn-dark btn-block">Agregar al <i class="fa fa-shopping-cart"></i> </button>
        </div>`
    );

    $('#productTech').append(`
        <tr class="text-center">
            <td>${ProductArray['tech']['model']}</td>
            <td>${ProductArray['tech']['cyl']}</td>
            <td>${ProductArray['tech']['accel']}</td>
            <td>${ProductArray['tech']['maxVel']}</td>
            <td>${ProductArray['tech']['capacity']}</td>
            <td>${ProductArray['tech']['power']}</td>
        </tr>
    `
    );

    showRelatedProducts()
}

function checkIfArticleExistsInCart() {
    let cart = JSON.parse(localStorage.getItem('Cart'));
    cart['Cars'].forEach(function (e) {
        if (e.id == CarId) {
            document.getElementById('addToCart').innerHTML = `En el <i class="fa fa-shopping-cart"></i>`;
            document.getElementById('addToCart').onclick = function() {window.location.href='cart.html'};
            $('#addToCart').removeClass('btn-dark').addClass('btn-primary');        
        }
    });
}

function showComments() {
    htmlContentToAppend = "";
    for (let i = 0; i < CommentsArray.length; i++) {
        let comment = CommentsArray[i];

        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-12">
                        <img src="${comment.profilePic ? comment.profilePic : './img/img_avatar4.png'}" class="profile-thumbnail">
                        <h7 class="ml-2"> <b>${comment.user}</b></h7>     <small class="text-muted ml-2 fas fa-clock"> ${comment.dateTime}</small>              
                    </div>
                    <div class="col-12">
                        <p class="ml-4 pl-5 col-12">${comment.description}</p>
                        <div class="ml-4 pl-5"> 
        `
        for (let i = 1; i <= comment.score; i++) {
            htmlContentToAppend += `<span class="fa fa-star checked"></span>`;
        };

        for (let i = comment.score + 1; i <= 5; i++) {
            htmlContentToAppend += `<span class="fa fa-star unchecked"></span>`;
        }

        htmlContentToAppend +=
            `
                        </div>
                    </div>
                </div>
        </div>
        `
        document.getElementById("comments-container").innerHTML = htmlContentToAppend;
    }
}

function limpiarCampos() {
    if (JSON.parse(localStorage.getItem('Profile')).name != "Invitado") {
        $('input[name=rating]').prop('checked', false)
    }
    document.getElementById('comentario').value = "";
}

function showCommentBox() {
    document.getElementById("comment-container").innerHTML = `
    <hr>
    <div style="padding-left: 20px;padding-right: 20px;">
        <div class="row">
          <h2>Cuéntanos tu experiencia!</h2>
              <textarea type="text" id="comentario" class="form-control" placeholder="Comentanos que te parece este vehículo..." required></textarea>
              <hr style="width: 95%;">
              <div class="col-12 d-flex justify-content-between align-items-center">
              <div id="rating">
                <fieldset class="rating" style="float:left">
                  <legend>!Puntua</legend>
                  <input type="radio" id="5" name="rating"/><label class="fa fa-star" for="5"></label><input type="radio" id="4" name="rating"/><label class="fa fa-star" for="4"></label><input type="radio" id="3" name="rating"/><label class="fa fa-star" for="3"></label><input type="radio" id="2" name="rating"/><label class="fa fa-star" for="2"></label><input type="radio" id="1" name="rating"/><label class="fa fa-star" for="1"></label>
                </fieldset>
              </div>
              <div><button class="btn btn-lg btn-dark btn-block" id="comentar">Comentar</button></div> 
        </div>
    </div>
    `
    document.getElementById("comment-container").style = "display:block";
}

function showRelatedProducts() {
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            ProductsArray = resultObj.data;
            ProductArray.relatedProducts.forEach(function (id) {
                document.getElementById("related-products").innerHTML += `
                <a href="product-info.html" class="related d-flex list-group-item justify-content-center list-group-item-action" onclick="setCarInLS(${ProductsArray[id].id})" 
                    style="background: url(${ProductsArray[id].imgSrc}) no-repeat center center;
                    background-size: cover;
                    -webkit-background-size: cover;
                    -moz-background-size: cover; 
                    -o-background-size: cover;">
                    <div class="w-100 h-100 relatedText">
                    <h4 class="mb-1 text-center">${ProductsArray[id].name}</h4>
                        <p class="text-center">${ProductsArray[id].cost}${ProductsArray[id].currency}</p>
                    </div>
                </a>
                `
            });
        }
    });
}

function setCarInLS(id) {
    localStorage.setItem("Auto", id);
}


function getCarID() {
    if (localStorage.getItem('Auto') != null) {
        CarId = localStorage.getItem('Auto');
    }
}

function addToCart() {

    let cart = JSON.parse(localStorage.getItem('Cart'));

    let a = {};
    a.id = CarId;
    a.count = 1;

    cart.Cars.push(a);

    localStorage.setItem('Cart', JSON.stringify(cart));

    checkIfArticleExistsInCart()
}

function showLogBox() {
    document.getElementById("comment-container").innerHTML = `
        <hr>
        <div style="padding-left: 20px;padding-right: 20px;" class="d-flex justify-content-center">
        <h4>Logueate para comentar sobre este artículo! <a href="/index.html">Click aquí</a></h4>
        </div>
    `
    document.getElementById("comment-container").style = "display:block";
}

document.addEventListener("DOMContentLoaded", function (e) {

    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            CommentsArray = resultObj.data;
            sortAndShowComments(ORDER_DESC_BY_DATE);
        }
    });

    getCarID();

    getJSONData(PRODUCT_INFO_URL + CarId + ".json").then(function (resultObj) {
        if (resultObj.status === "ok") {
            ProductArray = resultObj.data;
            showProduct();
            checkIfArticleExistsInCart()
            if (JSON.parse(localStorage.getItem('Profile')).name == null || JSON.parse(localStorage.getItem('Profile')).name == undefined || JSON.parse(localStorage.getItem('Profile')).name == "Invitado") {
                $('#addToCart').css({ 'display': 'none' });
            };
        };
    });

    function sortAndShowComments(sortCriteria) {
        CommentsArray = sortComments(sortCriteria);
        showComments();
    }

    if (JSON.parse(localStorage.getItem("Profile")).name != "Invitado") {
        showCommentBox();

        document.getElementById('comentar').addEventListener('click', function () {

            if (!document.getElementById('comentario').value) {
                alert("Debe llenar los campos para publicar el comentario");
                return false;
            }

            if (localStorage.getItem("Profile")) {
                let now = new Date()
                let dateTime = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;


                if (!$("#rating :radio:checked")[0]) {
                    alert("Debe puntuar");
                    return false;
                }

                var score = parseInt($("#rating :radio:checked")[0].id);

                if (score > 5) {
                    score = 5;
                }

                let newComment = {
                    user: JSON.parse(localStorage.getItem('Profile')).name,
                    score: score,
                    description: document.getElementById('comentario').value,
                    dateTime: dateTime,
                    profilePic: JSON.parse(localStorage.getItem('Profile')).profilePic
                }

                CommentsArray.push(newComment);
                showComments();
                limpiarCampos();

            } else {
                alert("Usted debe estar logueado para realizar tal acción.");
            }
        });
    } else {
        showLogBox();
    }

});