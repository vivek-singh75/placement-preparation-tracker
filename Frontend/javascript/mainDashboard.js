// =====================================================
// MAIN DASHBOARD
// =====================================================

const API_URL = "http://localhost:3000";

let dashboardData = null;


// =====================================================
// DOM
// =====================================================

const sidebar = document.querySelector("#sidebar");
const menuBtn = document.querySelector("#menuBtn");
const overlay = document.querySelector("#overlay");

const technologyNavigation =
    document.querySelector("#technologyNavigation");

const skillsContainer =
    document.querySelector("#skillsContainer");

const progressLegend =
    document.querySelector("#progressLegend");

const weakTopics =
    document.querySelector("#weakTopics");

const recentActivity =
    document.querySelector("#recentActivity");

const quickActions =
    document.querySelector("#quickActions");


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


// =====================================================
// GET DASHBOARD DATA
// =====================================================

async function fetchDashboard() {

    try {

        const response = await axios.get(
            `${API_URL}/api/dashboard/`,
            {
                withCredentials: true
            }
        );

        console.log("Dashboard API:", response.data);

        return response.data;

    } catch (error) {

        console.error("Dashboard API Error:", error);

        throw error;

    }

}


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
        user.username ||
        "user";

    const firstLetter =
        name.charAt(0).toUpperCase();


    const headerName =
        document.querySelector("#headerName");

    const headerUsername =
        document.querySelector("#headerUsername");

    const headerAvatar =
        document.querySelector("#headerAvatar");

    const sidebarName =
        document.querySelector("#sidebarName");

    const sidebarUsername =
        document.querySelector("#sidebarUsername");

    const sidebarAvatar =
        document.querySelector("#sidebarAvatar");

    const welcomeName =
        document.querySelector("#welcomeName");


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

    if (welcomeName) {

        welcomeName.innerHTML = `
            Let's continue your
            <span>preparation.</span>
        `;

    }

}


// =====================================================
// OVERVIEW STATS
// =====================================================

function renderStats() {

    if (!dashboardData) return;

    const stats = dashboardData.stats || {};
    const overall = dashboardData.overall || {};
    const skills = dashboardData.skills || [];


    // OVERALL

    const overallPercentage =
        Number(overall.percentage || 0);

    const overallText =
        document.querySelector("#overallPercentage");

    const overallBar =
        document.querySelector("#overallBar");


    if (overallText) {
        overallText.textContent = `${overallPercentage}%`;
    }

    if (overallBar) {
        overallBar.style.width =
            `${Math.min(overallPercentage, 100)}%`;
    }


    // DSA

    const solved =
        Number(stats.questionsSolved || 0);

    const total =
        Number(stats.totalQuestions || 0);

    const questionPercentage =
        Number(stats.questionPercentage || 0);

    const solvedElement =
        document.querySelector("#solvedQuestions");

    const totalElement =
        document.querySelector("#totalQuestions");

    const dsaBar =
        document.querySelector("#dsaBar");


    if (solvedElement) {
        solvedElement.textContent = solved;
    }

    if (totalElement) {
        totalElement.textContent = ` / ${total}`;
    }

    if (dsaBar) {
        dsaBar.style.width =
            `${Math.min(questionPercentage, 100)}%`;
    }


    // STREAK

    const streakElement =
        document.querySelector("#currentStreak");

    if (streakElement) {

        streakElement.textContent =
            Number(stats.currentStreak || 0);

    }


    // ACTIVE TRACKS

    const activeTracks =
        document.querySelector("#activeTracks");

    const technologies =
        dashboardData.user?.technologies || [];

    const trackCount =
        skills.length > 0
            ? skills.length
            : 1 + technologies.length;

    if (activeTracks) {
        activeTracks.textContent = trackCount;
    }

}


// =====================================================
// PREPARATION TRACKS
// =====================================================

function renderSkills() {

    if (!skillsContainer) return;

    skillsContainer.innerHTML = "";

    const skills = dashboardData?.skills || [];


    if (skills.length === 0) {

        skillsContainer.innerHTML = `

            <div class="panel">

                <div class="empty-state">
                    No preparation tracks available.
                </div>

            </div>

        `;

        return;

    }


    skills.forEach(skill => {

        const name = skill.name || "Unknown";

        const completed =
            Number(skill.completed || 0);

        const total =
            Number(skill.total || 0);

        const percentage =
            Number(skill.percentage || 0);

        const icon = getSkillIcon(name);


        const card = document.createElement("div");

        card.className = "skill-card";

        card.innerHTML = `

            <div class="skill-card-top">

                <div class="skill-info">

                    <div class="skill-icon">
                        ${icon}
                    </div>

                    <div>

                        <div class="skill-name">
                            ${escapeHTML(name)}
                        </div>

                        <div class="skill-count">
                            ${completed} / ${total}
                            completed
                        </div>

                    </div>

                </div>

                <div class="skill-percent">
                    ${percentage}%
                </div>

            </div>

            <div class="skill-progress">

                <div
                    class="skill-progress-fill"
                    style="width:${Math.min(percentage, 100)}%"
                ></div>

            </div>

        `;

        skillsContainer.appendChild(card);

    });

}


// =====================================================
// SKILL ICON
// =====================================================

function getSkillIcon(name) {

    const icons = {

        DSA: "DS",
        MERN: "M",
        "Spring Boot": "SB",
        "AI/ML": "AI",
        "Data Science": "DS",
        "Cyber Security": "CS",
        "App Development": "AD"

    };

    return icons[name] || "P";

}


// =====================================================
// SIDEBAR TECHNOLOGIES
// =====================================================

function renderTechnologyNavigation() {

    if (!technologyNavigation) return;

    technologyNavigation.innerHTML = "";

    const technologies =
        dashboardData?.user?.technologies || [];


    if (technologies.length === 0) return;


    technologies.forEach(technology => {

        const link = document.createElement("a");

        link.className = "nav-item";

        link.href = getTechnologyRoute(technology);

        link.innerHTML = `

            <span class="nav-icon">
                ${getSkillIcon(technology)}
            </span>

            <span>
                ${escapeHTML(technology)}
            </span>

        `;

        technologyNavigation.appendChild(link);

    });

}


// =====================================================
// TECHNOLOGY ROUTES
// =====================================================

function getTechnologyRoute(technology) {

    const routes = {

        "MERN": "../html/mern.html",
        "Spring Boot": "/spring-boot",
        "AI/ML": "/ai-ml",
        "Data Science": "/data-science",
        "Cyber Security": "/cyber-security",
        "App Development": "/app-development"

    };

    return routes[technology] || "#";

}


// =====================================================
// OVERALL BREAKDOWN
// =====================================================

function renderOverallBreakdown() {

    if (!progressLegend) return;

    progressLegend.innerHTML = "";

    const breakdown =
        dashboardData?.overall?.breakdown || [];


    if (breakdown.length === 0) {

        progressLegend.innerHTML = `

            <div class="empty-state">
                No breakdown available.
            </div>

        `;

        return;

    }


    breakdown.forEach((item, index) => {

        const name = item.name || "Unknown";

        const percentage =
            Number(item.percentage || 0);

        const legend =
            document.createElement("div");

        legend.className = "legend-item";

        legend.innerHTML = `

            <div
                class="legend-dot"
                style="background:${getLegendColor(index)}"
            ></div>

            <div class="legend-content">

                <div class="legend-name">

                    <span>
                        ${escapeHTML(name)}
                    </span>

                    <span class="legend-count">
                        ${percentage}%
                    </span>

                </div>

                <div class="skill-progress">

                    <div
                        class="skill-progress-fill"
                        style="
                            width:${Math.min(percentage, 100)}%;
                            background:${getLegendColor(index)};
                        "
                    ></div>

                </div>

            </div>

        `;

        progressLegend.appendChild(legend);

    });


    // CIRCLE

    const percentage =
        Number(dashboardData?.overall?.percentage || 0);

    const circle =
        document.querySelector(".progress-circle");

    const circlePercentage =
        document.querySelector("#circlePercentage");


    if (circlePercentage) {
        circlePercentage.textContent = `${percentage}%`;
    }

    if (circle) {

        circle.style.background = `
            conic-gradient(
                var(--primary) ${percentage * 3.6}deg,
                #eeeeF3 ${percentage * 3.6}deg
            )
        `;

    }

}


// =====================================================
// LEGEND COLORS
// =====================================================

function getLegendColor(index) {

    const colors = [

        "#635bff",
        "#3b82f6",
        "#10b981",
        "#f59e0b",
        "#ec4899",
        "#06b6d4"

    ];

    return colors[index % colors.length];

}


// =====================================================
// FOCUS AREAS
// =====================================================

function renderWeakTopics() {

    if (!weakTopics) return;

    weakTopics.innerHTML = "";

    const topics =
        dashboardData?.weakTopics || [];


    if (topics.length === 0) {

        weakTopics.innerHTML = `

            <div class="empty-state">

                ✓

                <br><br>

                No weak areas found.

            </div>

        `;

        return;

    }


    topics.forEach(topic => {

        const name =
            topic.topic ||
            topic.name ||
            "Unknown";

        const completed =
            Number(topic.completed || 0);

        const total =
            Number(topic.total || 0);

        const percentage =
            Number(topic.percentage || 0);


        const item =
            document.createElement("div");

        item.className = "focus-item";

        item.innerHTML = `

            <div class="focus-icon">
                !
            </div>

            <div class="focus-content">

                <div class="focus-name">
                    ${escapeHTML(name)}
                </div>

                <div class="focus-progress">
                    ${completed} / ${total}
                    completed
                </div>

            </div>

            <div class="focus-percent">
                ${percentage}%
            </div>

        `;

        weakTopics.appendChild(item);

    });

}


// =====================================================
// RECENT ACTIVITY
// =====================================================

function renderRecentActivity() {

    if (!recentActivity) return;

    recentActivity.innerHTML = "";

    const activities =
        dashboardData?.recentActivity || [];


    if (activities.length === 0) {

        recentActivity.innerHTML = `

            <div class="empty-state">

                <div style="font-size:24px;">
                    📝
                </div>

                <br>

                No recent activity yet.

                <br>

                Start preparing to see your activity here.

            </div>

        `;

        return;

    }


    activities.forEach(activity => {

        const item =
            document.createElement("div");

        item.className = "activity-item";


        const type =
            activity.type || "Preparation";

        const title =
            activity.title || "Preparation activity";

        const topic =
            activity.topic || "";

        const status =
            activity.status || "completed";

        const date =
            formatDate(activity.createdAt);


        item.innerHTML = `

            <div class="activity-icon">
                ${getSkillIcon(type)}
            </div>

            <div class="activity-content">

                <div class="activity-title">
                    ${escapeHTML(title)}
                </div>

                <div class="activity-meta">

                    ${escapeHTML(type)}

                    ${topic
                        ? ` • ${escapeHTML(topic)}`
                        : ""
                    }

                    ${date
                        ? ` • ${date}`
                        : ""
                    }

                </div>

            </div>

            <div class="activity-status">

                ${escapeHTML(formatStatus(status))}

            </div>

        `;

        recentActivity.appendChild(item);

    });

}


// =====================================================
// QUICK ACTIONS
// =====================================================

function renderQuickActions() {

    if (!quickActions) return;

    quickActions.innerHTML = "";

    const skills =
        dashboardData?.skills || [];


    if (skills.length === 0) return;


    const sortedSkills =
        [...skills]
            .sort(
                (a, b) =>
                    Number(a.percentage || 0) -
                    Number(b.percentage || 0)
            )
            .slice(0, 3);


    sortedSkills.forEach(skill => {

        const name =
            skill.name || "Preparation";


        const card =
            document.createElement("a");

        card.className = "quick-action";

        card.href = getSkillRoute(name);

        card.innerHTML = `

            <div class="quick-action-icon">
                ${getSkillIcon(name)}
            </div>

            <div class="quick-action-content">

                <div class="quick-action-title">
                    Continue ${escapeHTML(name)}
                </div>

                <div class="quick-action-description">
                    ${Number(skill.percentage || 0)}% completed
                </div>

            </div>

        `;

        quickActions.appendChild(card);

    });

}


// =====================================================
// SKILL ROUTE
// =====================================================

function getSkillRoute(name) {

    if (name === "DSA") {
        return "dashboardOfDsa.html";
    }

    return getTechnologyRoute(name);

}


// =====================================================
// CONTINUE PREPARATION
// =====================================================

function continuePreparation() {

    const skills =
        dashboardData?.skills || [];


    if (skills.length === 0) return;


    const nextSkill =
        [...skills]
            .sort(
                (a, b) =>
                    Number(a.percentage || 0) -
                    Number(b.percentage || 0)
            )[0];


    if (nextSkill) {

        window.location.href =
            getSkillRoute(nextSkill.name);

    }

}


// =====================================================
// CONTINUE BUTTON
// =====================================================

document
    .querySelector("#continueBtn")
    ?.addEventListener(
        "click",
        continuePreparation
    );


// =====================================================
// DATE FORMAT
// =====================================================

function formatDate(dateValue) {

    if (!dateValue) return "";

    const date = new Date(dateValue);


    if (Number.isNaN(date.getTime())) {
        return "";
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// =====================================================
// STATUS
// =====================================================

function formatStatus(status) {

    if (!status) return "Completed";

    const value =
        String(status).toLowerCase();


    if (value === "completed") {
        return "Completed";
    }

    if (value === "progress") {
        return "In Progress";
    }

    return status;

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    const element =
        document.createElement("div");

    element.textContent = value ?? "";

    return element.innerHTML;

}


// =====================================================
// RENDER EVERYTHING
// =====================================================

function renderDashboard() {

    if (!dashboardData) return;

    renderProfile(dashboardData.user);

    renderStats();

    renderSkills();

    renderTechnologyNavigation();

    renderOverallBreakdown();

    renderWeakTopics();

    renderRecentActivity();

    renderQuickActions();

}


// =====================================================
// LOAD
// =====================================================

async function loadDashboard() {

    try {

        const data = await fetchDashboard();


        if (!data || data.success !== true) {

            throw new Error(
                "Invalid dashboard response"
            );

        }


        dashboardData = data;

        console.log("Dashboard Data:", dashboardData);

        renderDashboard();


    } catch (error) {

        console.error(
            "Failed to load dashboard:",
            error
        );


        if (skillsContainer) {

            skillsContainer.innerHTML = `

                <div class="panel">

                    <div class="empty-state">

                        Unable to load dashboard data.

                        <br><br>

                        Please check whether the backend
                        server is running.

                    </div>

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
    () => {

        loadDashboard();

    }
);