<template>
  <page-layout>
    <template slot="table-content">
      <h1>{{ $t("common.analysis_warehouse") }}</h1>

      <a-table
        :columns="columns"
        :data-source="dataSourceWarehouse"
        :rowKey="record => `${record.type}-${record.id}`"
        :pagination="false"
        bordered
      >
        <template slot="title" slot-scope="currentPageData">
          <a-row>
            <span> {{ $t("total") }} : {{ currentPageData.length }}</span>

            <section style="float: right;">
              <div class="check-point">
                <a-date-picker v-model="duration.start" />
                <a-icon type="arrow-right" />
                <a-date-picker v-model="duration.end" />
              </div>
            </section>
          </a-row>
        </template>

        <div slot="filterDropdown" slot-scope="{ column }" style="padding: 8px">
          <template v-if="column.key == 'type'">
            <a-select
              allow-clear
              v-ant-ref="c => (searchForcus = c)"
              style="width: 200px"
              :value="dataFilter.filter.type"
              @change="handleSelectType"
            >
              <a-select-option key="import">
                import
              </a-select-option>
              <a-select-option key="export">
                export
              </a-select-option>
            </a-select>
          </template>
        </div>

        <a-icon slot="filterIcon" type="search" />

        <template slot="type" slot-scope="text">
          <a-tag :color="text == 'import' ? 'red' : 'green'">
            {{ text }}
          </a-tag>
        </template>

        <template slot="created_at" slot-scope="text">
          {{ formatTime(text) }}
        </template>

        <template v-for="column of columns" :slot="column.slots.title">
          {{ $t(column.slots.title) }}
        </template>

        <div class="it-operation" slot="operation" slot-scope="text, record">
          <a-tooltip placement="bottom" :title="$t('common.Edit_Tooltip')">
            <a-button type="primary" @click="viewDetail(record)">
              <a-icon type="edit" />
            </a-button>
          </a-tooltip>

          <a-popconfirm v-if="listAssets.length" :title="$t('common.Delete_Confirm')" @confirm="() => onDelete(record)">
            <a-tooltip placement="bottom" :title="$t('common.Delete_Tooltip')">
              <a-button type="danger">
                <a-icon type="delete" />
              </a-button>
            </a-tooltip>
          </a-popconfirm>
        </div>

        <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
          <ShowImportTable v-if="record.type == 'import'" :record="record" />
          <ShowExportTable v-if="record.type == 'export'" :record="record" />
        </p>
      </a-table>
    </template>
  </page-layout>
</template>
<script>
import PageLayout from "@/components/PageLayout.vue";
import ImportWarehouse from "@/components/Asset/ImportWarehouse.vue";
import ExportWarehouse from "@/components/Asset/ExportWarehouse.vue";
import ShowImportTable from "@/components/AnalysisWarehouse/ShowImportTable.vue";
import ShowExportTable from "@/components/AnalysisWarehouse/ShowExportTable.vue";

import { mapGetters, createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("asset");
import { columns, rules } from "./const";
import moment from "moment";
import _ from "lodash";

export default {
  name: "Assets",
  components: {
    PageLayout,
    ImportWarehouse,
    ExportWarehouse,
    ShowImportTable,
    ShowExportTable
  },
  data() {
    return {
      rules,
      visibleModalAdd: false,
      formAssetItem: {},
      assetItemID: null,
      labelCol: { span: 5 },
      wrapperCol: { span: 12 },
      searchForcus: null,
      filter: {
        name: null
      },
      duration: {
        start: moment().startOf("month"),
        end: moment().endOf("month")
      }
    };
  },
  async created() {
    let promise = [];
    promise.push(this.getListAssets());
    promise.push(this.getListUnits());
    promise.push(this.getListImportAssets());
    promise.push(this.getListExportAssets());

    await Promise.all(promise);
  },
  computed: {
    ...mapState({
      listAssets: state => state.listAssets,
      listUnits: state => state.listUnits,
      dataFilter: state => state.dataFilter,
      listImportAsset: state => state.listImportAsset,
      listExportAsset: state => state.listExportAsset
    }),
    columns() {
      let self = this;
      return columns.filter(item => {
        switch (item.key) {
          case "created_at": {
            item.defaultSortOrder = "ascend";
            item.sorter = (a, b) => {
              let start = moment(a.created_at);
              let end = moment(b.created_at);

              return start > end ? -1 : start < end ? 1 : 0;
            };
            break;
          }

          case "type": {
            item.filtered = this.dataFilter.filter.type;
            item.onFilterDropdownVisibleChange = visible => visible && setTimeout(() => this.searchForcus.focus(), 0);
            break;
          }
        }
        return true;
      });
    },
    dataSourceWarehouse() {
      let clone = [];
      clone = clone.concat(this.listImportAsset);
      clone = clone.concat(this.listExportAsset);
      console.log(clone);

      clone.sort((a, b) => {
        let dateA = moment(a.created_at);
        let dateB = moment(b.created_at);
        return dateA > dateB ? -1 : dateA < dateB ? 1 : 0;
      });

      clone = this.getFilterByType(clone);
      clone = this.getFilterByDuration(clone);

      return clone;
    }
  },
  methods: {
    ...mapActions({
      getListAssets: "getListAssets",
      getListUnits: "getListUnits",
      createAsset: "createAsset",
      updateAsset: "updateAsset",
      deleteAsset: "deleteAsset",
      getListImportAssets: "getListImportAssets",
      getListExportAssets: "getListExportAssets"
    }),
    showModalAdd() {
      this.assetItemID = "add";
      this.visibleModalAdd = true;
      this.formAssetItem = {};
    },
    async handleSubmit(e) {
      try {
        await this.$refs.assetForm.validate();

        if (this.assetItemID == "add") this.createAssetAPI(this.formAssetItem);
        else this.updateAssetAPI({ id: this.assetItemID, ...this.formAssetItem });
      } catch (error) {
        console.log("validate error: ", error);
      }
    },
    async createAssetAPI(payload) {
      let response = await this.createAsset(payload);
      if (response.error) {
        return this.$notification.error({
          message: this.$t("common.Default_Error"),
          description: this.$t("common.Default_Error"),
          duration: 2.5
        });
      }

      this.visibleModalAdd = false;
      this.$refs.assetForm.resetFields();
      this.$notification.success({
        message: this.$t("defaultCreateSuccess"),
        description: this.$t("defaultCreateSuccess"),
        duration: 2.5
      });
    },
    async updateAssetAPI(payload) {
      let response = await this.updateAsset(payload);
      if (response.error) {
        return this.$notification.error({
          message: this.$t("common.Default_Error"),
          description: this.$t("common.Default_Error"),
          duration: 2.5
        });
      }

      this.visibleModalAdd = false;
      this.$notification.success({
        message: this.$t("common.Default_Update_Success"),
        description: this.$t("common.Default_Update_Success"),
        duration: 2.5
      });
    },
    viewDetail(record) {
      this.assetItemID = record.id;
      this.formAssetItem = record;
      this.visibleModalAdd = true;
    },
    async onDelete(record) {
      let response = await this.deleteAsset(record);

      if (response.error) {
        return this.$notification.error({
          message: this.$t("common.Default_Error"),
          description: this.$t("common.Default_Error"),
          duration: 2.5
        });
      }

      this.$notification.success({
        message: this.$t("common.Default_Delete_Success"),
        description: this.$t("common.Default_Delete_Success"),
        duration: 2.5
      });
    },

    getFilterByType(clone) {
      if (!this.dataFilter.filter.type) return clone;

      return clone.filter(item => item.type == this.dataFilter.filter.type);
    },
    getFilterByDuration(clone) {
      let start = this.duration.start.unix();
      let end = this.duration.end.unix();

      return clone.filter(item => {
        let current = moment(item.created_at).unix();
        let isBetween = current >= start && current <= end;

        return isBetween ? true : false;
      });
    },
    commitSearch() {
      this.filter.name = this.dataFilter.filter.name;
    },
    handleReset() {
      this.filter.name = null;
      this.dataFilter.filter.name = null;
    },
    handleSelectType(e) {
      this.dataFilter.filter.type = e;
    },
    formatTime(text) {
      return moment(text).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>

<style lang="less">
.check-point {
  position: relative;
}
</style>
