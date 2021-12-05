<template>
  <div class="export">
    <a-button type="primary" id="excelExport" @click="getReport">Export Excel</a-button>
  </div>
</template>
<script>
//ref: https://www.youtube.com/watch?v=eicLNabvZN8

import _ from "lodash";
export default {
  name: "ExportExcel",
  data() {
    return {};
  },
  props: {
    route: String,
    csvHeader: Array,
    source: Array,
    replace: Array,
    list: Object
  },
  computed: {
    dataSource() {
      return _.cloneDeep(this.source);
    }
  },
  methods: {
    download(csvData) {
      const blob = new Blob(["\uFEFF" + csvData], {
        type: "text/csv; charset=utf-18"
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", "download.csv");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    objectToCsv(data) {
      const csvRows = [];
      //get the headers
      let csvHeader = _.cloneDeep(this.csvHeader);
      let headers = csvHeader.map(row => row.title);
      headers.pop();
      csvRows.push(headers);

      headers = csvHeader.map(row => row.dataIndex);
      headers.pop();
      //loop over the rows
      for (const row of data) {
        const values = headers.map(header => `"${row[header]}"`);
        csvRows.push(values.join(","));
      }
      //from escaped comma separated values
      return csvRows.join("\n");
    },
    getReport: async function() {
      let csvHeader = _.cloneDeep(this.csvHeader);
      let headers = csvHeader.map(row => row.dataIndex);
      headers.pop();

      const data = _.cloneDeep(this.dataSource);
      data.map(row => this.changeValue(row));

      const csvData = this.objectToCsv(data);
      this.download(csvData);
    },
    changeValue(row) {
      let replace = _.cloneDeep(this.replace);
      replace.map(item => {
        if (item == "IDCreated" || item == "IDManaged") row[item] = this.mapUser(row[item]);
        if (item == "Sex") row[item] = this.$t(`employee.${row[item]}`);
        if (item == "IDRole") row[item] = this.mapRole(row[item]);
        if (item == "Purpose") row[item] = this.mapPurpose(row[item]);
        if (item == "IDOwner") row[item] = this.mapCompany(row[item]);
        return item;
      });

      return row;
    },
    mapUser(item) {
      if (item == null) return null;

      let listUser = _.cloneDeep(this.list.listUser);
      return _.find(listUser, e => e.ID == item).Name;
    },
    mapRole(item) {
      return this.$t(`employee.Role_${item}`);
    },
    mapPurpose(item) {
      let listPurpose = _.cloneDeep(this.list.listPurpose);
      return _.find(listPurpose, e => e.ID == item).Name;
    },
    mapCompany(item) {
      let listCompany = _.cloneDeep(this.list.listCompany);
      return _.find(listCompany, e => e.ID == item).Name;
    }
  }
};
</script>

<style lang="less">
.export {
  margin-right: 10px;
}
</style>
