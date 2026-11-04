
const API_URL = "http://localhost:3000";

// API Endpoints
const PROFILE_API = `${API_URL}/api/user/userDetails`;
const UPDATE_PROFILE_API = `${API_URL}/api/user/updateData`;
const LOGOUT_API = `${API_URL}/api/user/logout`;

const AVAILABLE_TECHNOLOGIES = [
    "MERN",
    "Data Science",
    "AI/ML",
    "Spring Boot",
    "Cyber Security",
    "App Development"
];

const TECHNOLOGY_ICONS = {
    "MERN": "M",
    "Data Science": "DS",
    "AI/ML": "AI",
    "Spring Boot": "SB",
    "Cyber Security": "CS",
    "App Development": "AD"
};


// ================= DOM ELEMENTS =================

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

const technologyOptions = document.querySelector("#technologyOptions");
const selectedTechCount = document.querySelector("#selectedTechCount");

const skillsContainer = document.querySelector("#skillsContainer");

const logoutBtn = document.querySelector("#logoutBtn");
const logoutPopup = document.querySelector("#logoutPopup");
const cancelLogout = document.querySelector("#cancelLogout");
const confirmLogout = document.querySelector("#confirmLogout");

const profileMessage = document.querySelector("#profileMessage");


// ================= GLOBAL VARIABLES =================

let userData = null;
let selectedTechnologies = [];


// ================= FETCH PROFILE =================

async function getProfile() {

    try {

        userName.textContent = "Loading...";

        const response = await axios.get(
            PROFILE_API,
            {
                withCredentials: true
            }
        );

        if (!response.data?.user) {
            throw new Error("User data not found");
        }

        userData = response.data.user;

        selectedTechnologies = normalizeTechnologies(
            userData.technologies
        );

        renderProfile();

    } catch (error) {

        console.error("Error while fetching profile:", error);

        userName.textContent = "Unable to load profile";
        username.textContent = "";
        fullName.textContent = "—";
        userUsername.textContent = "—";
        userEmail.textContent = "—";
        createdDate.textContent = "—";
        joined.textContent = "";
        profileImage.textContent = "?";

    }
}


// ================= NORMALIZE TECHNOLOGIES =================

function normalizeTechnologies(technologies) {

    if (!Array.isArray(technologies)) {
        return [];
    }

    return [...new Set(
        technologies
            .map(technology => String(technology).trim())
            .filter(technology =>
                AVAILABLE_TECHNOLOGIES.includes(technology)
            )
    )];

}


// ================= RENDER PROFILE =================

function renderProfile() {

    if (!userData) return;

    const name = userData.name || "User";
    const user = userData.username || "user";
    const email = userData.email || "—";

    userName.textContent = name;
    username.textContent = `@${user}`;

    fullName.textContent = name;
    userUsername.textContent = `@${user}`;
    userEmail.textContent = email;

    // Account creation date

    if (userData.createdAt) {

        const date = new Date(userData.createdAt);

        if (!Number.isNaN(date.getTime())) {

            const monthYear = date.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric"
            });

            joined.textContent = `Joined ${monthYear}`;
            createdDate.textContent = monthYear;

        } else {

            joined.textContent = "";
            createdDate.textContent = "—";

        }

    } else {

        joined.textContent = "";
        createdDate.textContent = "—";

    }

    // Profile Avatar

    profileImage.textContent = name.charAt(0).toUpperCase();

    // Render Skills

    renderSkills();

}


// ================= RENDER MY SKILLS =================

function renderSkills() {

    skillsContainer.innerHTML = "";

    const technologies = [
        {
            name: "DSA",
            status: "Always Included"
        },
        ...selectedTechnologies.map(technology => ({
            name: technology,
            status: "Selected"
        }))
    ];

    technologies.forEach(technology => {

        const skill = document.createElement("div");
        skill.className = "skill";

        const skillTop = document.createElement("div");
        skillTop.className = "skillTop";

        const name = document.createElement("span");
        name.textContent = technology.name;

        const status = document.createElement("span");
        status.className = "skill-status";
        status.textContent = technology.status;

        skillTop.append(name, status);
        skill.appendChild(skillTop);

        skillsContainer.appendChild(skill);

    });

}


// ================= OPEN EDIT MODAL =================

function openEditModal() {

    if (!userData) return;

    editName.value = userData.name || "";

    renderTechnologyOptions();

    updateSelectedTechCount();

    profileMessage.textContent = "";

    editModal.classList.add("show");

    editName.focus();

}


// ================= RENDER TECHNOLOGY OPTIONS =================

function renderTechnologyOptions() {

    technologyOptions.innerHTML = "";

    AVAILABLE_TECHNOLOGIES.forEach(technology => {

        const label = document.createElement("label");

        label.className = "technology-option";

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.name = "profileTechnology";
        checkbox.value = technology;

        checkbox.checked = selectedTechnologies.includes(technology);

        const icon = document.createElement("span");

        icon.className = "technology-icon";
        icon.textContent = TECHNOLOGY_ICONS[technology];

        const name = document.createElement("span");

        name.className = "technology-name";
        name.textContent = technology;

        label.append(checkbox, icon, name);

        technologyOptions.appendChild(label);

    });

}


// ================= UPDATE SELECTED COUNT =================

function updateSelectedTechCount() {

    const checkboxes = document.querySelectorAll(
        'input[name="profileTechnology"]'
    );

    const count = Array.from(checkboxes).filter(
        checkbox => checkbox.checked
    ).length;

    selectedTechCount.textContent = count;

}


// ================= CLOSE EDIT MODAL =================

function closeEditModal() {

    editModal.classList.remove("show");

}


// ================= UPDATE PROFILE API =================

async function updateUserData(name, technologies) {

    try {

        const response = await axios.patch(
            UPDATE_PROFILE_API,
            {
                name,
                technologies
            },
            {
                withCredentials: true
            }
        );

        if (!response.data?.success || !response.data?.user) {
            throw new Error(
                response.data?.message || "Profile update failed"
            );
        }

        return response.data.user;

    } catch (error) {

        console.error("Error while updating profile:", error);

        throw error;

    }

}


// ================= SAVE PROFILE =================

async function saveProfile(event) {

    event.preventDefault();

    if (!userData) return;

    const newName = editName.value.trim();

    if (!newName) {

        profileMessage.textContent = "Please enter your name.";

        editName.focus();

        return;
    }

    // Get selected technologies

    const checkboxes = document.querySelectorAll(
        'input[name="profileTechnology"]:checked'
    );

    const technologies = Array.from(checkboxes)
        .map(checkbox => checkbox.value)
        .filter(technology =>
            AVAILABLE_TECHNOLOGIES.includes(technology)
        );

    // Disable save button while API is running

    const saveBtn = profileForm.querySelector(
        'button[type="submit"]'
    );

    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";

    profileMessage.textContent = "";

    try {

        // Call backend API

        const updatedUser = await updateUserData(
            newName,
            technologies
        );

        // Update frontend data from API response

        userData = updatedUser;

        selectedTechnologies = normalizeTechnologies(
            updatedUser.technologies
        );

        // Update UI only after successful API response

        renderProfile();

        closeEditModal();

        alert("Profile updated successfully!");

    } catch (error) {

        profileMessage.textContent =
            error.response?.data?.message ||
            error.message ||
            "Unable to update profile. Please try again.";

    } finally {

        saveBtn.disabled = false;
        saveBtn.textContent = "Save Changes";

    }

}


// ================= LOGOUT API =================

async function logout() {

    try {

        await axios.delete(
            LOGOUT_API,
            {
                withCredentials: true
            }
        );

        return true;

    } catch (error) {

        console.error("Error while logout:", error);

        return false;

    }

}


// ================= EVENT LISTENERS =================

// Open edit modal

editProfileBtn.addEventListener("click", openEditModal);


// Close modal

closeModal.addEventListener("click", closeEditModal);

cancelBtn.addEventListener("click", closeEditModal);


// Save profile

profileForm.addEventListener("submit", saveProfile);


// Update technology count

technologyOptions.addEventListener(
    "change",
    updateSelectedTechCount
);


// Close modal by clicking outside

editModal.addEventListener("click", function(event) {

    if (event.target === editModal) {
        closeEditModal();
    }

});


// Escape key

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        closeEditModal();

        logoutPopup.classList.remove("show");

    }

});


// ================= LOGOUT POPUP =================

// Open popup

logoutBtn.addEventListener("click", function(event) {

    event.preventDefault();

    logoutPopup.classList.add("show");

});


// Cancel logout

cancelLogout.addEventListener("click", function() {

    logoutPopup.classList.remove("show");

});


// Close popup by clicking outside

logoutPopup.addEventListener("click", function(event) {

    if (event.target === logoutPopup) {
        logoutPopup.classList.remove("show");
    }

});


// Confirm logout

confirmLogout.addEventListener("click", async function() {

    confirmLogout.disabled = true;
    confirmLogout.textContent = "Logging out...";

    const success = await logout();

    if (success) {

        window.location.href = "../index.html";

        return;

    }

    confirmLogout.disabled = false;
    confirmLogout.textContent = "Logout";

    alert("Logout failed. Please try again.");

});


// ================= INITIALIZE =================

getProfile();
