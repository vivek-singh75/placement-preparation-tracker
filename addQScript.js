let mainSec = document.querySelector("#mainSec");

let box = document.querySelectorAll(".box");
let ip = document.querySelector("input");
let form = document.querySelector("form")
let data = JSON.parse(localStorage.getItem("Questions"));
let Question = [];
if(data !== null){
    Question = data;
};



//let questionName = document
form.addEventListener("submit", function(dets){
    dets.preventDefault();
    let questionName = document.querySelector("#questionName").value;
    let typeofQ = document.querySelector("#typeofQ").value;
    let level = document.querySelector("#level").value;
    let Plateform = document.querySelector("#Plateform").value;
    let Status = document.querySelector("#Status").value;

  // console.log(Status , questionName,typeofQ,Plateform  );

    let added = {
        questionName : questionName,
        typeofQ :  typeofQ,
        level : level,
        Plateform  : Plateform,
        Status   : Status
    };
    
    
    Question.push(added);
    console.log(added);


   
    localStorage.setItem("Questions" ,JSON.stringify(Question));



});







//let questionName = document.