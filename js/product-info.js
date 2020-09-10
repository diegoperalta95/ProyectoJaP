currentCommentsArray = [];
currentProductArray = [];
ORDER_DESC_BY_DATE = "date";

function sortComments(criteria){
    let result = [];
    if (criteria === ORDER_DESC_BY_DATE){
        result = currentCommentsArray.sort(function(a, b) {
            if ( a.dateTime < b.dateTime ){ return -1; }
            if ( a.dateTime > b.dateTime ){ return 1; }
            return 0;
        });
    }
    return result;
}

function showProduct(){
    htmlContentToAppend = `
    
            <div class="row">
                <div class="col-12">
                    <h3 class="text-center"> <b> ${currentProductArray.name}  </b></h3> 
                    <hr style="width: 30%;">
                </div>    
                <img class="col-3" src="${currentProductArray['images'][0]}"></img>
                <img class="col-3" src="${currentProductArray['images'][1]}"></img>
                <img class="col-3" src="${currentProductArray['images'][2]}"></img>
                <img class="col-3" src="${currentProductArray['images'][3]}"></img>
                <hr style="width: 95%;">
                <div class="col-12">
                    <h5>${currentProductArray.description}</h5>
                </div>
                <hr style="width: 95%;">
                <div style="align-items:center" class="d-flex justify-content-center flex-column text-center col-12 ">
                    <h5>Precio: <b>${currentProductArray.cost} ${currentProductArray.currency}</b></h5>
                    <h5>${currentProductArray.soldCount} Ya vendidos! </h5>
                    <div><button class="btn btn-lg btn-primary btn-block">Comprar</button></div>
                </div>
                <hr style="width: 95%;">
                <h4>Comentarios</h4>
                <br>
                <div class="col-12" id="comentarios-container">
                </div>
                
            </div>
            
        </a>
    `

    document.getElementById("product-list").innerHTML = htmlContentToAppend;

    htmlContentToAppend = "";

    for(let i = 0; i < currentCommentsArray.length; i++){
        let comment = currentCommentsArray[i];

        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-12">
                        <img src=${comment.user.includes("maria") || comment.user.includes("paola") ? "./img/img_avatar2.png" : "./img/img_avatar.png"} class="profile-thumnail">
                        <h7 class="ml-2"> <b>${comment.user}</b></h7>     <small class="text-muted ml-2 fas fa-clock"> ${comment.dateTime}</small>              
                    </div>
                    <div class="col-12">
                        <p class="ml-4 pl-5 col-12">${comment.description}</p>
                        <div class="ml-4 pl-5"> 
        `
        for (let i = 1; i <= comment.score ;i++){
            htmlContentToAppend += `<span class="fa fa-star checked"></span>`;
        }

        for (let i = comment.score +1; i <= 5 ;i++){
            htmlContentToAppend += `<span class="fa fa-star"></span>`;
        }


        htmlContentToAppend += 
        `
                        </div>
                    </div>
                </div>
        </div>
        `
        
        
        document.getElementById("comentarios-container").innerHTML = htmlContentToAppend;

    }
}

function limpiarCampos(){
    if(localStorage.getItem('Name')){
        for (i=1;i<=5;i++){
            document.getElementById(i).classList.remove('checked'); 
            document.getElementById(i).classList.add('unchecked'); 
        }
    }
    document.getElementById('comentario').value = ""; 
}

document.addEventListener("DOMContentLoaded", function(e){

    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentCommentsArray = resultObj.data;
        }
    });

    getJSONData(PRODUCT_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentProductArray = resultObj.data;
            sortAndShowProduct(ORDER_DESC_BY_DATE);
        }
    });



    function sortAndShowProduct(sortCriteria){
        currentSortCriteria = sortCriteria;
        currentCommentsArray = sortComments(currentSortCriteria);
        showProduct();
    }



    if(localStorage.getItem("Name")){
        document.getElementById("comment-container").style="display:inline";
    };



    var list=['1','2','3','4','5'];
    list.forEach(function(element) {
        document.getElementById(element).addEventListener('click', function(){

        var id = document.getElementById(element).id;
        var cls = document.getElementById(element).className;

        if(cls.includes('unchecked')){

            document.getElementById(element).classList.remove('unchecked');
            document.getElementById(element).classList.add('checked');

            for (i = 1;i<=id;i++){
                document.getElementById(i).classList.remove('unchecked');
                document.getElementById(i).classList.add('checked');
            }
        }else{

            document.getElementById(element).classList.remove('checked'); 
            document.getElementById(element).classList.add('unchecked');

            for (i = 5;i>=id;i--){
                document.getElementById(i).classList.remove('checked');
                document.getElementById(i).classList.add('unchecked');
            }
        }
        });
    });
    

    document.getElementById('comentar').addEventListener('click', function(){

        if(localStorage.getItem("Name")){
            let now = new Date()
            let dateTime = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    
            var score = document.getElementById('comment-container').getElementsByClassName('checked').length;
            if(score == 0){
                score = 1;
            }else if(score > 5){
                score = 5;
            }
            
            let newComment = {
                user: localStorage.getItem('Name'),
                score: score,
                description: document.getElementById('comentario').value,
                dateTime: dateTime
            }
            
            currentCommentsArray.push(newComment);
            showProduct();
            limpiarCampos();
    
        }else{
            alert("Usted debe estar logueado para realizar tal acción.");
        }
        
    });
    
});