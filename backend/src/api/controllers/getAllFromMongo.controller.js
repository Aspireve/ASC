const mongoose = require("mongoose");

exports.getAllData = async (req, res, next) => {
  try {
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const allData = {};

    for (const collection of collections) {
      const collectionName = collection.name;

      // Dynamically create a model for the collection
      const Model = mongoose.model(
        collectionName,
        new mongoose.Schema({}, { strict: false })
      );

      // Retrieve data and populate fields dynamically
      const documents = await Model.find({}).lean();
      const populatedData = await Promise.all(
        documents.map(async (doc) => {
          const schema = new mongoose.Schema({}, { strict: false });
          const keys = Object.keys(doc);
          for (const key of keys) {
            // Populate fields that look like ObjectId arrays or references
            if (
              mongoose.Types.ObjectId.isValid(doc[key]) ||
              Array.isArray(doc[key])
            ) {
              try {
                const RefModel = mongoose.model(key, schema);
                doc[key] = await RefModel.findById(doc[key]);
              } catch (err) {
                // Skip if not a valid reference
              }
            }
          }
          return doc;
        })
      );

      allData[collectionName] = populatedData;
    }

    console.log("All data from all collections:", allData);

    // Close the connection
    await mongoose.connection.close();
    return res.status(200).json(allData);
  } catch (error) {
    next(error);
  }
};
