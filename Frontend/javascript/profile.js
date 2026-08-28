

const editProfileBtn = document.querySelector("#editProfileBtn");

const editModal = document.querySelector("#editModal");

const closeModal = document.querySelector("#closeModal");

const cancelBtn = document.querySelector("#cancelBtn");

const profileForm = document.querySelector("#profileForm");


const userName = document.querySelector("#userName");
const username = document.querySelector("#username");

const joined = document.querySelector(".joined");
const createdDate = document.querySelector("#createdDate");

const fullName = document.querySelector("#fullName");
const userUsername = document.querySelector("#userUsername");
const userEmail = document.querySelector("#userEmail");

const profileImage = document.querySelector("#profileImage");


const editName = document.querySelector("#editName");
const editUsername = document.querySelector("#editUsername");
const editEmail = document.querySelector("#editEmail");

let userData = null;


async function getProfile() {
    try {
        const responce = await axios.get("https://placement-preparation-tracker-ltlg.onrender.com/api/user/userDetails" , 
            {
                withCredentials: true
            }
        )

        userData = responce.data.user;
        console.log(userData);


        profile();
        
    } catch (error) {
        console.log(`error while fetching profile data ${error}`)
    }
    
}

async function logout() {
    try {
        const response = await axios.delete(
            "https://placement-preparation-tracker-ltlg.onrender.com/api/user/logout",
            {
                withCredentials: true
            }
        );

        console.log("Logout successful");

        return true;

    } catch (error) {
        console.log(`error while logout ${error}`);

        return false;
    }
}


/* Open Edit Modal */
function profile(){

    editProfileBtn.addEventListener("click", function(){

        editName.value = userName.textContent.trim();

        editUsername.value = username.textContent
            .replace("@", "")
            .trim();

        editEmail.value = userEmail.textContent.trim();

        editModal.classList.add("show");

    });

    const date = new Date(userData.createdAt);

    const monthYear = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    });

    console.log(monthYear);
   
    //insert user data
    userName.textContent = userData.name
    username.textContent = userData.username
    fullName.textContent = userData.name
    userUsername.textContent = userData.username
    userEmail.textContent = userData.email
    userName.textContent = userData.name
    joined.textContent = monthYear
    createdDate.textContent = monthYear

    profileImage.textContent =
        userData.name.charAt(0).toUpperCase();


    //logout function

    const logoutBtn = document.querySelector("#logoutBtn");

    const logoutPopup = document.querySelector("#logoutPopup");

    const cancelLogout = document.querySelector("#cancelLogout");

    const confirmLogout = document.querySelector("#confirmLogout");


    // Open popup

    logoutBtn.addEventListener("click", function(event) {

        event.preventDefault();

        logoutPopup.classList.add("show");

    });


    // Cancel

    cancelLogout.addEventListener("click", function() {

        logoutPopup.classList.remove("show");

    });


    // Confirm logout

  confirmLogout.addEventListener("click", async function() {

    const success = await logout();

    if (success) {
        window.location.href = "../index.html";
    }

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
    }

    getProfile()
