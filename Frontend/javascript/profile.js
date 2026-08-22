const editProfileBtn = document.querySelector("#editProfileBtn");

const editModal = document.querySelector("#editModal");

const closeModal = document.querySelector("#closeModal");

const cancelBtn = document.querySelector("#cancelBtn");

const profileForm = document.querySelector("#profileForm");


const userName = document.querySelector("#userName");
const username = document.querySelector("#username");

const fullName = document.querySelector("#fullName");
const userUsername = document.querySelector("#userUsername");
const userEmail = document.querySelector("#userEmail");


const editName = document.querySelector("#editName");
const editUsername = document.querySelector("#editUsername");
const editEmail = document.querySelector("#editEmail");



/* Open Edit Modal */

editProfileBtn.addEventListener("click", function(){

    editName.value = userName.textContent.trim();

    editUsername.value = username.textContent
        .replace("@", "")
        .trim();

    editEmail.value = userEmail.textContent.trim();

    editModal.classList.add("show");

});



/* Close Modal */

closeModal.addEventListener("click", function(){

    editModal.classList.remove("show");

});


cancelBtn.addEventListener("click", function(){

    editModal.classList.remove("show");

});



/* Save Profile */

profileForm.addEventListener("submit", function(event){

    event.preventDefault();

    const name = editName.value.trim();

    const usernameValue = editUsername.value.trim();

    const email = editEmail.value.trim();


    userName.textContent = name;

    username.textContent = "@" + usernameValue;

    fullName.textContent = name;

    userUsername.textContent = "@" + usernameValue;

    userEmail.textContent = email;


    editModal.classList.remove("show");

});



/* Close modal when clicking outside */

editModal.addEventListener("click", function(event){

    if(event.target === editModal){

        editModal.classList.remove("show");

    }

});