const authentication = require('./authentication');
const newRecordTrigger = require('./triggers/new_record.js');
const getAllDocumentsTrigger = require('./triggers/get_all_documents.js');
const getAllTeamsTrigger = require('./triggers/get_all_teams.js');
const getAllTablesTrigger = require('./triggers/get_all_tables.js');
const getAllColumnsTrigger = require('./triggers/get_all_columns.js');
const updatedRecordTrigger = require('./triggers/updated_record.js');
const createRecordCreate = require('./creates/create_record.js');
const updateRecordCreate = require('./creates/update_record.js');
const findRecordSearch = require('./searches/find_record.js');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,
  creates: {
    [createRecordCreate.key]: createRecordCreate,
    [updateRecordCreate.key]: updateRecordCreate,
  },
  triggers: {
    [newRecordTrigger.key]: newRecordTrigger,
    [getAllDocumentsTrigger.key]: getAllDocumentsTrigger,
    [getAllTeamsTrigger.key]: getAllTeamsTrigger,
    [getAllTablesTrigger.key]: getAllTablesTrigger,
    [getAllColumnsTrigger.key]: getAllColumnsTrigger,
    [updatedRecordTrigger.key]: updatedRecordTrigger,
  },
  searches: { [findRecordSearch.key]: findRecordSearch },
  searchOrCreates: {
    find_record: {
      key: 'find_record',
      display: {
        label: 'Find or Create Records',
        description: 'Finds a Record in a Table',
      },
      search: 'find_record',
      create: 'create_record',
    },
  },
};
