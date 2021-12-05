const express = require("express");
const router = express.Router();
const AssetService = require("./asset.service.js");

router
  .route("/assets")
  .get(AssetService.getListAssets)
  .post(AssetService.createAsset)
  .put(AssetService.updateAsset)
  .delete(AssetService.deleteAsset);

router
  .route("/assets/import")
  .get(AssetService.getListImportAsset)
  .post(AssetService.importAssets);

router
  .route("/assets/export")
  .get(AssetService.getListExportAsset)
  .post(AssetService.exportAssets);

router.get("/assets/units", AssetService.getListUnits);

module.exports = router;
