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
            <div class="row">
                <div class="col-12">
                    <h3 class="text-center"> <b> ${ProductArray.name}  </b></h3> 
                    <hr style="width: 30%;">
                </div>
                <div class="container my-4">
                    <div id="carousel-thumb" class="carousel slide carousel-fade carousel-thumbnails" data-ride="carousel">
                    <!--Slides-->
                    <div class="carousel-inner" role="listbox">
                        <div class="carousel-item active">
                        <img class="d-block w-100" src="${ProductArray['images'][0]}" alt="First slide">
                        </div>
                        <div class="carousel-item">
                        <img class="d-block w-100" src="${ProductArray['images'][1]}" alt="Second slide">
                        </div>
                        <div class="carousel-item">
                        <img class="d-block w-100" src="${ProductArray['images'][2]}" alt="Third slide">
                        </div>
                    </div>
                    <a class="carousel-control-prev" href="#carousel-thumb" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#carousel-thumb" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                    <ol class="carousel-indicators">
                        <li data-target="#carousel-thumb" data-slide-to="0" class="active"> <img class="d-block w-100" src="${ProductArray['images'][0]}"
                            class="img-fluid"></li>
                        <li data-target="#carousel-thumb" data-slide-to="1"><img class="d-block w-100" src="${ProductArray['images'][1]}"
                            class="img-fluid"></li>
                        <li data-target="#carousel-thumb" data-slide-to="2"><img class="d-block w-100" src="${ProductArray['images'][2]}"
                            class="img-fluid"></li>
                    </ol>
                    </div>
                </div>
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
    document.getElementById("product").innerHTML = htmlContentToAppend;
}


function showComments(){htmlContentToAppend = "";
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
    document.getElementById("comments-container").innerHTML = htmlContentToAppend;}
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

function showCommentBox(){
    document.getElementById("comment-container").innerHTML = `
    <div class="list-group-item ">
          <div class="row">
              <h2>Cuéntanos tu experiencia!</h2>
              <textarea type="text" id="comentario" class="form-control" placeholder="Comentanos que te parece este vehículo..." required autofocus></textarea>
              <hr style="width: 95%;">
              <div class="col-12 justify-content-around align-items-center">
                <fieldset style="float:left">
                  <legend>Puntua!</legend>
                  <span class="fa fa-star unchecked" id="1"></span>
                  <span class="fa fa-star unchecked" id="2"></span>
                  <span class="fa fa-star unchecked" id="3"></span>
                  <span class="fa fa-star unchecked" id="4"></span>
                  <span class="fa fa-star unchecked" id="5"></span>
                </fieldset>
              <div style="float:right" class="align-items-center"><button class="btn btn-lg btn-primary btn-block" id="comentar">Comentar</button></div> 
              </div>
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

    //visualización del sistema de puntuación
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
    
    //mandar comentario y chequear que esté logueado.
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
            
            CommentsArray.push(newComment);
            showComments();
            limpiarCampos();
    
        }else{
            alert("Usted debe estar logueado para realizar tal acción.");
        }
        
    });
    
});