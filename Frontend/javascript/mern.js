//========== FETCH DATA USING API ======

let mernData

// async function updateProgress(topicId, status) {
//     try {

//         const update = await axios.post(`http://localhost:3000/api/mern/updateProgress/${topicId}`,
//             {
//             status: status
//             },  
//             {
//                 withCredentials : true
//             })
//     } catch (error) {
//         console.log(`error while updating progress ${error}`)
//     }
    

// }

// async function fetchData() {
//     try {
//         const response =await axios.get("http://localhost:3000/api/mern/getData", {
//             withCredentials: true
//         })

//         const learningContent = response.data.learningContent;

//         mernData = {};

//         learningContent.forEach((technology) => {

//             mernData[technology.technology] = technology.Topics.map(
//                 (topic) => ({
//                     id: topic._id,
//                     name: topic.title,
//                     status: "pending"
//                 })
//             );

//         });

//         console.log("mernData:", mernData);

//         // console.log(mernData)
//         mainFuncion()
//     } catch (error) {
//         console.log(`error in fetch mern data api ${error}`)
//     }
    
// }

// ================= UPDATE PROGRESS =================


async function updateProgress(topicId, status) {
    try {

        const response = await axios.post(
            `https://placement-preparation-tracker-ltlg.onrender.com/api/mern/updateProgress/${topicId}`,
            {
                status: status
            },
            {
                withCredentials: true
            }
        );

        console.log("Progress updated:", response.data);

        return response.data;

    } catch (error) {

        console.log(
            "Error while updating progress:",
            error
        );

        throw error;
    }
}


// ================= FETCH DATA + PROGRESS =================

async function fetchData() {
    try {

        // -------- Learning Content --------

        const contentResponse = await axios.get(
            "https://placement-preparation-tracker-ltlg.onrender.com/api/mern/getData",
            {
                withCredentials: true
            }
        );


        // -------- User Progress --------

        const progressResponse = await axios.get(
            "https://placement-preparation-tracker-ltlg.onrender.com/api/mern/getProgress",
            {
                withCredentials: true
            }
        );


        const learningContent =
            contentResponse.data.learningContent;

        const progress =
            progressResponse.data.progress;


        // ================= PROGRESS MAP =================

        const progressMap = {};

        progress.forEach((item) => {

            progressMap[String(item.topicId)] = item.status;

        });


        // ================= MERN DATA =================

        mernData = {};

        learningContent.forEach((technology) => {

            mernData[technology.technology] =
                technology.Topics.map((topic) => {

                    return {
                        id: topic._id,

                        name: topic.title,

                        status:
                            progressMap[String(topic._id)] ||
                            "pending"
                    };

                });

        });


        // console.log("Progress:", progress);
        // console.log("Progress Map:", progressMap);
        // console.log("MERN Data:", mernData);


        // ================= START UI =================

        mainFuncion();


    } catch (error) {

        console.log(
            "Error while fetching MERN data or progress:",
            error
        );

    }
}


// ================= INITIAL LOAD =================

fetchData()

// ================= DUMMY DATA =================

// const mernData = {
//     MongoDB: [
//         {
//             id: 1,
//             name: "MongoDB Introduction",
//             status: "completed"
//         },
//         {
//             id: 2,
//             name: "Database & Collections",
//             status: "completed"
//         },
//         {
//             id: 3,
//             name: "CRUD Operations",
//             status: "progress"
//         },
//         {
//             id: 4,
//             name: "MongoDB Schema",
//             status: "pending"
//         },
//         {
//             id: 5,
//             name: "Aggregation",
//             status: "pending"
//         }
//     ],

//     Express: [
//         {
//             id: 6,
//             name: "Express Introduction",
//             status: "completed"
//         },
//         {
//             id: 7,
//             name: "Routing",
//             status: "completed"
//         },
//         {
//             id: 8,
//             name: "Middleware",
//             status: "progress"
//         },
//         {
//             id: 9,
//             name: "Error Handling",
//             status: "pending"
//         },
//         {
//             id: 10,
//             name: "Authentication",
//             status: "pending"
//         }
//     ],

//     React: [
//         {
//             id: 11,
//             name: "React Introduction",
//             status: "completed"
//         },
//         {
//             id: 12,
//             name: "Components",
//             status: "completed"
//         },
//         {
//             id: 13,
//             name: "Props",
//             status: "completed"
//         },
//         {
//             id: 14,
//             name: "useState",
//             status: "progress"
//         },
//         {
//             id: 15,
//             name: "useEffect",
//             status: "pending"
//         }
//     ],

//     "Node.js": [
//         {
//             id: 16,
//             name: "Node.js Introduction",
//             status: "completed"
//         },
//         {
//             id: 17,
//             name: "Modules",
//             status: "completed"
//         },
//         {
//             id: 18,
//             name: "File System",
//             status: "progress"
//         },
//         {
//             id: 19,
//             name: "HTTP Module",
//             status: "pending"
//         },
//         {
//             id: 20,
//             name: "Authentication",
//             status: "pending"
//         }
//     ],
//     "mode.js": [
//         {
//             id: 16,
//             name: "Node.js Introduction",
//             status: "completed"
//         },
//         {
//             id: 17,
//             name: "Modules",
//             status: "completed"
//         },
//         {
//             id: 18,
//             name: "File System",
//             status: "progress"
//         },
//         {
//             id: 19,
//             name: "HTTP Module",
//             status: "pending"
//         },
//         {
//             id: 20,
//             name: "Authentication",
//             status: "pending"
//         }
//     ]
// };


async function mainFuncion() {
    
// ================= DOM ELEMENTS =================

    const technologyContainer =
        document.querySelector("#technologyContainer");

    const topicsContainer =
        document.querySelector("#topicsContainer");

    const selectedTechnology =
        document.querySelector("#selectedTechnology");

    const statusModal =
        document.querySelector("#statusModal");

    const modalTopicName =
        document.querySelector("#modalTopicName");

    const closeModal =
        document.querySelector("#closeModal");

    const cancelStatus =
        document.querySelector("#cancelStatus");

    const saveStatus =
        document.querySelector("#saveStatus");

    const overallPercentage =
        document.querySelector("#overallPercentage");

    const overallProgressBar =
        document.querySelector("#overallProgressBar");


    // ================= CURRENT STATE =================

    let currentTechnology = null;

    let currentTopic = null;

    // ================= RENDER TECHNOLOGIES =================

    function renderTechnologies() {

        technologyContainer.innerHTML = "";

        Object.keys(mernData).forEach(function (technology) {

            const topics = mernData[technology];

            const completed = topics.filter(function (topic) {
                return topic.status === "completed";
            }).length;

            const percentage =
                Math.round((completed / topics.length) * 100);


            const card = document.createElement("div");

            card.classList.add("techCard");


            // Active technology

            if (technology === currentTechnology) {
                card.classList.add("active");
            }


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
                        ${completed}/${topics.length} completed
                    </span>

                    <span>
                        ${percentage}%
                    </span>

                </div>


                <div class="techProgress">

                    <div
                        class="techProgressFill"
                        style="width: ${percentage}%"
                    ></div>

                </div>

            `;


            // Technology click

            card.addEventListener("click", function () {

                currentTechnology = technology;

                currentTopic = null;

                renderTechnologies();

                renderTopics();

            });


            technologyContainer.appendChild(card);

        });
    }


    // ================= RENDER TOPICS =================

    function renderTopics() {

        topicsContainer.innerHTML = "";


        // Agar technology select nahi hui

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


        // Heading

        selectedTechnology.textContent =
            currentTechnology + " Topics";


        const topics =
            mernData[currentTechnology];


        // Topics create

        topics.forEach(function (topic) {

            const card =
                document.createElement("div");

            card.classList.add("topicCard");


            let statusText;


            if (topic.status === "completed") {

                statusText = "Completed";
                // console.log(topic.value)

            }
            else if (topic.status === "progress") {

                statusText = "In Progress";

            }
            else {

                statusText = "Pending";

            }


            card.innerHTML = `

                <div class="topicTop">

                    <span class="topicName">
                        ${topic.name}
                    </span>

                    <span class="status ${topic.status}">
                        ${statusText}
                    </span>
               
                </div>


                <p class="topicTechnology">
                    ${currentTechnology}
                </p>

            `;


            // Topic click

            card.addEventListener("click", function () {

                openStatusModal(topic);

            });


            topicsContainer.appendChild(card);

        });
    }


    // ================= OPEN MODAL =================

    function openStatusModal(topic) {

        currentTopic = topic;
        console.log(currentTopic.id)

        modalTopicName.textContent =
            topic.name;


        // Existing status select karo

        const radio =
            document.querySelector(
                `input[name="topicStatus"][value="${topic.status}"]`
            );


        if (radio) {

            radio.checked = true;

        }


        statusModal.classList.add("show");
    }


    // ================= CLOSE MODAL =================

    function closeStatusModal() {

        statusModal.classList.remove("show");

        currentTopic = null;
    }


    // Close button

    closeModal.addEventListener(
        "click",
        closeStatusModal
    );


    // Cancel button

    cancelStatus.addEventListener(
        "click",
        closeStatusModal
    );


    // ================= SAVE STATUS =================

   saveStatus.addEventListener(
    "click",
    async function () {

        if (!currentTopic) {
            return;
        }

        const selected =
            document.querySelector(
                'input[name="topicStatus"]:checked'
            );

        if (!selected) {
            alert("Please select a status.");
            return;
        }

        try {

            await updateProgress(
                currentTopic.id,
                selected.value
            );

            // Database update successful hone ke baad hi UI update karo
            currentTopic.status = selected.value;

            closeStatusModal();

            renderTopics();
            renderTechnologies();
            updateOverallProgress();

        } catch (error) {

            console.log("Unable to update progress");

        }
    }
);

    // ================= OVERALL PROGRESS =================

    function updateOverallProgress() {

        let total = 0;

        let completed = 0;


        Object.values(mernData).forEach(function (topics) {

            total += topics.length;


            topics.forEach(function (topic) {

                if (topic.status === "completed") {

                    completed++;

                }

            });

        });


        const percentage =
            total === 0
                ? 0
                : Math.round((completed / total) * 100);


        overallPercentage.textContent =
            percentage + "%";


        overallProgressBar.style.width =
            percentage + "%";
    }


    // ================= BACKDROP CLICK =================

    statusModal.addEventListener(
        "click",
        function (event) {

            if (event.target === statusModal) {

                closeStatusModal();

            }

        }
    );
    // ================= INITIAL LOAD ================
    renderTechnologies();

    renderTopics();

    updateOverallProgress();

}



