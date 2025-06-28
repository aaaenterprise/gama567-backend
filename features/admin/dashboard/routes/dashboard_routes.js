const express =require("express")
const { render } = require("../../admin_routes")

const router =express.Router()

router.get('', function (req, res){
    console.log(req.session);
return res.render('admin/index');
})

module.exports = router;
