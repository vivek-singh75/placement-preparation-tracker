

    let Gdata =JSON.parse(localStorage.getItem("Questions"));


//for update data on dashboard 
let arrayCountElement = document.querySelector("#arrayCount");
let arrayCount = 0;

let StringCountElement = document.querySelector("#stringCount");
let stringCount = 0;

let recursionCountElement = document.querySelector("#recursionCount");
let recursionCount = 0;

let treeCountElement = document.querySelector("#treeCount");
let treeCount = 0;

let graphCountElement = document.querySelector("#graphCount");
let graphCount = 0;

let hashMapCountElement = document.querySelector("#hashmapCount");
let hashMapCount = 0;
if(Gdata !==null){
    let len = Gdata.length;
    for(let i=0; i<len; i++){
    let typeOf = Gdata[i].typeofQ;
    if(typeOf ==="Array"){
        arrayCount++;
    }else if(typeOf==="String"){
        stringCount++;
    }else if(typeOf==="Recursion"){
        recursionCount++;
    }else if(typeOf==="Tree"){
        treeCount++;
    }else if(typeOf==="Graph"){
        graphCount++;
    }else if(typeOf==="HashMap"){
        hashMapCount++;
    }
    console.log(name);
}arrayCountElement.textContent = arrayCount;

StringCountElement.textContent = stringCount;
recursionCountElement.textContent = recursionCount;
treeCountElement.textContent = treeCount;
graphCountElement.textContent = graphCount;
hashMapCountElement.textContent = hashMapCount;
}


 


 //[0].questionName