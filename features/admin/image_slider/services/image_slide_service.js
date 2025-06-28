const ImageSliderModel = require('../models/image_slider_model')

class ImageSliderService {

    async addImage(imageData) {


        try {
           
            const newImage = await ImageSliderModel({ file: imageData.myFile })
            await newImage.save();
            return newImage;


        } catch (error) {
            throw error;
        }
    }
    async getAllImage() {


        try {

            const images = await ImageSliderModel.find({})

            return images;


        } catch (error) {
            throw error;
        }
    }
    async deleteImage(imageId) {


        try {

            const images = await ImageSliderModel.findByIdAndDelete(imageId)

            return images;


        } catch (error) {
            throw error;
        }
    }



}

module.exports = new ImageSliderService();