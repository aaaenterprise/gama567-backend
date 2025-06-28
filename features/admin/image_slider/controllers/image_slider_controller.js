const ImageSliderService = require("../services/image_slide_service")
const { httpStatusCodes } = require('../../../../common/utils')
class ImageSliderController {

    async addImage(req, res) {

        try {

            // const{_id, ...other}=value;
            const user = await ImageSliderService.addImage(req.body);
            if (!user) {
                return res.status(400).json({ error: 'Image NotAdded ' });
            }

            res.status(httpStatusCodes.created).json({ success: true, message: "Image Added ", data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: {} });
        }
    }
    async getAllImage(req, res) {

        try {

            // const{_id, ...other}=value;
            const user = await ImageSliderService.getAllImage();


            res.status(httpStatusCodes.ok).json({ success: true, message: "Images ", data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: {} });
        }
    }
    async deleteImage(req, res) {

        try {

            // const{_id, ...other}=value;
            const user = await ImageSliderService.deleteImage(req.params.imageId);


            res.status(httpStatusCodes.ok).json({ success: true, message: "Images Deleted Successfully", data: {} });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: {} });
        }
    }


}

module.exports = new ImageSliderController();