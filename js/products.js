const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_DESC_BY_PROD_COST = "DescPrecio";
const ORDER_ASC_BY_PROD_COST = "AscPrecio";
const ORDER_DESC_BY_REL = "DescRel";
var currentProductsArray = [];
var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;
var wordFilter = undefined;
var type = "list";

function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME) {
        result = array.sort(function (a, b) {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_NAME) {
        result = array.sort(function (a, b) {
            if (a.name > b.name) { return -1; }
            if (a.name < b.name) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_PROD_COST) {
        result = array.sort(function (a, b) {
            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            if (aCost > bCost) { return -1; }
            if (aCost < bCost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_ASC_BY_PROD_COST) {
        result = array.sort(function (a, b) {
            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            if (aCost < bCost) { return -1; }
            if (aCost > bCost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_REL) {
        result = array.sort(function (a, b) {
            let aSold = parseInt(a.soldCount);
            let bSold = parseInt(b.soldCount);

            if (aSold > bSold) { return -1; }
            if (aSold < bSold) { return 1; }
            return 0;
        });
    }

    return result;
}

function showProductsList() {

    let htmlContentToAppend = "";
    for (let i = 0; i < currentProductsArray.length; i++) {
        let product = currentProductsArray[i];

        let name = product.name.toUpperCase();
        let desc = product.description.toUpperCase();

        if ((wordFilter == undefined) || (name.includes(wordFilter)) || (desc.includes(wordFilter))) {

            if (((minCount == undefined) || (minCount != undefined && parseInt(product.cost) >= minCount)) &&
                ((maxCount == undefined) || (maxCount != undefined && parseInt(product.cost) <= maxCount))) {

                if(type == "list"){
                    $('#cat-list-container').addClass('cat-list-container');
                    htmlContentToAppend += `
                    <a href="product-info.html" onclick="setCarInLS(${product.id})">
                        <div class="row">
                            <div class="col-3">
                                <img src="${product.imgSrc}" alt="${product.description}" class="img-thumbnail">
                            </div>
                            <div class="col">
                                <div class="d-flex w-100 justify-content-between">
                                    <h4 class="mb-1">${product.name}</h4>
                                    <small>${product.soldCount} Vendidos</small>
                                </div>
                                <p class="mb-1">${product.description}</p>
                                <br>
                                <p> <b>Precio:  </b><span class="numberFormat">${product.cost}</span> ${product.currency}</p>
                            </div>
                        </div>
                    </a>
                    `
                }else if(type == "grid"){
                    $('#cat-list-container').removeClass('cat-list-container');
                    htmlContentToAppend += `
                    <a href="product-info.html" class="cCard" onclick="setCarInLS(${product.id})">
                        <div class="cCard-image" style="background:url('${product.imgSrc}')"></div>
                        <div class="cCard-text">
                            <h5>${product.name}</h5>
                            <p class="small">${product.description.length > 100 ? (product.description.slice(0, 100) + '...') : product.description}</p>
                        </div>
                        <div class="cCard-stats">
                            <div class="stat">
                            <div class="value">${product.cost} USD</div>
                            </div>
                            <div class="stat">
                            <div class="value">${product.soldCount} Vendidos</div>
                            </div>
                        </div>
                    </a>
                    `
                }       
            }
        }
        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

function setCarInLS(id) {
    localStorage.setItem("Auto", id);
}

function sortAndShowProducts(sortCriteria, productsArray) {
    currentSortCriteria = sortCriteria;

    if (productsArray != undefined) {
        currentProductsArray = productsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    showProductsList();
}

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            sortAndShowProducts(ORDER_ASC_BY_NAME, resultObj.data);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortByCostDesc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_DESC_BY_PROD_COST);
    });

    document.getElementById("sortByCostAsc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_ASC_BY_PROD_COST);
    });

    document.getElementById("sortRel").addEventListener("click", function () {
        sortAndShowProducts(ORDER_DESC_BY_REL);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        $('#clearRangeFilter').css({ 'display': 'none' });

        showProductsList();
    });
    document.getElementById("searchBar").addEventListener("input", function () {
        wordFilter = document.getElementById("searchBar").value.toUpperCase();

        showProductsList();
    });

    $('#sortGrid').on('click',function(e){
        type = "grid";
        showProductsList();
    });

    $('#sortList').on('click',function(e){
        type = "list";
        showProductsList();
    });

    $('#rangeFilterCountMin, #rangeFilterCountMax').on('keyup', function (e) {
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
            minCount = parseInt(minCount);
            $('#clearRangeFilter').css({ 'display': 'block' });
        }
        else {
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
            maxCount = parseInt(maxCount);
            $('#clearRangeFilter').css({ 'display': 'block' });
        }
        else {
            maxCount = undefined;
        }

        if (maxCount == undefined && minCount == undefined) {
            $('#clearRangeFilter').css({ 'display': 'none' });
        }

        showProductsList();
    });

});


