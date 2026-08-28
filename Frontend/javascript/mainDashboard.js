
// =====================================================
// GET DATA FROM BACKEND
// =====================================================

let Gdata = [];
let userData = null;

// =====================================================
// FETCH USER + QUESTION DATA
// =====================================================

async function getData() {

    try {
        const response = await axios.get(
            "https://placement-preparation-tracker-ltlg.onrender.com/api/question/getQuestion",
            {
                withCredentials: true
            }
        );

        const { user, userQuestionData } =
            response.data.allData;

        console.log("User:", user);
        console.log("Questions:", userQuestionData);

        userData = user;

        if (Array.isArray(userQuestionData)) {
            Gdata = userQuestionData;
        } else {
            Gdata = [];
        }
        // IMPORTANT:
        startDashboard()
       


    } catch (error) {

        console.log(
            "Error in frontend:",
            error
        );

    }
}



// =====================================================
// SKILLS DATA
// =====================================================
function startDashboard(){
    // Profile data
    document.getElementById("profileName").textContent =
        userData.name;

    document.getElementById("profileAvatar").textContent =
        userData.name.charAt(0).toUpperCase();

    document.getElementById("welcomeName").textContent =
        `${userData.name} 👋`;

    const totalDsaQuestion = Gdata.length


    const skills = [
    {
        name: "DSA",
        progress: 65,
        completed:` ${totalDsaQuestion} / 4000`,
        icon: "</>",
        color: "#7c3aed",
        bg: "#f3e8ff",
        button: "Go to DSA",
        link: "../html/DashboardOfDsa.html" },

    {
        name: "MERN Stack",
        progress: 20,
        completed: "18 / 90",
        icon: "M",
        color: "#10b981",
        bg: "#ecfdf5",
        button: "Explore",
        link : "#"
        
    },

    {
        name: "Data Science",
        progress: 10,
        completed: "6 / 60",
        icon: "DS",
        color: "#2563eb",
        bg: "#eff6ff",
        button: "Explore",
        link : "#"
    },

    {
        name: "Java / Spring Boot",
        progress: 0,
        completed: "0 / 80",
        icon: "☕",
        color: "#f59e0b",
        bg: "#fffbeb",
        button: "Coming Soon",
        link : "#"
    },

    {
        name: "Cyber Security",
        progress: 0,
        completed: "0 / 70",
        icon: "◈",
        color: "#ec4899",
        bg: "#fdf2f8",
        button: "Coming Soon",
        link : "#"
    },

    {
        name: "App Development",
        progress: 0,
        completed: "0 / 60",
        icon: "▣",
        color: "#06b6d4",
        bg: "#ecfeff",
        button: "Coming Soon",
        link : "#"
    }
];


// =====================================================
// SKILL CARDS
// =====================================================

const skillsContainer =
    document.querySelector("#skillsContainer");


skills.forEach(skill => {

    const card =
        document.createElement("div");

    card.className = "skill-card";


    card.innerHTML = `

        <div class="skill-top">

            <div
                class="skill-icon"
                style="
                    color:${skill.color};
                    background:${skill.bg};
                "
            >
                ${skill.icon}
            </div>

            <div
                class="skill-percent"
                style="
                    color:${skill.color};
                    border-color:${skill.color}55;
                "
            >
                ${skill.progress}%
            </div>

        </div>


        <h3>
            ${skill.name}
        </h3>


        <div class="skill-progress">

            <div
                style="
                    width:${skill.progress}%;
                    background:${skill.color};
                "
            ></div>

        </div>


        <p class="skill-info">
            Completed: ${skill.completed}
        </p>


        <a  href = "${skill.link}"
            class="skill-btn"
            style="
                color:${skill.color};
                border-color:${skill.color};
            "
        >   
            ${skill.button}
        </a>

    `;


    skillsContainer.appendChild(card);

});


// =====================================================
// OVERALL PROGRESS
// =====================================================
const dsaProgress = (totalDsaQuestion /4000)*100

const progressData = [
    {
        name: "DSA",
        progress: dsaProgress.toFixed(2),
        color: "#7c3aed"
    },

    {
        name: "MERN Stack",
        progress: 20,
        color: "#10b981"
    },

    {
        name: "Data Science",
        progress: 10,
        color: "#2563eb"
    },

    {
        name: "Others",
        progress: 5,
        color: "#94a3b8"
    }
];


const progressLegend =
    document.querySelector("#progressLegend");

progressLegend.innerHTML = ""; 

progressData.forEach(item => {

    const div =
        document.createElement("div");

    div.className = "legend-item";


    div.innerHTML = `

        <div class="legend-left">

            <span
                class="legend-dot"
                style="background:${item.color}"
            ></span>

            <span>
                ${item.name}
            </span>

        </div>

        <strong>
            ${item.progress}%
        </strong>

    `;


    progressLegend.appendChild(div);

});


// =====================================================
// RECENT ACTIVITY
// =====================================================

const recentActivity =
    document.querySelector("#recentActivity");


function renderRecentActivity() {

    recentActivity.innerHTML = "";


    // No questions
    if (Gdata.length === 0) {

        recentActivity.innerHTML = `

            <div class="emptyState">

                <div class="emptyStateIcon">
                    📝
                </div>

                <p>
                    No questions added yet.
                </p>

            </div>

        `;

        return;
    }


    // Get latest 5 questions
    const recentQuestions =
        Gdata
            .slice(-5)
            .reverse();


    recentQuestions.forEach(question => {

        const item =
            document.createElement("div");


        item.className =
            "activity-item";
        item.innerHTML = `
            <div class="activity-icon">
                ✓
            </div>
            <div>
                <p class="activity-title">
                    ${question.questionName || "Unnamed Question"}
                </p>
                <p class="activity-meta">
                    DSA • ${question.topic || "Unknown"}
                </p>
            </div>
            <span class="activity-time">
                ${question.Solved_Status || "Solved"}
            </span>
        `;
        recentActivity.appendChild(item);

    });

}
    renderRecentActivity()


// =====================================================
// WEAK TOPICS
// =====================================================

const weakTopics = [

    {
        name: "Dynamic Programming",
        progress: 12
    },

    {
        name: "Graph",
        progress: 18
    },

    {
        name: "Tree",
        progress: 20
    },

    {
        name: "Backtracking",
        progress: 25
    }

];


const weakContainer =
    document.querySelector("#weakTopics");


weakTopics.forEach(topic => {

    const item =
        document.createElement("div");

    item.className = "weak-item";


    item.innerHTML = `

        <div class="weak-icon">
            !
        </div>

        <div class="weak-content">

            <p class="weak-name">
                ${topic.name}
            </p>

            <div class="weak-progress">

                <div
                    style="width:${topic.progress}%"
                ></div>

            </div>

        </div>

        <span class="weak-percent">
            ${topic.progress}%
        </span>

        <button class="practice-btn">
            Practice
        </button>

    `;


    weakContainer.appendChild(item);

});


// =====================================================
// MOBILE SIDEBAR
// =====================================================

const menuBtn =
    document.querySelector("#menuBtn");

const sidebar =
    document.querySelector("#sidebar");

const overlay =
    document.querySelector("#overlay");


menuBtn.addEventListener("click", () => {

    sidebar.classList.add("open");

    overlay.style.display = "block";

});


overlay.addEventListener("click", () => {

    sidebar.classList.remove("open");

    overlay.style.display = "none";

});


// Close sidebar after clicking a link on mobile

const navLinks =
    document.querySelectorAll(".nav-link");


navLinks.forEach(link => {

    link.addEventListener("click", () => {

        if (window.innerWidth <= 768) {

            sidebar.classList.remove("open");

            overlay.style.display = "none";

        }

    });

});


// =====================================================
// DARK MODE
// =====================================================

const themeBtn =
    document.querySelector("#themeBtn");


themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");


    if (document.body.classList.contains("dark")) {

        themeBtn.textContent = "☀️";

        localStorage.setItem(
            "theme",
            "dark"
        );

    } else {

        themeBtn.textContent = "🌙";

        localStorage.setItem(
            "theme",
            "light"
        );

    }

});


// =====================================================
// LOAD SAVED THEME
// =====================================================

const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";

}
}



getData()