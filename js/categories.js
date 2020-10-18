const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_DESC_BY_PROD_COUNT = "DescCant.";
const ORDER_ASC_BY_PROD_COUNT = "AscCant."
var currentCategoriesArray = [];
var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;
var wordFilter = undefined;

function sortCategories(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME)
    {
        result = array.sort(function(a, b) {
            if ( a.name < b.name ){ return -1; }
            if ( a.name > b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_NAME){
        result = array.sort(function(a, b) {
            if ( a.name > b.name ){ return -1; }
            if ( a.name < b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_PROD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_ASC_BY_PROD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            if ( aCount < bCount ){ return -1; }
            if ( aCount > bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}

function showCategoriesList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentCategoriesArray.length; i++){
        let category = currentCategoriesArray[i];

        let name = category.name.toUpperCase();
        let desc = category.description.toUpperCase();
        
        if (wordFilter != undefined){
            wordFilter = wordFilter.toUpperCase();
        }

        if( (wordFilter == undefined) || (name.includes(wordFilter)) || (desc.includes(wordFilter))){

            if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
                ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))){

                htmlContentToAppend += `
                <a href="category-info.html" class="list-group-item list-group-item-action">
                    <div class="row">
                        <div class="col-3">
                            <img src="` + category.imgSrc + `" alt="` + category.description + `" class="img-thumbnail">
                        </div>
                        <div class="col">
                            <div class="d-flex w-100 justify-content-between">
                                <h4 class="mb-1">`+ category.name +`</h4>
                                <small class="text-muted">` + category.productCount + ` artículos</small>
                            </div>
                            <p class="mb-1">` + category.description + `</p>
                        </div>
                    </div>
                </a>
                `
            }
        }
        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowCategories(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined){
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    showCategoriesList();
}

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(CATEGORIES_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortDescByCount").addEventListener("click", function(){
        sortAndShowCategories(ORDER_DESC_BY_PROD_COUNT);
    });

    document.getElementById("sortAscByCount").addEventListener("click", function(){
        sortAndShowCategories(ORDER_ASC_BY_PROD_COUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        $('#clearRangeFilter').css({'display':'none'});

        showCategoriesList();
    });

    document.getElementById("searchBar").addEventListener("keyup", function(){
        wordFilter = document.getElementById("searchBar").value;

        showCategoriesList();
    });


    $('#rangeFilterCountMin, #rangeFilterCountMax').on('keyup',function(e){
        minCount = document.getElementById("rangeFilterCountMin").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
            $('#clearRangeFilter').css({'display':'block'});
        }
        else{
            minCount = undefined;
        }

        maxCount = document.getElementById("rangeFilterCountMax").value;
        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
            $('#clearRangeFilter').css({'display':'block'});
        }
        else{
            maxCount = undefined;
        }

        if(maxCount == undefined && minCount == undefined){
            $('#clearRangeFilter').css({'display':'none'});
        }

        showCategoriesList();
    });

});