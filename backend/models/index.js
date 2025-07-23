const { sequelize } = require('../config/database');
const FormEntry = require('./FormEntry');

const models = {
  FormEntry
};

// Set up associations if any
// FormEntry.hasMany(SomeOtherModel);

// Sync all models
const syncModels = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ All models synchronized successfully');
  } catch (error) {
    console.error('❌ Model synchronization failed:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  models,
  syncModels,
  ...models
};