// =====================================================
// DSA DASHBOARD
// =====================================================

const API_URL = "http://localhost:3000";

let analyticsData = null;


// =====================================================
// DOM ELEMENTS
// =====================================================

const sidebar = document.querySelector("#sidebar");
const menuBtn = document.querySelector("#menuBtn");
const overlay = document.querySelector("#overlay");

const totalSolved = document.querySelector("#totalSolved");
const easyCount = document.querySelector("#easyCount");
const mediumCount = document.querySelector("#mediumCount");
const hardCount = document.querySelector("#hardCount");

const totalTopicText = document.querySelector("#totalTopicText");

const topicProgressContainer =
    document.querySelector("#topicProgressContainer");

const weakTopicContainer =
    document.querySelector("#weakTopicContainer");

const difficultyContainer =
    document.querySelector("#difficultyContainer");

const technologyNavigation =
    document.querySelector("#technologyNavigation");

const mobileTechnologyNavigation =
    document.querySelector("#mobileTechnologyNavigation");

const mobileMoreBtn =
    document.querySelector("#mobileMoreBtn");

const mobileMoreMenu =
    document.querySelector("#mobileMoreMenu");


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

menuBtn?.addEventListener("click", openSidebar);

overlay?.addEventListener("click", closeSidebar);


// Close sidebar after navigation

sidebar?.querySelectorAll(".nav-item").forEach(link => {

    link.addEventListener("click", closeSidebar);

});


// Close sidebar on desktop resize

window.addEventListener("resize", () => {

    if (window.innerWidth > 768) {
        closeSidebar();
    }

});


// =====================================================
// MOBILE MORE MENU
// =====================================================

mobileMoreBtn?.addEventListener("click", (event) => {

    event.stopPropagation();

    mobileMoreMenu?.classList.toggle("show");

});

document.addEventListener("click", (event) => {

    if (
        mobileMoreMenu &&
        mobileMoreBtn &&
        !mobileMoreMenu.contains(event.target) &&
        !mobileMoreBtn.contains(event.target)
    ) {

        mobileMoreMenu.classList.remove("show");

    }

});


// =====================================================
// FETCH DSA ANALYTICS
// =====================================================

async function fetchDSAAnalytics() {

    try {

        const response = await axios.get(
            `${API_URL}/api/question/dsaAnalytics`,
            {
                withCredentials: true
            }
        );

        console.log("DSA Analytics:", response.data);

        return response.data;

    } catch (error) {

        console.error("DSA Analytics API Error:", error);

        throw error;

    }

}


// =====================================================
// PROFILE
// =====================================================

function updateProfile(user) {

    if (!user) return;

    const name =
        user.name ||
        user.username ||
        "User";

    const username =
        user.username ||
        "user";

    const firstLetter =
        name.charAt(0).toUpperCase();

    const elements = {

        headerName: name,
        headerUsername: `@${username}`,
        headerAvatar: firstLetter,

        sidebarName: name,
        sidebarUsername: `@${username}`,
        sidebarAvatar: firstLetter

    };

    Object.entries(elements).forEach(([id, value]) => {

        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }

    });

}


// =====================================================
// SKILL ICON
// =====================================================

function getSkillIcon(name) {

    const icons = {

        "MERN": "M",
        "Spring Boot": "SB",
        "AI/ML": "AI",
        "Data Science": "DS",
        "Cyber Security": "CS",
        "App Development": "AD"

    };

    return icons[name] || "•";

}


// =====================================================
// TECHNOLOGY ROUTES
// =====================================================

function getTechnologyRoute(technology) {

    const routes = {

        "MERN": "./mern.html",
        "Spring Boot": "./springBoot.html",
        "AI/ML": "./aiMl.html",
        "Data Science": "./dataScience.html",
        "Cyber Security": "./cyberSecurity.html",
        "App Development": "./appDevelopment.html"

    };

    return routes[technology] || "#";

}


// =====================================================
// CREATE TECHNOLOGY LINK
// =====================================================

function createTechnologyLink(technology, mobile = false) {

    const link = document.createElement("a");

    link.href = getTechnologyRoute(technology);

    link.className = mobile
        ? "mobile-nav-item"
        : "nav-item";

    if (mobile) {

        const icon = document.createElement("span");
        icon.textContent = getSkillIcon(technology);

        const label = document.createElement("small");
        label.textContent = technology;

        link.append(icon, label);

    } else {

        const icon = document.createElement("span");
        icon.className = "nav-icon";
        icon.textContent = getSkillIcon(technology);

        const label = document.createElement("span");
        label.textContent = technology;

        link.append(icon, label);

    }

    return link;

}


// =====================================================
// SIDEBAR TECHNOLOGY NAVIGATION
// =====================================================

function renderTechnologyNavigation(user) {

    if (!technologyNavigation) return;

    technologyNavigation.innerHTML = "";

    const technologies =
        Array.isArray(user?.technologies)
            ? user.technologies
            : [];

    technologies.forEach(technology => {

        const link = createTechnologyLink(technology);

        technologyNavigation.appendChild(link);

    });

}


// =====================================================
// MOBILE TECHNOLOGY NAVIGATION
// =====================================================

function renderMobileTechnologyNavigation(user) {

    if (!mobileTechnologyNavigation || !mobileMoreMenu) {
        return;
    }

    mobileTechnologyNavigation.innerHTML = "";
    mobileMoreMenu.innerHTML = "";

    const technologies =
        Array.isArray(user?.technologies)
            ? user.technologies
            : [];

    // First two technologies appear directly in bottom navigation

    const visibleTechnologies = technologies.slice(0, 2);

    // Remaining technologies appear inside More

    const remainingTechnologies = technologies.slice(2);

    visibleTechnologies.forEach(technology => {

        const link = createTechnologyLink(technology, true);

        mobileTechnologyNavigation.appendChild(link);

    });

    remainingTechnologies.forEach(technology => {

        const link = createTechnologyLink(technology, true);

        mobileMoreMenu.appendChild(link);

    });

    // Hide More button if there are no extra technologies

    if (mobileMoreBtn) {

        const moreWrapper =
            mobileMoreBtn.closest(".mobile-more-wrapper");

        if (moreWrapper) {

            moreWrapper.style.display =
                remainingTechnologies.length > 0
                    ? "block"
                    : "none";

        }

    }

}


// =====================================================
// RENDER ALL NAVIGATION
// =====================================================

function renderNavigation(user) {

    renderTechnologyNavigation(user);

    renderMobileTechnologyNavigation(user);

}


// =====================================================
// BASIC STATS
// =====================================================

function updateStats(data) {

    const total =
        Number(data?.totalSolved || 0);

    const difficulty =
        data?.difficulty || {};

    if (totalSolved) {
        totalSolved.textContent = total;
    }

    if (easyCount) {
        easyCount.textContent =
            Number(difficulty.Easy || 0);
    }

    if (mediumCount) {
        mediumCount.textContent =
            Number(difficulty.Medium || 0);
    }

    if (hardCount) {
        hardCount.textContent =
            Number(difficulty.Hard || 0);
    }

    if (totalTopicText) {
        totalTopicText.textContent =
            `${total} questions solved`;
    }

}


// =====================================================
// TOPIC SHORT NAME
// =====================================================

function getTopicShortName(topic) {

    const names = {

        Array: "AR",
        String: "ST",
        Recursion: "RE",
        Tree: "TR",
        Graph: "GR",
        HashMap: "HM"

    };

    return names[topic] || "DSA";

}


// =====================================================
// TOPIC COLORS
// =====================================================

function getTopicColor(topic) {

    const colors = {

        Array: "#635bff",
        String: "#3b82f6",
        Recursion: "#10b981",
        Tree: "#f59e0b",
        Graph: "#ec4899",
        HashMap: "#06b6d4"

    };

    return colors[topic] || "#635bff";

}


// =====================================================
// TOPIC PROGRESS
// =====================================================

function renderTopicProgress(topicProgress) {

    if (!topicProgressContainer) return;

    topicProgressContainer.innerHTML = "";

    if (
        !Array.isArray(topicProgress) ||
        topicProgress.length === 0
    ) {

        topicProgressContainer.innerHTML = `
            <div class="panel empty-state">
                No topic progress available yet.
            </div>
        `;

        return;

    }

    topicProgress.forEach(data => {

        const topic =
            data.topic || "Unknown";

        const solved =
            Number(
                data.solved ??
                data.completed ??
                0
            );

        const target =
            Number(
                data.target ??
                data.total ??
                0
            );

        const percentage =
            Math.min(
                Math.max(
                    Number(
                        data.progress ??
                        data.percentage ??
                        0
                    ),
                    0
                ),
                100
            );

        const item = document.createElement("div");

        item.className = "topic-card";

        const top = document.createElement("div");
        top.className = "topic-top";

        const nameBox = document.createElement("div");
        nameBox.className = "topic-name-box";

        const icon = document.createElement("div");
        icon.className = "topic-icon";
        icon.textContent = getTopicShortName(topic);

        const name = document.createElement("span");
        name.className = "topic-name";
        name.textContent = topic;

        nameBox.append(icon, name);

        const count = document.createElement("span");
        count.className = "topic-count";
        count.textContent = `${solved}/${target}`;

        top.append(nameBox, count);

        const progressBar = document.createElement("div");
        progressBar.className = "progress-bar";

        const progressFill = document.createElement("div");
        progressFill.className = "progress-fill";

        progressFill.style.width =
            `${percentage}%`;

        progressFill.style.background =
            getTopicColor(topic);

        progressBar.appendChild(progressFill);

        const bottom = document.createElement("div");
        bottom.className = "topic-bottom";

        bottom.textContent =
            `${percentage.toFixed(1)}% completed`;

        item.append(top, progressBar, bottom);

        topicProgressContainer.appendChild(item);

    });

}


// =====================================================
// WEAK TOPICS
// =====================================================

function renderWeakTopics(weakTopics) {

    if (!weakTopicContainer) return;

    weakTopicContainer.innerHTML = "";

    if (
        !Array.isArray(weakTopics) ||
        weakTopics.length === 0
    ) {

        weakTopicContainer.innerHTML = `
            <div class="empty-state">
                No weak topics available yet.
            </div>
        `;

        return;

    }

    weakTopics.forEach(data => {

        const topic =
            data.topic || "Unknown";

        const solved =
            Number(
                data.completed ??
                data.solved ??
                0
            );

        const target =
            Number(
                data.total ??
                data.target ??
                0
            );

        const percentage =
            Math.min(
                Math.max(
                    Number(
                        data.percentage ??
                        data.progress ??
                        0
                    ),
                    0
                ),
                100
            );

        const item = document.createElement("div");

        item.className = "weak-item";

        const icon = document.createElement("div");
        icon.className = "weak-icon";
        icon.textContent = "!";

        const content = document.createElement("div");
        content.className = "weak-content";

        const top = document.createElement("div");
        top.className = "weak-top";

        const name = document.createElement("span");
        name.className = "weak-name";
        name.textContent = topic;

        const count = document.createElement("span");
        count.className = "weak-count";
        count.textContent = `${solved}/${target}`;

        top.append(name, count);

        const progress = document.createElement("div");
        progress.className = "weak-progress";

        const fill = document.createElement("div");
        fill.className = "weak-progress-fill";

        fill.style.width = `${percentage}%`;

        progress.appendChild(fill);

        content.append(top, progress);

        const percent = document.createElement("span");
        percent.className = "weak-percent";

        percent.textContent =
            `${percentage.toFixed(1)}%`;

        item.append(icon, content, percent);

        weakTopicContainer.appendChild(item);

    });

}


// =====================================================
// DIFFICULTY ANALYSIS
// =====================================================

function renderDifficulty(difficultyData) {

    if (!difficultyContainer) return;

    difficultyContainer.innerHTML = "";

    const total =
        Number(analyticsData?.totalSolved || 0);

    const difficultyConfig = [

        {
            name: "Easy",
            className: "easyBar"
        },

        {
            name: "Medium",
            className: "mediumBar"
        },

        {
            name: "Hard",
            className: "hardBar"
        }

    ];

    difficultyConfig.forEach(item => {

        const count =
            Number(
                difficultyData?.[item.name] || 0
            );

        const percentage =
            total > 0
                ? Math.min(100, (count / total) * 100)
                : 0;

        const wrapper = document.createElement("div");
        wrapper.className = "difficulty-item";

        const header = document.createElement("div");
        header.className = "difficulty-header";

        const name = document.createElement("span");
        name.textContent = item.name;

        const value = document.createElement("span");

        value.textContent =
            `${count} (${percentage.toFixed(0)}%)`;

        header.append(name, value);

        const bar = document.createElement("div");
        bar.className = "difficulty-bar";

        const fill = document.createElement("div");

        fill.className =
            `difficulty-fill ${item.className}`;

        fill.style.width = `${percentage}%`;

        bar.appendChild(fill);

        wrapper.append(header, bar);

        difficultyContainer.appendChild(wrapper);

    });

}


// =====================================================
// RENDER DASHBOARD
// =====================================================

function renderDashboard() {

    if (!analyticsData) return;

    updateStats(analyticsData);

    updateProfile(analyticsData.user);

    renderNavigation(analyticsData.user);

    renderTopicProgress(
        analyticsData.topicProgress || []
    );

    renderWeakTopics(
        analyticsData.weakTopics || []
    );

    renderDifficulty(
        analyticsData.difficulty || {}
    );

    // Make analytics accessible elsewhere

    window.DSAAnalytics = analyticsData;

}


// =====================================================
// LOAD DASHBOARD
// =====================================================

async function loadDashboard() {

    try {

        const response =
            await fetchDSAAnalytics();

        if (
            !response ||
            response.success !== true
        ) {

            throw new Error(
                "Invalid DSA analytics response"
            );

        }

        /*
            Supports:

            {
                success: true,
                user: {...},
                data: {...}
            }

            Also supports direct analytics data.
        */

        analyticsData =
            response.data || response;

        analyticsData.user =
            response.user ||
            analyticsData.user ||
            null;

        console.log(
            "Loaded DSA Dashboard:",
            analyticsData
        );

        renderDashboard();

    } catch (error) {

        console.error(
            "DSA Dashboard Error:",
            error
        );

        if (topicProgressContainer) {

            topicProgressContainer.innerHTML = `
                <div class="panel empty-state">
                    Unable to load DSA data.
                    Please check your backend connection.
                </div>
            `;

        }

        if (weakTopicContainer) {

            weakTopicContainer.innerHTML = `
                <div class="empty-state">
                    Weak topics could not be loaded.
                </div>
            `;

        }

        if (difficultyContainer) {

            difficultyContainer.innerHTML = `
                <div class="empty-state">
                    Difficulty data could not be loaded.
                </div>
            `;

        }

    }

}


// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    loadDashboard
);