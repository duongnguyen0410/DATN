const knex = require("../../../knex/knex");

const getListAssets = () => {
  return knex("asset").select();
};

const createAsset = (name, unit) => {
  return knex("asset").insert({ name, unit });
};

const updateAsset = (id, name, unit) => {
  return knex("asset")
    .update({ name, unit })
    .where({ id });
};

const updateCountAsset = (id, count) => {
  return knex("asset")
    .update({ count })
    .where({ id });
};

const deleteAsset = id => {
  return knex("asset")
    .delete()
    .where({ id });
};

const importAsset = (company, phone, data) => {
  return knex("import_warehouse").insert({
    company,
    phone,
    data
  });
};

const exportAsset = data => {
  return knex("export_warehouse").insert({
    data
  });
};

const getAllImportRecord = () => {
  return knex("import_warehouse").select();
};

const getAllExportRecord = () => {
  return knex("export_warehouse").select();
};

module.exports = {
  getListAssets,
  createAsset,
  updateAsset,
  deleteAsset,

  updateCountAsset,
  importAsset,
  getAllImportRecord,

  exportAsset,
  getAllExportRecord
};
