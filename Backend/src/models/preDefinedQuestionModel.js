const mongoose = require('mongoose');

const subTopicSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    }
});


const mernLearningContentSchema = new mongoose.Schema({
    technology: {
        type:String,
        required : true
    },
    Topics: {
        type: [subTopicSchema],
        default : []

    }

},{
    timestamps: true
})

const mernLearningContentModel= mongoose.model('mernLearningContent' , mernLearningContentSchema);

module.exports =mernLearningContentModel