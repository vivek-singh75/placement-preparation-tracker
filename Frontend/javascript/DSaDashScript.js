// =====================================================
// GET DATA FROM BACKEND
// =====================================================

let Gdata = [];
let userData = null;

// =====================================================
// FETCH USER + QUESTION DATA
// =====================================================

async function getQuestion() {

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
        // API data fetch hone ke baad hi dashboard render hoga
        renderDashboard();

    } catch (error) {

        console.log(
            "Error in frontend:",
            error
        );

    }
}


// =====================================================
// CONSTANT DATA
// =====================================================

const topics = [
    "Array",
    "String",
    "Recursion",
    "Tree",
    "Graph",
    "HashMap"
];


const topicColors = {

    Array: {
        iconClass: "topicArray",
        barColor: "#7c3aed"
    },

    String: {
        iconClass: "topicString",
        barColor: "#2563eb"
    },

    Recursion: {
        iconClass: "topicRecursion",
        barColor: "#059669"
    },

    Tree: {
        iconClass: "topicTree",
        barColor: "#ea580c"
    },

    Graph: {
        iconClass: "topicGraph",
        barColor: "#db2777"
    },

    HashMap: {
        iconClass: "topicHashMap",
        barColor: "#0891b2"
    }

};


const difficulties = [
    "Easy",
    "Medium",
    "Hard"
];


// =====================================================
// ELEMENTS
// =====================================================

const totalSolvedElement =
    document.querySelector("#totalSolved");

const easyCountElement =
    document.querySelector("#easyCount");

const mediumCountElement =
    document.querySelector("#mediumCount");

const hardCountElement =
    document.querySelector("#hardCount");

const totalTopicText =
    document.querySelector("#totalTopicText");

const topicProgressContainer =
    document.querySelector(
        "#topicProgressContainer"
    );

const recentActivityContainer =
    document.querySelector(
        "#recentActivityContainer"
    );

const weakTopicContainer =
    document.querySelector(
        "#weakTopicContainer"
    );

const difficultyContainer =
    document.querySelector(
        "#difficultyContainer"
    );

const platformContainer =
    document.querySelector(
        "#platformContainer"
    );

const topicTableBody =
    document.querySelector(
        "#topicTableBody"
    );


// =====================================================
// TOPIC COUNTS
// =====================================================

function getTopicCounts() {

    const counts = {};

    topics.forEach(topic => {
        counts[topic] = 0;
    });


    Gdata.forEach(question => {

        const type =
            question.topic;

        if (
            Object.prototype.hasOwnProperty.call(
                counts,
                type
            )
        ) {

            counts[type]++;

        }

    });


    return counts;
}


// =====================================================
// DIFFICULTY COUNTS
// =====================================================

function getDifficultyCounts() {

    const counts = {

        Easy: 0,
        Medium: 0,
        Hard: 0

    };


    Gdata.forEach(question => {

        const level =
            question.Difficulty_Level;

        if (
            Object.prototype.hasOwnProperty.call(
                counts,
                level
            )
        ) {

            counts[level]++;

        }

    });


    return counts;
}


// =====================================================
// TOTAL STATS
// =====================================================

function updateStats(difficultyCounts) {

    totalSolvedElement.textContent =
        Gdata.length;


    easyCountElement.textContent =
        difficultyCounts.Easy;


    mediumCountElement.textContent =
        difficultyCounts.Medium;


    hardCountElement.textContent =
        difficultyCounts.Hard;


    totalTopicText.textContent =
        `${Gdata.length} questions`;
}


// =====================================================
// TOPIC PROGRESS
// =====================================================

function renderTopicProgress(topicCounts) {

    topicProgressContainer.innerHTML = "";


    const maxCount =
        Math.max(
            ...Object.values(topicCounts),
            1
        );


    topics.forEach(topic => {

        const count =
            topicCounts[topic];


        const percentage =
            Math.round(
                (count / maxCount) * 100
            );


        const color =
            topicColors[topic];


        const card =
            document.createElement("div");


        card.classList.add(
            "topicCard"
        );


        card.innerHTML = `

            <div class="topicTop">

                <div class="topicNameBox">

                    <div
                        class="topicIcon ${color.iconClass}"
                    >
                        ${topic.substring(0, 2)}
                    </div>

                    <span class="topicName">
                        ${topic}
                    </span>

                </div>

                <span class="topicCount">
                    ${count}
                </span>

            </div>


            <div class="progressBar">

                <div
                    class="progressFill"
                    style="
                        width: ${percentage}%;
                        background: ${color.barColor};
                    "
                ></div>

            </div>


            <p class="topicBottom">
                ${count} questions solved
            </p>

        `;


        topicProgressContainer.appendChild(
            card
        );

    });

}


// =====================================================
// RECENT ACTIVITY
// =====================================================

function renderRecentActivity() {

    recentActivityContainer.innerHTML = "";


    if (Gdata.length === 0) {

        recentActivityContainer.innerHTML = `

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


    const recentQuestions =
        Gdata
            .slice(-5)
            .reverse();


    recentQuestions.forEach(
        (question) => {

            const item =
                document.createElement("div");


            item.classList.add(
                "activityItem"
            );


            item.innerHTML = `

                <div class="activityIcon">
                    ✓
                </div>


                <div class="activityContent">

                    <p class="activityTitle">
                        ${question.questionName || "Unnamed Question"}
                    </p>


                    <p class="activityMeta">
                        ${question.topic || "Unknown"}
                        •
                        ${question.Difficulty_Level || "Unknown"}
                    </p>

                </div>


                <span class="activityStatus">
                    Solved
                </span>

            `;


            recentActivityContainer.appendChild(
                item
            );

        }
    );

}


// =====================================================
// WEAK TOPICS
// =====================================================

function renderWeakTopics(topicCounts) {

    weakTopicContainer.innerHTML =
        "";


    const sortedTopics =
        topics
            .map(topic => {

                return {

                    type: topic,
                    count: topicCounts[topic]

                };

            })
            .sort(
                (a, b) =>
                    a.count - b.count
            );


    const weakTopics =
        sortedTopics.slice(0, 3);


    const maxCount =
        Math.max(
            ...Object.values(topicCounts),
            1
        );


    weakTopics.forEach(
        ({ type, count }) => {

            const percentage =
                Math.round(
                    (count / maxCount) * 100
                );


            const item =
                document.createElement("div");


            item.classList.add(
                "weakItem"
            );


            item.innerHTML = `

                <div class="weakIcon">
                    !
                </div>


                <div class="weakContent">

                    <div class="weakTop">

                        <span class="weakName">
                            ${type}
                        </span>

                        <span class="weakCount">
                            ${count}
                        </span>

                    </div>


                    <div class="weakProgress">

                        <div
                            class="weakProgressFill"
                            style="
                                width: ${Math.max(
                                    percentage,
                                    5
                                )}%;
                            "
                        ></div>

                    </div>

                </div>


                <button
                    class="practiceBtn"
                >
                    Practice
                </button>

            `;


            weakTopicContainer.appendChild(
                item
            );

        }
    );

}


// =====================================================
// DIFFICULTY ANALYSIS
// =====================================================

function renderDifficulty(difficultyCounts) {

    difficultyContainer.innerHTML =
        "";


    const total =
        Gdata.length;


    difficulties.forEach(
        difficulty => {

            const count =
                difficultyCounts[
                    difficulty
                ];


            const percentage =
                total === 0
                    ? 0
                    : Math.round(
                        (count / total) * 100
                    );


            let barClass =
                "easyBar";


            if (
                difficulty === "Medium"
            ) {

                barClass =
                    "mediumBar";

            }


            if (
                difficulty === "Hard"
            ) {

                barClass =
                    "hardBar";

            }


            const item =
                document.createElement("div");


            item.classList.add(
                "difficultyItem"
            );


            item.innerHTML = `

                <div class="difficultyHeader">

                    <span>
                        ${difficulty}
                    </span>

                    <span>
                        ${count}
                        (${percentage}%)
                    </span>

                </div>


                <div class="difficultyBar">

                    <div
                        class="
                            difficultyFill
                            ${barClass}
                        "
                        style="
                            width: ${percentage}%;
                        "
                    ></div>

                </div>

            `;


            difficultyContainer.appendChild(
                item
            );

        }
    );

}


// =====================================================
// PLATFORM ANALYSIS
// =====================================================

function getPlatformCounts() {

    const counts = {

        leetcode: 0,
        codechef: 0,
        gfg: 0,
        hackerrank: 0,
        others: 0

    };


    Gdata.forEach(question => {

        const platform =
            (
                question.Platform || ""
            )
                .toLowerCase()
                .trim();


        if (
            platform === "leetcode"
        ) {

            counts.leetcode++;

        }


        else if (
            platform === "codechef"
        ) {

            counts.codechef++;

        }


        else if (
            platform === "gfg" ||
            platform === "geeksforgeeks" ||
            platform === "geeks for geeks"
        ) {

            counts.gfg++;

        }


        else if (
            platform === "hackerrank"
        ) {

            counts.hackerrank++;

        }


        else {

            counts.others++;

        }

    });


    return counts;
}


// =====================================================
// RENDER PLATFORMS
// =====================================================

function renderPlatforms(platformCounts) {

    platformContainer.innerHTML =
        "";


    const platforms = [

        {
            name: "LeetCode",
            key: "leetcode",
            icon: "⚡"
        },

        {
            name: "CodeChef",
            key: "codechef",
            icon: "🏆"
        },

        {
            name: "GeeksForGeeks",
            key: "gfg",
            icon: "💻"
        },

        {
            name: "HackerRank",
            key: "hackerrank",
            icon: "◆"
        },

        {
            name: "Others",
            key: "others",
            icon: "•••"
        }

    ];


    platforms.forEach(platform => {

        const card =
            document.createElement("div");


        card.classList.add(
            "platformCard"
        );


        card.innerHTML = `

            <div class="platformIcon">
                ${platform.icon}
            </div>


            <div>

                <p class="platformName">
                    ${platform.name}
                </p>

                <p class="platformCount">
                    ${
                        platformCounts[
                            platform.key
                        ]
                    }
                </p>

            </div>

        `;


        platformContainer.appendChild(
            card
        );

    });

}


// =====================================================
// TOPIC TABLE
// =====================================================

function renderTopicTable(topicCounts) {

    topicTableBody.innerHTML =
        "";


    const maxCount =
        Math.max(
            ...Object.values(topicCounts),
            1
        );


    topics.forEach(topic => {

        const count =
            topicCounts[topic];


        const percentage =
            Math.round(
                (count / maxCount) * 100
            );


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${topic}
            </td>

            <td>
                ${count}
            </td>

            <td>

                <div class="tableProgress">

                    <div
                        class="tableProgressFill"
                        style="
                            width: ${percentage}%;
                        "
                    ></div>

                </div>

            </td>

        `;


        topicTableBody.appendChild(
            row
        );

    });

}

function profile(){
    // Profile data
    document.querySelector(".profileName").textContent =
        userData.name;

    document.querySelector(".profileAvatar").textContent =
        userData.name.charAt(0).toUpperCase();
}  
  


// =====================================================
// RENDER COMPLETE DASHBOARD
// =====================================================

function renderDashboard() {

    // API se data aa chuka hai
    // Ab counts calculate karo
    profile()


    const topicCounts =
        getTopicCounts();


    const difficultyCounts =
        getDifficultyCounts();


    const platformCounts =
        getPlatformCounts();


    // Render everything

    updateStats(
        difficultyCounts
    );


    renderTopicProgress(
        topicCounts
    );


    renderRecentActivity();


    renderWeakTopics(
        topicCounts
    );


    renderDifficulty(
        difficultyCounts
    );


    renderPlatforms(
        platformCounts
    );


    renderTopicTable(
        topicCounts
    );

}


// =====================================================
// MOBILE SIDEBAR
// =====================================================

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


if (menuBtn) {

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

}


if (overlay) {

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


// =====================================================
// CLOSE SIDEBAR WHEN CLICKING NAV
// =====================================================

document
    .querySelectorAll(".navItem")
    .forEach(item => {

        item.addEventListener(
            "click",
            () => {

                if (
                    window.innerWidth <= 768
                ) {

                    sidebar.classList.remove(
                        "open"
                    );

                    overlay.style.display =
                        "none";

                }

            }
        );

    });


// =====================================================
// DARK MODE
// =====================================================

const themeBtn =
    document.querySelector(
        "#themeBtn"
    );


function updateThemeIcon() {

    if (
        document.body.classList.contains(
            "dark"
        )
    ) {

        themeBtn.textContent =
            "☀️";

    }

    else {

        themeBtn.textContent =
            "🌙";

    }

}


if (themeBtn) {

    themeBtn.addEventListener(
        "click",
        () => {
            document.body.classList.toggle(
                "dark"
            );
            const isDark =
                document.body.classList.contains(
                    "dark"
                );
            localStorage.setItem(
                "theme",
                isDark
                    ? "dark"
                    : "light"
            );

            updateThemeIcon();

        }
    );

}


// =====================================================
// LOAD SAVED THEME
// =====================================================

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
}
if (themeBtn) {
    updateThemeIcon();
}

// =====================================================
// SEARCH
// =====================================================

const searchInput =
    document.querySelector(
        "#searchInput"
    );
if (searchInput) {
    searchInput.addEventListener(
        "input",
        () => {
             const search =
                searchInput.value
                    .toLowerCase()
                    .trim();

            const activityItems =
                document.querySelectorAll(
                    ".activityItem"
                );

            activityItems.forEach(item => {

                const text =
                    item.textContent
                        .toLowerCase();

                if (
                    text.includes(search)
                ) {

                    item.style.display =
                        "flex";

                }

                else {

                    item.style.display =
                        "none";

                }
            });
        }
    );
}


// =====================================================
// START APPLICATION
// =====================================================

// IMPORTANT:
// Dashboard start from here.
// after completing getquestion  
// renderDashboard( )is called.

getQuestion();