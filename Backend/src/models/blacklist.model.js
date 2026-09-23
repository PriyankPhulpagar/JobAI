const moongose = require("mongoose");

const blacklistTokenSchema = new moongose.Schema({   

    token:{
        type: String,
        required: [true, "Token is required to be added in blacklist"],
    }
},{
    timestamps: true,
})

const tokenBlacklistModel = moongose.model("blacklistTokens", blacklistTokenSchema);

module.exports = tokenBlacklistModel;