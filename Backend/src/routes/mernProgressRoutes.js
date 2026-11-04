const express = require("express");
const mernProgress = require('../Controllers/mernProgress.Controller');
const authMiddleware = require('../middleware/auth.middleware')


const router  = express.Router(); 

router.get("/getData", mernProgress.fetchMernData);


router.post("/updateProgress/:topicId", authMiddleware.authMiddleware,  mernProgress.updateProgress);

router.get('/getProgress' ,authMiddleware.authMiddleware,  mernProgress.getProgress)

router.get( "/analytics", authMiddleware.authMiddleware,  mernProgress.getMernAnalytics );

module.exports = router;