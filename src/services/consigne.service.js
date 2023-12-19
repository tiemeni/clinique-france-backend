const Consigne = require("../database/models/consigne");

module.exports = {
    createGroup: async (data) => {
        let consigne = new Consigne(data);
        return await consigne.save();
    },
    findOneByQuery: async (query) => {
        return await Consigne.findOne(query)
    },
    findGroupById: async (id) => {
        return await Consigne.findById(id)
    },
    updateGroup: async (id, query) => {
        return await Consigne.findOneAndUpdate({ _id: id }, query, { new: true });
    },
    findGroups: async () => {
        return await Consigne.find({})
    },
    findGroupsByQuery: async () => {
        return await Consigne.find({})
    },
}