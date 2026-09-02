// =====================================================
// GET FORM
// =====================================================

const form = document.querySelector(".box");


// =====================================================
// GET EXISTING QUESTIONS FROM LOCAL STORAGE
// =====================================================

let Question = [];

// try {
    
//     const data = JSON.parse(
//         localStorage.getItem("Questions")
//     );

//     if (Array.isArray(data)) {
//         Question = data;
//     }

// } catch (error) {

//     console.log(
//         "Error reading Questions from Local Storage:",
//         error
//     );

//     Question = [];

// }


// =====================================================
// FORM SUBMIT
// =====================================================

form.addEventListener("submit", async function (event) {

    event.preventDefault();

   

    // =================================================
    // GET VALUES FROM FORM
    // =================================================

    const questionName =
        document.querySelector("#questionName").value.trim();

    const typeofQ =
        document.querySelector("#typeofQ").value;

    const level =
        document.querySelector("#level").value;

    const Plateform =
        document.querySelector("#Plateform").value;

    const Status =
        document.querySelector("#Status").value;

    // =================================================
    // VALIDATION
    // =================================================

    if (questionName === "") {

        alert("Please enter question name.");
        return;
    }


    if (typeofQ === "") {

        alert("Please select question type.");
        return;
    }


    if (level === "") {

        alert("Please select difficulty level.");
        return;
    }


    if (Plateform === "") {

        alert("Please select platform.");

        return;
    }

    await showLoader();        //loader added here
    // =================================================
    // CREATE QUESTION OBJECT
    // =================================================

    const added = {

        questionName: questionName,

        topic: typeofQ,

        Difficulty_Level: level,

        Platform: Plateform,

        Solved_Status: Status

    };
    console.log(added.questionName)

    // =================================================
    // ADD OBJECT TO ARRAY
    // =================================================
    try {
        const responce  =await axios.post("https://placement-preparation-tracker-ltlg.onrender.com/api/question/addQuestion" , added ,
        { withCredentials: true });
        console.log("data send to backend")
    } catch (error) {
        console.log(`error while sending data to backend ${error}`)
    }



    // =================================================
    // SAVE ARRAY TO LOCAL STORAGE
    // =================================================

    // localStorage.setItem(
    //     "Questions",
    //     JSON.stringify(Question)
    // );


    // =================================================
    // CHECK DATA
    // =================================================

    console.log("New Question:");
    console.log(added);

    console.log("All Questions:");
    console.log(Question);


    // =================================================
    // RESET FORM
    // =================================================

    hideLoader();    //remove loader

    form.reset();


    // =================================================
    // SUCCESS MESSAGE
    // =================================================

    alert("Question added successfully!");

});