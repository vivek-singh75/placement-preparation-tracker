// =====================================================
// GET FORM
// =====================================================

const form = document.querySelector(".box");


// =====================================================
// GET EXISTING QUESTIONS FROM LOCAL STORAGE
// =====================================================

let Question = [];

try {

    const data = JSON.parse(
        localStorage.getItem("Questions")
    );

    if (Array.isArray(data)) {
        Question = data;
    }

} catch (error) {

    console.log(
        "Error reading Questions from Local Storage:",
        error
    );

    Question = [];

}


// =====================================================
// FORM SUBMIT
// =====================================================

form.addEventListener("submit", function (event) {

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


    // =================================================
    // CREATE QUESTION OBJECT
    // =================================================

    const added = {

        questionName: questionName,

        typeofQ: typeofQ,

        level: level,

        Plateform: Plateform,

        Status: Status

    };


    // =================================================
    // ADD OBJECT TO ARRAY
    // =================================================

    Question.push(added);


    // =================================================
    // SAVE ARRAY TO LOCAL STORAGE
    // =================================================

    localStorage.setItem(
        "Questions",
        JSON.stringify(Question)
    );


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

    form.reset();


    // =================================================
    // SUCCESS MESSAGE
    // =================================================

    alert("Question added successfully!");

});