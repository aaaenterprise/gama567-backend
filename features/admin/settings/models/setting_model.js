const mongoose = require('mongoose');
const SettingsSchema = new mongoose.Schema({

    howToPlay:{
        type:String
    },
    privacyPolicy:{
        type:String
    },
    telegramSupport:{
        type:String
    },
    whatsappSupport:{
        type:String
    },
    minimumDeposit:{
        type:Number
    },
    minimumWithdraw:{
        type:Number
    },
    paytmUpi:{
        type: String
    },
    phonepayUpi:{
        type: String
    },
    googlepayUpi:{
        type: String
    },
    withdrawOpenTime:{
        type: String
    },
    withdrawCloseTime:{
        type: String
    },
    autoVerify:{
        type: Boolean,
        default:false
    },


});

const Settings = mongoose.model('Settings', SettingsSchema);

module.exports = Settings;
