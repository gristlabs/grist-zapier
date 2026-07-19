// Keys a step carries as configuration rather than as column values. Besides
// each action's own static fields, Zapier merges in `find_record`'s fields when
// it drives a search-or-create step or a search-powered dropdown, so `column`
// and `value` can reach a create's inputData. Writing them as record fields
// makes Grist reject the whole request with an unknown-column error.
// Consequence, unchanged from 1.x: a Grist column with one of these ids can't
// be written by these actions.
const NON_COLUMN_KEYS = new Set(['team', 'document', 'table', 'record', 'column', 'value']);

const pickFields = (inputData) =>
  Object.fromEntries(Object.entries(inputData).filter(([key]) => !NON_COLUMN_KEYS.has(key)));

const flattenRecords = (records) => records.map(({ id, fields }) => ({ id, ...fields }));

module.exports = { pickFields, flattenRecords };
