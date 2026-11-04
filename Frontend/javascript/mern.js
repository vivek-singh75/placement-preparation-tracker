// =====================================================
// MERN DATA
// =====================================================

let mernData = {};

let currentTechnology = null;
let currentTopic = null;

let selectedTechnologies = [];


// =====================================================
// API BASE URL
// =====================================================

//const API_URL = "http://localhost:3000";
const API_URL = "https://placement-preparation-tracker-ltlg.onrender.com";

// =====================================================
// DOM ELEMENTS
// =====================================================

const $ = (selector) =>
    document.querySelector(selector);


const sidebar = $("#sidebar");
const menuBtn = $("#menuBtn");
const overlay = $("#overlay");

const technologyNavigation =
    $("#technologyNavigation");

const mobileTechnologyNavigation =
    $("#mobileTechnologyNavigation");

const mobileMoreBtn =
    $("#mobileMoreBtn");

const mobileMoreMenu =
    $("#mobileMoreMenu");

const themeBtn = $("#themeBtn");

const technologyContainer =
    $("#technologyContainer");

const topicsContainer =
    $("#topicsContainer");

const selectedTechnology =
    $("#selectedTechnology");

const statusModal =
    $("#statusModal");

const modalTopicName =
    $("#modalTopicName");

const closeModal =
    $("#closeModal");

const cancelStatus =
    $("#cancelStatus");

const saveStatus =
    $("#saveStatus");

const overallPercentage =
    $("#overallPercentage");

const overallProgressBar =
    $("#overallProgressBar");


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHTML(value) {

    const element =
        document.createElement("div");

    element.textContent =
        value ?? "";

    return element.innerHTML;

}


// =====================================================
// TECHNOLOGY ICONS
// =====================================================

function getSkillIcon(technology) {

    const icons = {

        "MERN": "M",
        "MERN Stack": "M",

        "Data Science": "DS",

        "AI/ML": "AI",

        "Spring Boot": "SB",

        "Java / Spring Boot": "SB",

        "Cyber Security": "CS",

        "App Development": "AD"

    };

    return icons[technology] || "•";

}


// =====================================================
// TECHNOLOGY ROUTES
// =====================================================

function getTechnologyRoute(technology) {

    const routes = {

        "MERN": "./mern.html",

        "MERN Stack": "./mern.html",

        "Data Science": "./dataScience.html",

        "AI/ML": "./aiMl.html",

        "Spring Boot": "./springBoot.html",

        "Java / Spring Boot": "./springBoot.html",

        "Cyber Security": "./cyberSecurity.html",

        "App Development": "./appDevelopment.html"

    };

    return routes[technology] || "#";

}


// =====================================================
// CURRENT PAGE CHECK
// =====================================================

function isCurrentTechnology(technology) {

    return (
        technology === "MERN" ||
        technology === "MERN Stack"
    );

}


// =====================================================
// MOBILE SIDEBAR
// =====================================================

function openSidebar() {

    sidebar?.classList.add("open");

    overlay?.classList.add("show");

}


function closeSidebar() {

    sidebar?.classList.remove("open");

    overlay?.classList.remove("show");

}


menuBtn?.addEventListener(
    "click",
    openSidebar
);


overlay?.addEventListener(
    "click",
    closeSidebar
);


// =====================================================
// PROFILE
// =====================================================

function renderProfile(user) {

    if (!user) return;


    const name =
        user.name ||
        user.username ||
        "User";


    const username =
        String(user.username || "user")
            .replace(/^@/, "");


    const firstLetter =
        name.charAt(0).toUpperCase();


    // HEADER

    const headerName =
        $("#headerName");

    const headerUsername =
        $("#headerUsername");

    const headerAvatar =
        $("#headerAvatar");


    // SIDEBAR

    const sidebarName =
        $("#sidebarName");

    const sidebarUsername =
        $("#sidebarUsername");

    const sidebarAvatar =
        $("#sidebarAvatar");


    if (headerName) {
        headerName.textContent = name;
    }

    if (headerUsername) {
        headerUsername.textContent = `@${username}`;
    }

    if (headerAvatar) {
        headerAvatar.textContent = firstLetter;
    }


    if (sidebarName) {
        sidebarName.textContent = name;
    }

    if (sidebarUsername) {
        sidebarUsername.textContent = `@${username}`;
    }

    if (sidebarAvatar) {
        sidebarAvatar.textContent = firstLetter;
    }

}


// =====================================================
// FETCH DASHBOARD USER DATA
// =====================================================

async function fetchDashboardUser() {

    try {

        const response = await axios.get(

            `${API_URL}/api/dashboard/`,

            {
                withCredentials: true
            }

        );


        const data = response.data;


        if (data.success !== true) {

            throw new Error(
                "Invalid dashboard response"
            );

        }


        const user = data.user;


        console.log(
            "Dashboard User:",
            user
        );


        // PROFILE

        renderProfile(user);


        // SELECTED TECHNOLOGIES

        selectedTechnologies =
            Array.isArray(user?.technologies)
                ? [
                    ...new Set(
                        user.technologies
                            .filter(
                                technology =>
                                    typeof technology === "string"
                            )
                    )
                ]
                : [];


        console.log(
            "Selected Technologies:",
            selectedTechnologies
        );


        // RENDER NAVIGATION

        renderTechnologyNavigation();

        renderMobileNavigation();


    } catch (error) {

        console.error(
            "Dashboard User Fetch Error:",
            error
        );

    }

}


// =====================================================
// SIDEBAR TECHNOLOGY NAVIGATION
// =====================================================

function renderTechnologyNavigation() {

    if (!technologyNavigation) return;


    technologyNavigation.innerHTML = "";


    selectedTechnologies.forEach(
        function (technology) {


            const link =
                document.createElement("a");


            link.className =
                "nav-item nav-link";


            link.href =
                getTechnologyRoute(technology);


            link.dataset.technology =
                technology;


            if (
                isCurrentTechnology(technology)
            ) {

                link.classList.add("active");

            }


            const icon =
                document.createElement("span");


            icon.className = "nav-icon";

            icon.textContent =
                getSkillIcon(technology);


            const label =
                document.createElement("span");


            label.textContent =
                technology;


            link.append(icon, label);


            technologyNavigation.appendChild(link);


        }
    );

}


// =====================================================
// MOBILE NAVIGATION
// =====================================================

function renderMobileNavigation() {

    if (!mobileTechnologyNavigation) return;


    mobileTechnologyNavigation.innerHTML = "";


    if (mobileMoreMenu) {

        mobileMoreMenu.innerHTML = "";

        mobileMoreMenu.hidden = true;

    }


    if (mobileMoreBtn) {

        mobileMoreBtn.hidden = true;

    }


    // Current page first

    const technologies = [
        ...selectedTechnologies
    ].sort(
        (a, b) =>
            Number(isCurrentTechnology(b)) -
            Number(isCurrentTechnology(a))
    );


    // First selected technology directly visible

    const visibleTechnologies =
        technologies.slice(0, 1);


    // Remaining technologies inside More

    const hiddenTechnologies =
        technologies.slice(1);


    // DIRECT MOBILE NAVIGATION

    visibleTechnologies.forEach(
        function (technology) {

            const link =
                createMobileTechnologyLink(technology);


            mobileTechnologyNavigation.appendChild(
                link
            );

        }
    );


    // MORE MENU

    hiddenTechnologies.forEach(
        function (technology) {

            const link =
                createMobileTechnologyLink(technology);


            mobileMoreMenu.appendChild(link);

        }
    );


    // SHOW MORE BUTTON ONLY WHEN REQUIRED

    if (
        mobileMoreBtn &&
        hiddenTechnologies.length > 0
    ) {

        mobileMoreBtn.hidden = false;

    }

}


// =====================================================
// CREATE MOBILE TECHNOLOGY LINK
// =====================================================

function createMobileTechnologyLink(technology) {

    const link =
        document.createElement("a");


    link.className =
        "mobile-nav-item";


    link.href =
        getTechnologyRoute(technology);


    link.dataset.technology =
        technology;


    const icon =
        document.createElement("span");


    icon.textContent =
        getSkillIcon(technology);


    const label =
        document.createElement("small");


    label.textContent =
        technology === "MERN Stack"
            ? "MERN"
            : technology;


    link.append(icon, label);


    if (
        isCurrentTechnology(technology)
    ) {

        link.classList.add("active");

    }


    return link;

}


// =====================================================
// MOBILE MORE MENU
// =====================================================

mobileMoreBtn?.addEventListener(
    "click",
    function (event) {

        event.stopPropagation();


        const isHidden =
            mobileMoreMenu.hidden;


        mobileMoreMenu.hidden =
            !isHidden;

    }
);


// Close More menu when clicking outside

document.addEventListener(
    "click",
    function (event) {

        if (
            mobileMoreMenu &&
            mobileMoreBtn &&
            !mobileMoreMenu.contains(event.target) &&
            !mobileMoreBtn.contains(event.target)
        ) {

            mobileMoreMenu.hidden = true;

        }

    }
);


// Close More menu after selecting a technology

mobileMoreMenu?.addEventListener(
    "click",
    function (event) {

        if (
            event.target.closest("a")
        ) {

            mobileMoreMenu.hidden = true;

        }

    }
);


// =====================================================
// CLOSE SIDEBAR AFTER NAVIGATION
// =====================================================

document.addEventListener(
    "click",
    function (event) {

        const link =
            event.target.closest(".nav-link");


        if (!link) return;


        if (window.innerWidth <= 768) {

            closeSidebar();

        }

    }
);


// =====================================================
// DARK MODE
// =====================================================

function applyTheme(theme) {

    const isDark =
        theme === "dark";


    document.body.classList.toggle(
        "dark",
        isDark
    );


    if (themeBtn) {

        themeBtn.textContent =
            isDark ? "☀️" : "🌙";

    }

}


function toggleTheme() {

    const isDark =
        document.body.classList.contains("dark");


    const newTheme =
        isDark ? "light" : "dark";


    localStorage.setItem(
        "theme",
        newTheme
    );


    applyTheme(newTheme);

}


themeBtn?.addEventListener(
    "click",
    toggleTheme
);


// Load saved theme

const savedTheme =
    localStorage.getItem("theme") || "light";


applyTheme(savedTheme);


// =====================================================
// FETCH MERN DATA
// =====================================================

async function fetchData() {

    try {

        // FETCH ALL REQUIRED DATA

        const results =
            await Promise.allSettled([

                // LEARNING CONTENT

                axios.get(
                    `${API_URL}/api/mern/getData`,
                    {
                        withCredentials: true
                    }
                ),


                // USER PROGRESS

                axios.get(
                    `${API_URL}/api/mern/getProgress`,
                    {
                        withCredentials: true
                    }
                )

            ]);


        const contentResult = results[0];

        const progressResult = results[1];


        // CONTENT IS REQUIRED

        if (
            contentResult.status === "rejected"
        ) {

            throw contentResult.reason;

        }


        const contentResponse =
            contentResult.value;


        // PROGRESS CAN DEFAULT TO EMPTY

        const progressResponse =
            progressResult.status === "fulfilled"
                ? progressResult.value
                : null;


        if (
            progressResult.status === "rejected"
        ) {

            console.error(
                "Progress API Error:",
                progressResult.reason
            );

        }


        // GET LEARNING CONTENT

        const learningContent =
            contentResponse.data.learningContent || [];


        // GET USER PROGRESS

        const progress =
            progressResponse?.data?.progress || [];


        console.log(
            "Learning Content:",
            learningContent
        );

        console.log(
            "User Progress:",
            progress
        );


        // =================================================
        // CREATE PROGRESS MAP
        // =================================================

        const progressMap = {};


        progress.forEach(function (item) {

            const topicId =
                item.topicId?._id ||
                item.topicId;


            progressMap[String(topicId)] =
                item.status;

        });


        console.log(
            "Progress Map:",
            progressMap
        );


        // =================================================
        // CREATE MERN DATA
        // =================================================

        mernData = {};


        learningContent.forEach(
            function (technology) {

                const topics =
                    Array.isArray(technology.Topics)
                        ? technology.Topics
                        : [];


                mernData[
                    technology.technology
                ] = topics.map(
                    function (topic) {

                        return {

                            id: topic._id,

                            name: topic.title,

                            status:
                                progressMap[
                                    String(topic._id)
                                ] || "pending"

                        };

                    }
                );

            }
        );


        console.log(
            "MERN Data:",
            mernData
        );


        // START UI

        mainFunction();


    } catch (error) {

        console.error(
            "Error while fetching MERN data:",
            error
        );


        if (technologyContainer) {

            technologyContainer.innerHTML = `

                <div class="emptyTopics">

                    Unable to load learning content.

                    Please try again later.

                </div>

            `;

        }

    }

}


// =====================================================
// UPDATE PROGRESS API
// =====================================================

async function updateProgress(
    topicId,
    status
) {

    try {

        const response =
            await axios.post(

                `${API_URL}/api/mern/updateProgress/${topicId}`,

                {
                    status: status
                },

                {
                    withCredentials: true
                }

            );


        console.log(
            "Progress updated:",
            response.data
        );


        return response.data;


    } catch (error) {

        console.error(
            "Error while updating progress:",
            error
        );

        throw error;

    }

}


// =====================================================
// MAIN FUNCTION
// =====================================================

function mainFunction() {

    renderTechnologies();

    renderTopics();

    updateOverallProgress();

}


// =====================================================
// RENDER TECHNOLOGIES
// =====================================================

function renderTechnologies() {

    if (!technologyContainer) return;


    technologyContainer.innerHTML = "";


    Object.keys(mernData).forEach(
        function (technology) {

            const topics =
                mernData[technology];


            // COMPLETED COUNT

            const completed =
                topics.filter(
                    topic =>
                        topic.status === "completed"
                ).length;


            // PERCENTAGE

            const percentage =
                topics.length === 0
                    ? 0
                    : Math.round(
                        (completed / topics.length) * 100
                    );


            // CREATE CARD

            const card =
                document.createElement("div");


            card.classList.add("techCard");


            if (
                technology === currentTechnology
            ) {

                card.classList.add("active");

            }


            // CARD HTML

            card.innerHTML = `

                <div class="techTop">

                    <span class="techName">
                        ${escapeHTML(technology)}
                    </span>

                    <span class="techPercentage">
                        ${percentage}%
                    </span>

                </div>


                <div class="techInfo">

                    <span>
                        ${completed}/${topics.length}
                        completed
                    </span>

                    <span>
                        ${percentage}%
                    </span>

                </div>


                <div class="techProgress">

                    <div
                        class="techProgressFill"
                        style="width:${percentage}%"
                    ></div>

                </div>

            `;


            // TECHNOLOGY CLICK

            card.addEventListener(
                "click",
                function () {

                    currentTechnology =
                        technology;

                    currentTopic = null;

                    renderTechnologies();

                    renderTopics();

                }
            );


            technologyContainer.appendChild(card);

        }
    );

}


// =====================================================
// RENDER TOPICS
// =====================================================

function renderTopics() {

    if (!topicsContainer) return;


    topicsContainer.innerHTML = "";


    // NO TECHNOLOGY SELECTED

    if (!currentTechnology) {

        selectedTechnology.textContent =
            "Select a Technology";


        topicsContainer.innerHTML = `

            <div class="emptyTopics">

                <div class="emptyIcon">
                    📚
                </div>

                <p>
                    Select a technology above
                </p>

            </div>

        `;

        return;

    }


    // HEADING

    selectedTechnology.textContent =
        currentTechnology + " Topics";


    // GET TOPICS

    const topics =
        mernData[currentTechnology] || [];


    // EMPTY TECHNOLOGY

    if (topics.length === 0) {

        topicsContainer.innerHTML = `

            <div class="emptyTopics">

                No topics available for this technology.

            </div>

        `;

        return;

    }


    // CREATE TOPIC CARDS

    topics.forEach(
        function (topic) {

            const card =
                document.createElement("div");


            card.classList.add("topicCard");


            // STATUS TEXT

            let statusText;


            if (topic.status === "completed") {

                statusText = "Completed";

            }

            else if (topic.status === "progress") {

                statusText = "In Progress";

            }

            else {

                statusText = "Pending";

            }


            // CARD HTML

            card.innerHTML = `

                <div class="topicTop">

                    <span class="topicName">
                        ${escapeHTML(topic.name)}
                    </span>

                    <span class="status ${escapeHTML(topic.status)}">
                        ${statusText}
                    </span>

                </div>


                <p class="topicTechnology">
                    ${escapeHTML(currentTechnology)}
                </p>

            `;


            // TOPIC CLICK

            card.addEventListener(
                "click",
                function () {

                    openStatusModal(topic);

                }
            );


            topicsContainer.appendChild(card);

        }
    );

}


// =====================================================
// OPEN STATUS MODAL
// =====================================================

function openStatusModal(topic) {

    currentTopic = topic;


    console.log(
        "Current Topic:",
        currentTopic
    );


    modalTopicName.textContent =
        topic.name;


    // RESET RADIO BUTTONS

    document
        .querySelectorAll(
            'input[name="topicStatus"]'
        )
        .forEach(
            function (radio) {

                radio.checked = false;

            }
        );


    // SELECT CURRENT STATUS

    const radio =
        document.querySelector(
            `input[name="topicStatus"][value="${topic.status}"]`
        );


    if (radio) {

        radio.checked = true;

    }


    // SHOW MODAL

    statusModal.classList.add("show");

}


// =====================================================
// CLOSE STATUS MODAL
// =====================================================

function closeStatusModal() {

    statusModal.classList.remove("show");

    currentTopic = null;

}


// =====================================================
// MODAL BUTTONS
// =====================================================

closeModal?.addEventListener(
    "click",
    closeStatusModal
);


cancelStatus?.addEventListener(
    "click",
    closeStatusModal
);


// =====================================================
// SAVE STATUS
// =====================================================

saveStatus?.addEventListener(
    "click",
    async function () {

        if (!currentTopic) return;


        // GET SELECTED RADIO

        const selected =
            document.querySelector(
                'input[name="topicStatus"]:checked'
            );


        if (!selected) {

            alert(
                "Please select a status."
            );

            return;

        }


        // SELECTED STATUS

        const newStatus =
            selected.value;


        const topic =
            currentTopic;


        const topicId =
            topic.id;


        console.log(
            "Updating Topic:",
            topicId
        );


        // DISABLE BUTTON

        saveStatus.disabled = true;

        saveStatus.textContent =
            "Saving...";


        try {

            // BACKEND API

            await updateProgress(
                topicId,
                newStatus
            );


            // UPDATE FRONTEND DATA

            topic.status = newStatus;


            // CLOSE MODAL

            closeStatusModal();


            // REFRESH UI

            renderTopics();

            renderTechnologies();

            updateOverallProgress();


        } catch (error) {

            console.error(
                "Unable to update progress:",
                error
            );

            alert(
                "Unable to update progress. Please try again."
            );

        } finally {

            saveStatus.disabled = false;

            saveStatus.textContent =
                "Save Status";

        }

    }
);


// =====================================================
// MODAL BACKDROP CLICK
// =====================================================

statusModal?.addEventListener(
    "click",
    function (event) {

        if (event.target === statusModal) {

            closeStatusModal();

        }

    }
);


// =====================================================
// OVERALL PROGRESS
// =====================================================

function updateOverallProgress() {

    let total = 0;

    let completed = 0;


    // LOOP ALL TECHNOLOGIES

    Object.values(mernData).forEach(
        function (topics) {

            total += topics.length;


            topics.forEach(
                function (topic) {

                    if (
                        topic.status === "completed"
                    ) {

                        completed++;

                    }

                }
            );

        }
    );


    // CALCULATE PERCENTAGE

    const percentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    // UPDATE UI

    overallPercentage.textContent =
        percentage + "%";


    overallProgressBar.style.width =
        percentage + "%";

}


// =====================================================
// INITIALIZE PAGE
// =====================================================

async function initializeMernPage() {

    console.log(
        "DevTrack MERN Page Initialized"
    );


    // FETCH USER + TECHNOLOGY NAVIGATION

    fetchDashboardUser();


    // FETCH MERN LEARNING DATA

    fetchData();

}


// =====================================================
// START
// =====================================================

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeMernPage,
        { once: true }
    );

}

else {

    initializeMernPage();

}