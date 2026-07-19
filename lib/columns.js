function colName(col) {
  const label = col.fields.label;
  if (label && label !== col.id) {
    return `${label} ($${col.id})`;
  }
  return col.id;
}

function isHiddenColumn(col) {
  return col.id === 'manualSort' || col.id.startsWith('gristHelper_');
}

// Columns a user can set a value on: not Grist's own bookkeeping columns, and
// not formula columns, which compute their own values.
function isWritable(col) {
  return !isHiddenColumn(col) && !(col.fields.isFormula && col.fields.formula);
}

async function fetchColumns(z, bundle) {
  const response = await z.request({
    url: `/api/docs/${bundle.inputData.document}/tables/${bundle.inputData.table}/columns`,
    method: 'GET',
  });
  return response.data.columns;
}

// The dynamic inputFields of Create Record and Update Record: one Zapier field
// per writable column.
async function columnInputFields(z, bundle) {
  const columns = await fetchColumns(z, bundle);
  return columns.filter(isWritable).map((col) => ({ key: col.id, label: colName(col) }));
}

module.exports = { colName, isHiddenColumn, isWritable, fetchColumns, columnInputFields };
