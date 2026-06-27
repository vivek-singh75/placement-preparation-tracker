

let Gdata =JSON.parse(localStorage.getItem("Questions"));

//for update data on dashboard 
//for type of questiion
function typeOfQuestion(){
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
//for level update
let easyLevelElement = document.querySelector("#easyTableCount");
let easyCount = 0;

let mediumLevelElement = document.querySelector("#mediumTableCount");
let mediumCount = 0;

let hardLevelElement = document.querySelector("#hardTableCount");
let hardCount = 0;

//total +level
let easyCountState = document.querySelector("#easyCount");
let mediumCountState = document.querySelector("#mediumCount");
let hardCountState = document.querySelector("#hardCount");

let totalSolved = document.querySelector("#totalSolved");
if(Gdata !==null){
    let len = Gdata.length;
    //for type of questiion
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

    }
    for(let j=0; j<len; j++){
        let Level = Gdata[j].level;
   
        if(Level=== "Easy"){
            easyCount++;
        }else if(Level==="Medium"){
            mediumCount++;
        }else if(Level==="Hard"){
            hardCount++;
        }
    }
    
//for type of questiion
    arrayCountElement.textContent = arrayCount;
    StringCountElement.textContent = stringCount;
    recursionCountElement.textContent = recursionCount;
    treeCountElement.textContent = treeCount;
    graphCountElement.textContent = graphCount;
    hashMapCountElement.textContent = hashMapCount;

    
    // easyLevelElement.textContent = easyCount;
    // mediumLevelElement.textContent = mediumCount;
    // hardLevelElement.textContent = hardCount;

    easyCountState.textContent = easyCount;
    mediumCountState.textContent = mediumCount;
    hardCountState.textContent = hardCount;
    //for total count

    let TotalSolved =  (easyCount+mediumCount+hardCount);
    totalSolved.textContent = TotalSolved;
}
};

typeOfQuestion();

 


 //[0].questionName

 //for navbar(menu button)
    function menuButton(){
        const menuBtn = document.querySelector("#menuBtn");
    const navLinks = document.querySelector(".navLinks");

    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        navLinks.computedStyleMap.display = "block";
        
    });
};

menuButton();

//for recent activity
let recent= ()=>{
    recentActivityContainer.innerHTML = "";

    Gdata.slice(-5).reverse().forEach((item) => {
        const h4 = document.createElement("h4");
        h4.classList.add("recentQ");
        h4.textContent = item.typeofQ;
        recentActivityContainer.append(h4);
    });
    
}
recent()