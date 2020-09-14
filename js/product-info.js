CommentsArray = [];
ProductArray = [];
const ORDER_DESC_BY_DATE = "Date";

function sortComments(criteria){
    let result = [];
    if (criteria === ORDER_DESC_BY_DATE){
        result = CommentsArray.sort(function(a, b) {
            if ( a.dateTime < b.dateTime ){ return -1; }
            if ( a.dateTime > b.dateTime ){ return 1; }
            return 0;
        });
    }
    return result;
}

function showProduct(){
    htmlContentToAppend = `
            <div class="row mt-3">
                <hr style="width: 95%;">
                <div class="col-12">
                    <h5>${ProductArray.description}</h5>
                </div>
                <hr style="width: 95%;">
                <div style="align-items:center" class="d-flex justify-content-center flex-column text-center col-12 ">
                    <h5>Precio: <b>${ProductArray.cost} ${ProductArray.currency}</b></h5>
                    <h5>${ProductArray.soldCount} Ya vendidos! </h5>
                    <div><button class="btn btn-lg btn-primary btn-block">Comprar</button></div>
                </div>
                </div>
                <hr style="width: 95%;">
                <br>                
            </div>     
        </a>
    `
    document.getElementById("c1").src = ProductArray['images'][0];
    document.getElementById("c2").src = ProductArray['images'][1];
    document.getElementById("c3").src = ProductArray['images'][2];
    document.getElementById("titulo").innerHTML = ProductArray.name;
    document.getElementById("product").innerHTML = htmlContentToAppend;
}

function showComments(){
    htmlContentToAppend = "";
    for(let i = 0; i < CommentsArray.length; i++){
        let comment = CommentsArray[i];

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
        };

        for (let i = comment.score + 1; i <= 5 ;i++){
            htmlContentToAppend += `<span class="fa fa-star unchecked"></span>`;
        }

        htmlContentToAppend += 
        `
                        </div>
                    </div>
                </div>
        </div>
        `
    document.getElementById("comments-container").innerHTML = htmlContentToAppend;}
}

function limpiarCampos(){
    if(localStorage.getItem('Name')){
        $('input[name=rating]').prop('checked',false)
    }
    document.getElementById('comentario').value = ""; 
}

function showCommentBox(){
    document.getElementById("comment-container").innerHTML = `
    <div class="list-group-item ">
          <div class="row">
          <h2>Cuéntanos tu experiencia!</h2>
              <textarea type="text" id="comentario" class="form-control" placeholder="Comentanos que te parece este vehículo..." required autofocus></textarea>
              <hr style="width: 95%;">
              <div class="col-12 d-flex justify-content-between align-items-center">
              <div id="rating">
                <fieldset class="rating" style="float:left">
                  <legend>!Puntua</legend>
                  <input type="radio" id="5" name="rating"/><label class="fa fa-star" for="5"></label><input type="radio" id="4" name="rating"/><label class="fa fa-star" for="4"></label><input type="radio" id="3" name="rating"/><label class="fa fa-star" for="3"></label><input type="radio" id="2" name="rating"/><label class="fa fa-star" for="2"></label><input type="radio" id="1" name="rating"/><label class="fa fa-star" for="1"></label>
                </fieldset>
              </div>
              <div><button class="btn btn-lg btn-primary btn-block" id="comentar">Comentar</button></div> 
            </div>
        </div>
    `
    document.getElementById("comment-container").style="display:block";
}

document.addEventListener("DOMContentLoaded", function(e){

    if(localStorage.getItem("Name")){
        showCommentBox(); 
    };

    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            CommentsArray = resultObj.data;
            sortAndShowComments(ORDER_DESC_BY_DATE);
        }
    });

    getJSONData(PRODUCT_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            ProductArray = resultObj.data;
            showProduct();
        }
    });

    function sortAndShowComments(sortCriteria){
        CommentsArray = sortComments(sortCriteria);
        showComments();
    }

    document.getElementById('comentar').addEventListener('click', function(){
        
        if(!document.getElementById('comentario').value){
            alert("Debe llenar los campos para publicar el comentario");
            return false;
        }
        
        if(localStorage.getItem("Name")){
            let now = new Date()
            let dateTime = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;


            if(!$("#rating :radio:checked")[0]){
                alert("Debe puntuar");
                return false;
            }
    
            var score = parseInt($("#rating :radio:checked")[0].id);

            if(score > 5){
                score = 5;
            }
            
            let newComment = {
                user: localStorage.getItem('Name'),
                score: score,
                description: document.getElementById('comentario').value,
                dateTime: dateTime
            }
            
            CommentsArray.push(newComment);
            showComments();
            limpiarCampos();
    
        }else{
            alert("Usted debe estar logueado para realizar tal acción.");
        }
        
        
    });
    
});