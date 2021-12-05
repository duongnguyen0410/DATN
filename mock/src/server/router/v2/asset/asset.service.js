const AssetRepository = require("./asset.repository");
const Formatter = require("response-format");
const UNITS = ["l", "ml", "g", "kg", "cái/chiếc", "đôi"];

const getListAssets = async (req, res) => {
  let listAsset = await AssetRepository.getListAssets();
  res.json(Formatter.success(null, listAsset));
};

const createAsset = async (req, res) => {
  console.log("Create Asset", req.body);
  try {
    let newAsset = await AssetRepository.createAsset(req.body.name, req.body.unit);
    res.json(Formatter.success(null, newAsset));
  } catch (error) {
    res.json(Formatter.badRequest("BAD REQUEST", null));
  }
};

const updateAsset = async (req, res) => {
  console.log("Update Asset", req.body);
  try {
    let asset = await AssetRepository.updateAsset(req.body.id, req.body.name, req.body.unit);
    res.json(Formatter.success(null, asset));
  } catch (error) {
    res.json(Formatter.badRequest("BAD REQUEST", null));
  }
};

const deleteAsset = async (req, res) => {
  console.log("Delete asset", req.body);
  try {
    let asset = await AssetRepository.deleteAsset(req.body.id);
    res.json(Formatter.success(null, asset));
  } catch (error) {
    res.json(Formatter.badRequest("BAD REQUEST", null));
  }
};

const getListUnits = async (req, res) => {
  res.json(Formatter.success(null, UNITS));
};

const importAssets = async (req, res) => {
  let { company, phone, data } = req.body;
  console.log("Import Asset: ", req.body);
  try {
    let allAsset = await AssetRepository.getListAssets();

    let itemInsert = data
      .map(item => {
        let find = allAsset.find(e => e.id == item.id);
        find.count = +find.count + +item.count;
        return find;
      })
      .filter(item => item);
    await Promise.all(itemInsert.map(item => AssetRepository.updateCountAsset(item.id, item.count)));
    await AssetRepository.importAsset(company, phone, JSON.stringify(data));

    res.json(Formatter.success(null, null));
  } catch (error) {
    console.error(error);
    res.json(Formatter.badRequest());
  }
};

const exportAssets = async (req, res) => {
  let data = req.body;
  console.log("Export Asset: ", req.body);
  try {
    let allAsset = await AssetRepository.getListAssets();

    let itemInsert = data
      .map(item => {
        let find = allAsset.find(e => e.id == item.id);
        find.count = +find.count - +item.count;
        return find;
      })
      .filter(item => item);
    await Promise.all(itemInsert.map(item => AssetRepository.updateCountAsset(item.id, item.count)));
    await AssetRepository.exportAsset(JSON.stringify(data));

    res.json(Formatter.success(null, null));
  } catch (error) {
    console.error(error);
    res.json(Formatter.badRequest());
  }
};

const getListImportAsset = async (req, res) => {
  try {
    let data = await AssetRepository.getAllImportRecord();
    res.json(Formatter.success(null, data));
  } catch (error) {
    console.error(error);
    res.json(Formatter.badRequest());
  }
};

const getListExportAsset = async (req, res) => {
  try {
    let data = await AssetRepository.getAllExportRecord();
    res.json(Formatter.success(null, data));
  } catch (error) {
    console.error(error);
    res.json(Formatter.badRequest());
  }
};

module.exports = {
  getListAssets,
  createAsset,
  updateAsset,
  deleteAsset,

  getListUnits,
  importAssets,
  getListImportAsset,

  exportAssets,
  getListExportAsset
};
