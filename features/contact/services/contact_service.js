const Contact = require('../models/contact_model');
const Profile = require('../../profile/models/profileModel');
const { not } = require('joi');


// const Contact = require('../models/contact');

class ContactService {
    async createContact(contactData, profileId) {
        try {
            const profile = await Profile.findById(profileId);
            if (!profile) {
                throw new Error('User is Not Authenticated');
            }
            const contact = new Contact(contactData);

            await contact.save();
            profile.contacts.push(contact);
            profile.save();
            return contact;
        } catch (error) {
            throw error;
        }
    }

    async getContacts(profileId) {
        try {

            const contacts = await Contact.find({ profileId });
            // console.log(contacts);
            return contacts;
        } catch (error) {
            throw error;
        }
    }
    async searchContacts(profileId, userData) {

        // const mongoose = require('mongoose');
        // const UserModel = require('./models/user'); // Replace with the actual model import

        // const tagsToSearch = ['Tag5', 'Tag6']; // Add the tags you want to search for

        // const searchCriteria = {
        //     $or: [
        //         { name: { $regex: userData.name, $options: 'i' } }, // Case-insensitive name search
        //         { 'emailId.email': { $regex: userData.email, $options: 'i' } }, // Case-insensitive email search
        //         {
        //             'mobileNumbers.number': { $regex: userData.mobileNumbers }, // Mobile number search

        //         },
        //         { tags: { $in: userData.tags } }, // Search for documents with any of the specified tags
        //         { createdAt: { $gte: new Date(userData.startDate), $lte: new Date(userData.endDate) } }, // Date range search
        //         { profileId: profileId } // Exact match for profileId
        //     ]
        // };

        // Initialize an empty searchCriteria object
        const searchCriteria = {};

        // Define other search fields conditionally if values are provided
        if (profileId) {
            searchCriteria.profileId = profileId; // Exact match for profileId
        }

        // Optional fields
        const nameToSearch = userData.name;
        const emailToSearch = userData.email;
        const mobileNumberToSearch = userData.mobileNumber;
        const tagsToSearch = userData.tags; // Add tags to search for
        const startDate = userData.startDateDate;
        const endDate = userData.endDate;

        if (nameToSearch) {
            searchCriteria.name = { $regex: nameToSearch, $options: 'i' }; // Case-insensitive name search
        }

        if (emailToSearch) {
            searchCriteria['emailId.email'] = { $regex: emailToSearch, $options: 'i' }; // Case-insensitive email search
        }

        if (mobileNumberToSearch) {
            searchCriteria['mobileNumbers.number'] = { $regex: mobileNumberToSearch }; // Mobile number search
            // searchCriteria['mobileNumbers.title'] = 'Mobile Number'; // Filter by title if needed
        }

        if (tagsToSearch && tagsToSearch.length > 0) {
            searchCriteria.tag = { $in: tagsToSearch }; // Search for documents with any of the specified tags
        }

        if (startDate && endDate) {
            searchCriteria.createdAt = { $gte: startDate, $lte: endDate }; // Date range search
        }



        try {

            // console.log(searchCriteria);
            const contacts = await Contact.find(searchCriteria);
            return contacts;
        } catch (error) {
            throw error;
        }
    }

    async getContactById(id) {
        try {
            const contact = await Contact.findById(id);
            return contact;
        } catch (error) {
            throw error;
        }
    }

    async updateContact(id, updatedData) {

        try {
            const updatedContact = await Contact.findByIdAndUpdate(id, updatedData, {
                new: true,
            });
            return updatedContact;
        } catch (error) {
            throw error;
        }
    }

    async deleteContact(id) {
        try {
            const deletedContact = await Contact.findByIdAndRemove(id);
            return deletedContact;
        } catch (error) {
            throw error;
        }
    }


    // contact note services

    async addContactNotes(id, note) {

        try {
            const contact = await Contact.findById(id);
            contact.notes.push(note);
            contact.save();
            return contact.notes;
        } catch (error) {
            throw error;
        }
    }
    async getContactNotes(id) {
        try {
            const contact = await Contact.findById(id);

            return contact.notes;
        } catch (error) {
            throw error;
        }
    }
    async updateContactNotes(id, note) {
        try {
            const contact = await Contact.findById(id);
            for (var index = 0; index < contact.notes.length; index++) {
                if (contact.notes[index]._id == note._id) {
                    contact.notes[index] = note;

                    contact.save();
                    break;
                }
            }


            return contact.notes;
        } catch (error) {
            throw error;
        }
    }
    async deleteContactNotes(id, noteId) {
        try {

            const contact = await Contact.findById(id);

            contact.notes = contact.notes.filter(function (element) {
                return element._id != noteId;
            });

            contact.save();

            return contact.notes;
        } catch (error) {
            throw error;
        }
    }


    // contact phone services

    async addContactPhone(id, phone) {

        try {
            const contact = await Contact.findById(id);
            contact.mobileNumbers.push(phone);
            contact.save();
            return contact.mobileNumbers;
        } catch (error) {
            throw error;
        }
    }
    async getContactPhone(id) {
        try {
            const contact = await Contact.findById(id);

            return contact.mobileNumbers;
        } catch (error) {
            throw error;
        }
    }
    async updateContactPhone(id, phone) {
        try {
            const contact = await Contact.findById(id);
            for (var index = 0; index < contact.mobileNumbers.length; index++) {
                if (contact.mobileNumbers[index]._id == phone._id) {
                    contact.mobileNumbers[index] = phone;

                    contact.save();
                    break;
                }
            }


            return contact.mobileNumbers;
        } catch (error) {
            throw error;
        }
    }
    async deleteContactPhone(id, phoneId) {
        try {

            const contact = await Contact.findById(id);

            contact.mobileNumbers = contact.mobileNumbers.filter(function (element) {
                return element._id != phoneId;
            });

            contact.save();

            return contact.mobileNumbers;
        } catch (error) {
            throw error;
        }
    }
    // contact Email services

    async addContactEmail(id, email) {

        try {
            const contact = await Contact.findById(id);
            contact.emailId.push(email);
            contact.save();
            return contact.emailId;
        } catch (error) {
            throw error;
        }
    }
    async getContactEmail(id) {
        try {
            const contact = await Contact.findById(id);

            return contact.emailId;
        } catch (error) {
            throw error;
        }
    }
    async updateContactEmail(id, email) {
        try {
            const contact = await Contact.findById(id);
            for (var index = 0; index < contact.emailId.length; index++) {
                if (contact.emailId[index]._id == email._id) {
                    contact.emailId[index] = email;

                    contact.save();
                    break;
                }
            }


            return contact.emailId;
        } catch (error) {
            throw error;
        }
    }
    async deleteContactEmail(id, emailId) {
        try {

            const contact = await Contact.findById(id);

            contact.emailId = contact.emailId.filter(function (element) {
                return element._id != emailId;
            });

            contact.save();

            return contact.emailId;
        } catch (error) {
            throw error;
        }
    }
    // contact SocialMedia services

    async addContactSocialMedia(id, socialMedia) {

        try {
            const contact = await Contact.findById(id);
            contact.socialMedia.push(socialMedia);
            contact.save();
            return contact.socialMedia;
        } catch (error) {
            throw error;
        }
    }
    async getContactSocialMedia(id) {
        try {
            const contact = await Contact.findById(id);

            return contact.socialMedia;
        } catch (error) {
            throw error;
        }
    }
    async updateContactSocialMedia(id, socialMedia) {
        try {
            const contact = await Contact.findById(id);
            for (var index = 0; index < contact.socialMedia.length; index++) {
                if (contact.socialMedia[index]._id == socialMedia._id) {
                    contact.socialMedia[index] = socialMedia;

                    contact.save();
                    break;
                }
            }


            return contact.socialMedia;
        } catch (error) {
            throw error;
        }
    }
    async deleteContactSocialMedia(id, socialMediaId) {
        try {

            const contact = await Contact.findById(id);

            contact.mobileNumbers = contact.socialMedia.filter(function (element) {
                return element._id != socialMediaId;
            });

            contact.save();

            return contact.socialMedia;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ContactService();
