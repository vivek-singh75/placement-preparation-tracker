// =====================================================
// DEVTRACK DASHBOARD


// GLOBAL DATA

let userData = null;
let dashboardData = null;



// IMPORTANT:
// Change this only if your backend uses another port
// or route.

// API

const DASHBOARD_API =
    "https://placement-preparation-tracker-ltlg.onrender.com/api/dashboard/";

const USER_API =
    "https://placement-preparation-tracker-ltlg.onrender.com/api/question/getQuestion";


// FETCH DASHBOARD + USER DATA


async function getData() {

    try {

        console.log("Fetching dashboard data...");
        console.log("Fetching user data...");


        // DASHBOARD API
       

        const dashboardResponse = await axios.get(
            DASHBOARD_API,
            {
                withCredentials: true
            }
        );


   
        // USER API
  

        const userResponse = await axios.get(
            USER_API,
            {
                withCredentials: true
            }
        );


        // DEBUG


        console.log(
            "Dashboard API response:",
            dashboardResponse.data
        );

        console.log(
            "User API response:",
            userResponse.data
        );


        // STORE DASHBOARD DATA

        dashboardData =
            dashboardResponse.data.data;


  
        // STORE USER DATA

        

        userData =
            userResponse.data.allData.user || null;


       
        // VALIDATION
     

        if (!dashboardData) {

            throw new Error(
                "Dashboard data not found in API response"
            );

        }



        // DEBUG


        console.log(
            "User:",
            userData
        );

        console.log(
            "Dashboard:",
            dashboardData
        );
        console.log(
            "Dashboard:",
            dashboardData.streak
        );


  
        // START DASHBOARD


        startDashboard();


    } catch (error) {

        console.error(
            "Message:",
            error.message
        );


        console.error(
            "Status:",
            error.response?.status
        );


        console.error(
            "Response:",
            error.response?.data
        );


        console.error(
            "URL:",
            error.config?.url
        );

        showDashboardError();

    }

}


// START DASHBOARD


function startDashboard() {

    if (!dashboardData) {
        return;
    }


    renderProfile();

    renderStats();

    renderSkills();

    renderOverallProgress();

    renderRecentActivity();

    renderWeakTopics();

}


// PROFILE

function renderProfile() {

    if (!userData) {
        return;
    }

    const profileName =
        document.getElementById(
            "profileName"
        );

    const profileAvatar =
        document.getElementById(
            "profileAvatar"
        );

    const welcomeName =
        document.getElementById(
            "welcomeName"
        );
        

    
    // PROFILE NAME
    

    const name = userData.name || "User";


    if (profileName) {
        profileName.textContent = name; 
    }


    // =================================================
    // PROFILE AVATAR
    // =================================================

    if (profileAvatar) {
        profileAvatar.textContent = name
                .charAt(0)
                .toUpperCase();

    }


    
    // WELCOME MESSAGE
    
    if (welcomeName) {
        welcomeName.textContent =`${name} 👋`;
    }

}



// DASHBOARD STATS


function renderStats() {

    const solvedQuestions =
        document.getElementById(
            "solvedQuestions"
        );


    const streak =
        document.getElementById(
            "streak"
        );


    const solvedPercentage =
        document.getElementById(
            "solvedPercentage"
        );


    
    // TOTAL SOLVED
   
    const totalSolved =
        Number(
            dashboardData.totalSolved
        ) || 0;


    
    // CURRENT STREAK
   
    const currentStreak = document.querySelector(".currntStreak")

    currentStreak.textContent =
        (
            dashboardData.streak
        ) || 0 ;


    
    // FIND DSA


    const dsaSkill =
        dashboardData.skills?.find(
            skill =>
                skill.name === "DSA"
        );


    const dsaTotal =
        Number(
            dsaSkill?.total
        ) || 0;


    
    // CALCULATE DSA %

    const dsaProgress =
        dsaTotal === 0
            ? 0
            : Math.min(
                100,
                (
                    totalSolved /
                    dsaTotal
                ) * 100
            );

    // UPDATE QUESTIONS

    if (solvedQuestions) {

        solvedQuestions.textContent =
            totalSolved;

    }


    // UPDATE PERCENTAGE

    if (solvedPercentage) {

        solvedPercentage.textContent =
            `${dsaProgress.toFixed(2)}% of total`;

    }


    // UPDATE STREAK

    if (streak) {

        streak.textContent =
            `${currentStreak} Day${
                currentStreak !== 1
                    ? "s"
                    : ""
            }`;

    }

}


// SKILL CONFIGURATION

const skillConfig = {

    "DSA": {

        icon: "</>",

        color: "#7c3aed",

        bg: "#f3e8ff",

        button: "Go to DSA",

        link: "../html/dashboardOfDsa.html"

    },


    "MERN Stack": {

        icon: "M",

        color: "#10b981",

        bg: "#ecfdf5",

        button: "Coming Soon",

        link: "../html/mern.html"

    },


    "Data Science": {

        icon: "DS",

        color: "#2563eb",

        bg: "#eff6ff",

        button: "Explore",

        link: "#"

    },


    "Java / Spring Boot": {

        icon: "☕",

        color: "#f59e0b",

        bg: "#fffbeb",

        button: "Coming Soon",

        link: "#"

    },


    "Cyber Security": {

        icon: "◈",

        color: "#ec4899",

        bg: "#fdf2f8",

        button: "Coming Soon",

        link: "#"

    },


    "App Development": {

        icon: "▣",

        color: "#06b6d4",

        bg: "#ecfeff",

        button: "Coming Soon",

        link: "#"

    }

};


// SKILL CARDS

function renderSkills() {

    const skillsContainer =
        document.querySelector(
            "#skillsContainer"
        );


    if (!skillsContainer) {
        return;
    }


    skillsContainer.innerHTML = "";


    const skills =
        Array.isArray(
            dashboardData.skills
        )
            ? dashboardData.skills
            : [];


    // CREATE SKILL CARD

    skills.forEach(skill => {


        const settings =
            skillConfig[
                skill.name
            ] || {

                icon: "•",

                color: "#64748b",

                bg: "#f1f5f9",

                button: "Explore",

                link: "#"

            };


        // VALUES

        const total =
            Number(
                skill.total
            ) || 0;


        const completed =
            Number(
                skill.completed
            ) || 0;


        // CALCULATE %

        const progress =
            total === 0
                ? 0
                : Math.min(
                    100,
                    (
                        completed /
                        total
                    ) * 100
                );


        // CARD

        const card =
            document.createElement("div");


        card.className =
            "skill-card";

        card.innerHTML = `
            <div class="skill-top">
                <div
                    class="skill-icon"
                    style="
                        color:${settings.color};
                        background:${settings.bg};">
                    ${settings.icon}
                </div>


                <div
                    class="skill-percent"
                    style="
                        color:${settings.color};
                        border-color:${settings.color}55;
                    "
                >
                    ${progress.toFixed(2)}%
                </div>

            </div>


            <h3>
                ${skill.name}
            </h3>


            <div class="skill-progress">

                <div
                    style="
                        width:${progress}%;
                        background:${settings.color};
                    "
                ></div>

            </div>


            <p class="skill-info">

                Completed:
                ${completed} / ${total}

            </p>


            <a
                href="${settings.link}"
                class="skill-btn"
                style="
                    color:${settings.color};
                    border-color:${settings.color};
                "
            >

                ${settings.button}

            </a>

        `;


        skillsContainer.appendChild(
            card
        );

    });

}


// OVERALL PROGRESS

function renderOverallProgress() {

    const progressLegend =
        document.querySelector(
            "#progressLegend"
        );


    const overallPercentage =
        document.querySelector(
            "#overallPercentage"
        );


    if (
        !progressLegend ||
        !dashboardData
    ) {

        return;

    }


    progressLegend.innerHTML = "";


    const skills =
        Array.isArray(
            dashboardData.skills
        )
            ? dashboardData.skills
            : [];


    // OVERALL CALCULATION

    let totalCompleted = 0;

    let totalQuestions = 0;


    skills.forEach(skill => {

        const completed =
           (
                skill.completed
            ) || 0;


        const total =
           (
                skill.total
            ) || 0;


        totalCompleted +=
            completed;


        totalQuestions +=
            total;

    });

const circle_innerMain = document.querySelector(".circle-innerMain")


    const overallProgress = totalQuestions === 0
            ? 0
            : Math.min(
                100,
                Number(
                    totalCompleted /
                    totalQuestions
                ) * 100
            );


    // UPDATE OVERALL %

    if (overallPercentage) {    overallPercentage.textContent = `${overallProgress.toFixed(2)}%`; }

console.log(overallPercentage)
console.log(totalCompleted )
console.log(totalQuestions)
console.log(overallProgress)

    // LEGEND COLORS

    const colors = {

        "DSA":"#7c3aed",

        "MERN Stack": "#10b981",

        "Data Science":  "#2563eb"

    };


    // LEGEND SKILLS

    skills
        .filter(skill =>
            [
                "DSA",
                "MERN Stack",
                "Data Science"
            ].includes(
                skill.name
            )
        )
        .forEach(skill => {

            const total =
                Number(
                    skill.total
                ) || 0;


            const completed =
                Number(
                    skill.completed
                ) || 0;


            const progress =
                total === 0
                    ? 0
                    : Math.min(
                        100,
                        (
                            completed /
                            total
                        ) * 100
                    );


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "legend-item";


            div.innerHTML = `

                <div class="legend-left">

                    <span
                        class="legend-dot"
                        style="
                            background:${colors[skill.name]};
                        "
                    ></span>

                    <span>
                        ${skill.name}
                    </span>

                </div>


                <strong>
                    ${progress.toFixed(2)}%
                </strong>

            `;


            progressLegend.appendChild(
                div
            );

        });

}


// RECENT ACTIVITY

function renderRecentActivity() {

    const recentActivity =
        document.querySelector(
            "#recentActivity"
        );

    if (!recentActivity) {
        return;
    }

    recentActivity.innerHTML = "";

    const activities =
        Array.isArray(
            dashboardData.recentActivity
        )
            ? dashboardData.recentActivity
            : [];


    // NO ACTIVITY

    if (
        activities.length === 0
    ) {

        recentActivity.innerHTML = `

            <div class="emptyState">

                <div class="emptyStateIcon">
                    📝
                </div>

                <p>
                    No activity yet.
                </p>

            </div>

        `;

        return;

    }


    // LATEST 5

    activities
        .slice(0, 5)
        .forEach(activity => {


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "activity-item";


            const type =
                activity.type ||
                "DSA";


            const action =
                activity.action ||
                "Completed";


            const title =
                activity.title ||
                "Unnamed Activity";


            const topic =
                activity.topic ||
                "Unknown";


            item.innerHTML = `

                <div class="activity-icon">
                    ✓
                </div>


                <div>

                    <p class="activity-title">

                        ${title}

                    </p>


                    <p class="activity-meta">

                        ${type}
                        •
                        ${topic}

                    </p>

                </div>


                <span class="activity-time">

                    ${action}

                </span>

            `;


            recentActivity.appendChild(
                item
            );

        });

}


// WEAK TOPICS


function renderWeakTopics() {

    const weakContainer =
        document.querySelector(
            "#weakTopics"
        );


    if (!weakContainer) {
        return;
    }


    weakContainer.innerHTML = "";


    // TEMPORARY STATIC DATA

    const weakTopics = [

        {
            name:
                "Dynamic Programming",

            progress:
                12
        },


        {
            name:
                "Graph",

            progress:
                18
        },


        {
            name:
                "Tree",

            progress:
                20
        },


        {
            name:
                "Backtracking",

            progress:
                25
        }

    ];


    // RENDER

    weakTopics.forEach(topic => {


        const item =
            document.createElement(
                "div"
            );


        item.className =
            "weak-item";


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
                        style="
                            width:${topic.progress}%
                        "
                    ></div>

                </div>

            </div>


            <span class="weak-percent">

                ${topic.progress}%

            </span>


            <button
                class="practice-btn"
            >
                Practice
            </button>

        `;


        weakContainer.appendChild(
            item
        );

    });

}


// DASHBOARD ERROR

function showDashboardError() {

    const skillsContainer =
        document.querySelector(
            "#skillsContainer"
        );


    const recentActivity =
        document.querySelector(
            "#recentActivity"
        );


    // SKILLS ERROR

    if (skillsContainer) {

        skillsContainer.innerHTML = `

            <div class="emptyState">

                <div class="emptyStateIcon">
                    ⚠️
                </div>

                <p>
                    Unable to load dashboard data.
                </p>

            </div>

        `;

    }


    
    // ACTIVITY ERROR

    if (recentActivity) {

        recentActivity.innerHTML = `

            <div class="emptyState">

                <div class="emptyStateIcon">
                    ⚠️
                </div>

                <p>
                    Something went wrong while
                    loading activity.
                </p>

            </div>

        `;

    }

}


// MOBILE SIDEBAR

const menuBtn =
    document.querySelector(
        "#menuBtn"
    );


const sidebar =
    document.querySelector(
        "#sidebar"
    );


const overlay =
    document.querySelector(
        "#overlay"
    );


if (
    menuBtn &&
    sidebar &&
    overlay
) {

    // OPEN SIDEBAR

    menuBtn.addEventListener(
        "click",
        () => {

            sidebar.classList.add(
                "open"
            );

            overlay.style.display =
                "block";

        }
    );


    // CLOSE SIDEBAR

    overlay.addEventListener(
        "click",
        () => {

            sidebar.classList.remove(
                "open"
            );

            overlay.style.display =
                "none";

        }
    );

}


// CLOSE SIDEBAR AFTER NAVIGATION


const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


navLinks.forEach(link => {

    link.addEventListener(
        "click",
        () => {

            if (
                window.innerWidth <=
                768
            ) {

                sidebar?.classList.remove(
                    "open"
                );


                if (overlay) {

                    overlay.style.display =
                        "none";

                }

            }

        }
    );

});


// DARK MODE

const themeBtn =
    document.querySelector(
        "#themeBtn"
    );


if (themeBtn) {

    themeBtn.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );


            // ========================================
            // DARK
            // ========================================

            if (
                document.body.classList.contains(
                    "dark"
                )
            ) {

                themeBtn.textContent =
                    "☀️";


                localStorage.setItem(
                    "theme",
                    "dark"
                );

            }


            // ========================================
            // LIGHT
            // ========================================

            else {

                themeBtn.textContent =
                    "🌙";


                localStorage.setItem(
                    "theme",
                    "light"
                );

            }

        }
    );

}


// LOAD SAVED THEME

const savedTheme =
    localStorage.getItem(
        "theme"
    );


if (
    savedTheme === "dark"
) {

    document.body.classList.add(
        "dark"
    );


    if (themeBtn) {

        themeBtn.textContent =
            "☀️";

    }

}


// START APPLICATION


getData();