// =====================================================
// MERN DATA
// =====================================================

let mernData = {};


// =====================================================
// CURRENT STATE
// =====================================================

let currentTechnology = null;
let currentTopic = null;


// =====================================================
// API BASE URL
// =====================================================

const API_URL =
    "https://placement-preparation-tracker-ltlg.onrender.com";


// =====================================================
// FETCH DATA + USER PROGRESS
// =====================================================

async function fetchData() {

    try {

        // =================================================
        // GET LEARNING CONTENT
        // =================================================

        const contentResponse = await axios.get(
            `${API_URL}/api/mern/getData`,
            {
                withCredentials: true
            }
        );


        // =================================================
        // GET USER PROGRESS
        // =================================================

        const progressResponse = await axios.get(
            `${API_URL}/api/mern/getProgress`,
            {
                withCredentials: true
            }
        );


        console.log(
            "Learning Content:",
            contentResponse.data.learningContent
        );

        console.log(
            "User Progress:",
            progressResponse.data.progress
        );


        // =================================================
        // GET DATA
        // =================================================

        const learningContent =
            contentResponse.data.learningContent || [];


        const progress =
            progressResponse.data.progress || [];


        // =================================================
        // CREATE PROGRESS MAP
        // =================================================

        const progressMap = {};


        progress.forEach(function (item) {

            progressMap[
                String(item.topicId)
            ] = item.status;

        });


        console.log(
            "Progress Map:",
            progressMap
        );


        // =================================================
        // CREATE MERN DATA
        // =================================================

        mernData = {};


        learningContent.forEach(function (technology) {

            /*
                Backend se Topics capital T aa raha hai.
            */

            const topics =
                technology.Topics || [];


            mernData[
                technology.technology
            ] = topics.map(function (topic) {

                return {

                    // MongoDB topic _id
                    id: topic._id,

                    // Topic name
                    name: topic.title,

                    // User progress
                    status:
                        progressMap[
                            String(topic._id)
                        ] || "pending"

                };

            });

        });


        console.log(
            "MERN Data:",
            mernData
        );


        // =================================================
        // START UI
        // =================================================

        mainFuncion();


    } catch (error) {

        console.log(
            "Error while fetching MERN data:",
            error
        );

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

        console.log(
            "Topic ID:",
            topicId
        );

        console.log(
            "Status:",
            status
        );


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

        console.log(
            "Error while updating progress:",
            error
        );


        throw error;

    }

}



// =====================================================
// MAIN FUNCTION
// =====================================================

async function mainFuncion() {


    // =================================================
    // DOM ELEMENTS
    // =================================================

    const technologyContainer =
        document.querySelector(
            "#technologyContainer"
        );


    const topicsContainer =
        document.querySelector(
            "#topicsContainer"
        );


    const selectedTechnology =
        document.querySelector(
            "#selectedTechnology"
        );


    const statusModal =
        document.querySelector(
            "#statusModal"
        );


    const modalTopicName =
        document.querySelector(
            "#modalTopicName"
        );


    const closeModal =
        document.querySelector(
            "#closeModal"
        );


    const cancelStatus =
        document.querySelector(
            "#cancelStatus"
        );


    const saveStatus =
        document.querySelector(
            "#saveStatus"
        );


    const overallPercentage =
        document.querySelector(
            "#overallPercentage"
        );


    const overallProgressBar =
        document.querySelector(
            "#overallProgressBar"
        );



    // =================================================
    // RENDER TECHNOLOGIES
    // =================================================

    function renderTechnologies() {

        technologyContainer.innerHTML = "";


        Object.keys(mernData).forEach(
            function (technology) {


                const topics =
                    mernData[technology];


                // -----------------------------------------
                // COMPLETED COUNT
                // -----------------------------------------

                const completed =
                    topics.filter(
                        function (topic) {

                            return topic.status ===
                                "completed";

                        }
                    ).length;


                // -----------------------------------------
                // PERCENTAGE
                // -----------------------------------------

                const percentage =
                    topics.length === 0
                        ? 0
                        : Math.round(
                            (completed /
                                topics.length) *
                            100
                        );


                // -----------------------------------------
                // CARD
                // -----------------------------------------

                const card =
                    document.createElement(
                        "div"
                    );


                card.classList.add(
                    "techCard"
                );


                // Active technology

                if (
                    technology ===
                    currentTechnology
                ) {

                    card.classList.add(
                        "active"
                    );

                }


                // -----------------------------------------
                // CARD HTML
                // -----------------------------------------

                card.innerHTML = `

                    <div class="techTop">

                        <span class="techName">
                            ${technology}
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
                            style="
                                width:${percentage}%
                            "
                        ></div>

                    </div>

                `;


                // -----------------------------------------
                // TECHNOLOGY CLICK
                // -----------------------------------------

                card.addEventListener(
                    "click",
                    function () {

                        currentTechnology =
                            technology;

                        currentTopic =
                            null;


                        renderTechnologies();

                        renderTopics();

                    }
                );


                technologyContainer.appendChild(
                    card
                );

            }
        );

    }



    // =================================================
    // RENDER TOPICS
    // =================================================

    function renderTopics() {

        topicsContainer.innerHTML = "";


        // ---------------------------------------------
        // NO TECHNOLOGY SELECTED
        // ---------------------------------------------

        if (!currentTechnology) {

            selectedTechnology.textContent =
                "Select a Technology";


            topicsContainer.innerHTML = `

                <div class="emptyTopics">

                    Select a technology above

                </div>

            `;

            return;

        }


        // ---------------------------------------------
        // HEADING
        // ---------------------------------------------

        selectedTechnology.textContent =
            currentTechnology +
            " Topics";


        // ---------------------------------------------
        // GET TOPICS
        // ---------------------------------------------

        const topics =
            mernData[
                currentTechnology
            ];


        // ---------------------------------------------
        // CREATE TOPIC CARDS
        // ---------------------------------------------

        topics.forEach(
            function (topic) {


                const card =
                    document.createElement(
                        "div"
                    );


                card.classList.add(
                    "topicCard"
                );


                // -----------------------------------------
                // STATUS TEXT
                // -----------------------------------------

                let statusText;


                if (
                    topic.status ===
                    "completed"
                ) {

                    statusText =
                        "Completed";

                }

                else if (
                    topic.status ===
                    "progress"
                ) {

                    statusText =
                        "In Progress";

                }

                else {

                    statusText =
                        "Pending";

                }


                // -----------------------------------------
                // TOPIC CARD
                // -----------------------------------------

                card.innerHTML = `

                    <div class="topicTop">

                        <span class="topicName">
                            ${topic.name}
                        </span>

                        <span
                            class="status ${topic.status}"
                        >
                            ${statusText}
                        </span>

                    </div>


                    <p class="topicTechnology">
                        ${currentTechnology}
                    </p>

                `;


                // -----------------------------------------
                // TOPIC CLICK
                // -----------------------------------------

                card.addEventListener(
                    "click",
                    function () {

                        openStatusModal(
                            topic
                        );

                    }
                );


                topicsContainer.appendChild(
                    card
                );

            }
        );

    }



    // =================================================
    // OPEN STATUS MODAL
    // =================================================

    function openStatusModal(topic) {

        currentTopic =
            topic;


        console.log(
            "Current Topic:",
            currentTopic
        );


        console.log(
            "Topic ID:",
            currentTopic.id
        );


        // Topic name

        modalTopicName.textContent =
            topic.name;


        // ---------------------------------------------
        // REMOVE OLD RADIO SELECTION
        // ---------------------------------------------

        document
            .querySelectorAll(
                'input[name="topicStatus"]'
            )
            .forEach(
                function (radio) {

                    radio.checked = false;

                }
            );


        // ---------------------------------------------
        // SELECT CURRENT STATUS
        // ---------------------------------------------

        const radio =
            document.querySelector(
                `input[name="topicStatus"][value="${topic.status}"]`
            );


        if (radio) {

            radio.checked = true;

        }


        // ---------------------------------------------
        // SHOW MODAL
        // ---------------------------------------------

        statusModal.classList.add(
            "show"
        );

    }



    // =================================================
    // CLOSE STATUS MODAL
    // =================================================

    function closeStatusModal() {

        statusModal.classList.remove(
            "show"
        );


        currentTopic =
            null;

    }



    // =================================================
    // CLOSE BUTTON
    // =================================================

    closeModal.addEventListener(
        "click",
        closeStatusModal
    );



    // =================================================
    // CANCEL BUTTON
    // =================================================

    cancelStatus.addEventListener(
        "click",
        closeStatusModal
    );



    // =================================================
    // SAVE STATUS
    // =================================================

    saveStatus.addEventListener(
        "click",
        async function () {


            // -----------------------------------------
            // CHECK TOPIC
            // -----------------------------------------

            if (!currentTopic) {

                return;

            }


            // -----------------------------------------
            // GET SELECTED RADIO
            // -----------------------------------------

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


            // -----------------------------------------
            // SELECTED STATUS
            // -----------------------------------------

            const newStatus =
                selected.value;


            console.log(
                "Selected Status:",
                newStatus
            );


            // -----------------------------------------
            // TOPIC ID
            // -----------------------------------------

            const topicId =
                currentTopic.id;


            console.log(
                "Updating Topic:",
                topicId
            );


            try {


                // -------------------------------------
                // CALL BACKEND API
                // -------------------------------------

                await updateProgress(
                    topicId,
                    newStatus
                );


                // -------------------------------------
                // UPDATE FRONTEND DATA
                // -------------------------------------

                currentTopic.status =
                    newStatus;


                // -------------------------------------
                // CLOSE MODAL
                // -------------------------------------

                closeStatusModal();


                // -------------------------------------
                // REFRESH UI
                // -------------------------------------

                renderTopics();

                renderTechnologies();

                updateOverallProgress();


            } catch (error) {

                console.log(
                    "Unable to update progress:",
                    error
                );

            }

        }
    );



    // =================================================
    // OVERALL PROGRESS
    // =================================================

    function updateOverallProgress() {

        let total = 0;

        let completed = 0;


        // ---------------------------------------------
        // LOOP ALL TECHNOLOGIES
        // ---------------------------------------------

        Object.values(
            mernData
        ).forEach(
            function (topics) {


                total +=
                    topics.length;


                topics.forEach(
                    function (topic) {

                        if (
                            topic.status ===
                            "completed"
                        ) {

                            completed++;

                        }

                    }
                );

            }
        );


        // ---------------------------------------------
        // CALCULATE %
        // ---------------------------------------------

        const percentage =
            total === 0
                ? 0
                : Math.round(
                    (completed /
                        total) *
                    100
                );


        // ---------------------------------------------
        // UPDATE UI
        // ---------------------------------------------

        overallPercentage.textContent =
            percentage + "%";


        overallProgressBar.style.width =
            percentage + "%";

    }



    // =================================================
    // BACKDROP CLICK
    // =================================================

    statusModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                statusModal
            ) {

                closeStatusModal();

            }

        }
    );



    // =================================================
    // INITIAL UI
    // =================================================

    renderTechnologies();

    renderTopics();

    updateOverallProgress();

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



menuBtn.addEventListener(
    "click",
    function () {

        sidebar.classList.add(
            "open"
        );

        overlay.style.display =
            "block";

    }
);



overlay.addEventListener(
    "click",
    function () {

        sidebar.classList.remove(
            "open"
        );

        overlay.style.display =
            "none";

    }
);



// =====================================================
// CLOSE SIDEBAR AFTER LINK CLICK
// =====================================================

const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


navLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function () {

                if (
                    window.innerWidth <=
                    768
                ) {

                    sidebar.classList.remove(
                        "open"
                    );

                    overlay.style.display =
                        "none";

                }

            }
        );

    }
);



// =====================================================
// DARK MODE
// =====================================================

const themeBtn =
    document.querySelector(
        "#themeBtn"
    );



themeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


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



// =====================================================
// LOAD SAVED THEME
// =====================================================

const savedTheme =
    localStorage.getItem(
        "theme"
    );


if (
    savedTheme ===
    "dark"
) {

    document.body.classList.add(
        "dark"
    );


    themeBtn.textContent =
        "☀️";

}



// =====================================================
// START
// =====================================================

fetchData();