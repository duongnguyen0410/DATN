<template>
  <page-layout>
    <template slot="table-content">
      <h1>{{ $t("listAsset") }}</h1>

      <a-table :columns="columns" :data-source="dataSource" :rowKey="record => record.id" :pagination="false" bordered>
        <template slot="title" slot-scope="currentPageData">
          <a-row>
            <span> {{ $t("total") }} : {{ currentPageData.length }}</span>

            <span style="float: right;">
              <ExportWarehouse />
              <ImportWarehouse />
              <a-button icon="plus-circle" type="primary" @click="showModalAdd">{{ $t("add") }}</a-button>
            </span>
          </a-row>
        </template>

        <div slot="filterDropdown" slot-scope="{ column }" style="padding: 8px">
          <template v-if="column.key == 'name'">
            <a-input
              v-ant-ref="c => (searchForcus = c)"
              :placeholder="`Search ${column.dataIndex}`"
              style="width: 188px; margin-bottom: 8px; display: block;"
              v-model="dataFilter.filter.name"
              @pressEnter="commitSearch"
            />
            <a-button
              type="primary"
              icon="search"
              size="small"
              style="width: 90px; margin-right: 8px"
              @click="commitSearch"
            >
              Search
            </a-button>
            <a-button size="small" style="width: 90px" @click="handleReset">
              Reset
            </a-button>
          </template>

          <template v-if="column.key == 'unit'">
            <a-select
              v-ant-ref="c => (searchForcus = c)"
              mode="multiple"
              :value="dataFilter.filter.unit"
              style="width: 200px"
              @change="handleSelectUnit"
            >
              <a-select-option v-for="unit in listUnits" :key="unit">
                {{ unit }}
              </a-select-option>
            </a-select>
          </template>
        </div>

        <a-icon slot="filterIcon" type="search" />

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
      </a-table>

      <a-modal v-model="visibleModalAdd" :title="$t('modalAddAsset')" @ok.prevent="handleSubmit">
        <a-form-model
          ref="assetForm"
          :model="formAssetItem"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item prop="name" :label="$t('name')">
            <a-input v-model="formAssetItem.name" />
          </a-form-model-item>

          <a-form-model-item prop="unit" :label="$t('unit')">
            <a-select v-model="formAssetItem.unit">
              <a-select-option v-for="item in listUnits" :value="item" :key="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </template>
  </page-layout>
</template>
<script>
import PageLayout from "@/components/PageLayout.vue";
import ImportWarehouse from "@/components/Asset/ImportWarehouse.vue";
import ExportWarehouse from "@/components/Asset/ExportWarehouse.vue";

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
    ExportWarehouse
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
      }
    };
  },
  mounted() {
    this.getListAssets();
    this.getListUnits();
  },
  computed: {
    ...mapState({
      listAssets: state => state.listAssets,
      listUnits: state => state.listUnits,
      dataFilter: state => state.dataFilter
    }),
    columns() {
      let self = this;
      return columns.filter(item => {
        switch (item.key) {
          case "name": {
            item.defaultSortOrder = this.dataFilter.sorter.name;
            item.sorter = (a, b) => a.name.localeCompare(b.name);
            item.filtered = this.filter.name;
            item.onFilterDropdownVisibleChange = visible => visible && setTimeout(() => this.searchForcus.focus(), 0);
            break;
          }

          case "count": {
            item.defaultSortOrder = this.dataFilter.sorter.count;
            item.sorter = (a, b) => (a.count > b.count ? 1 : a.count < b.count ? -1 : 0);
            break;
          }

          case "unit": {
            item.filtered = this.dataFilter.filter.unit.length;
            item.onFilterDropdownVisibleChange = visible => visible && setTimeout(() => this.searchForcus.focus(), 0);
            break;
          }
        }
        return true;
      });
    },
    dataSource() {
      let clone = _.cloneDeep(this.listAssets);

      clone = this.getFilterByName(clone);
      clone = this.getFilterByUnit(clone);

      return clone;
    }
  },
  methods: {
    ...mapActions({
      getListAssets: "getListAssets",
      getListUnits: "getListUnits",
      createAsset: "createAsset",
      updateAsset: "updateAsset",
      deleteAsset: "deleteAsset"
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
    getFilterByName(clone) {
      if (!this.filter.name) return clone;

      return clone.filter(item => item.name.includes(this.filter.name));
    },
    getFilterByUnit(clone) {
      if (!this.dataFilter.filter.unit.length) return clone;

      return clone.filter(item => this.dataFilter.filter.unit.includes(item.unit));
    },
    commitSearch() {
      this.filter.name = this.dataFilter.filter.name;
    },
    handleReset() {
      this.filter.name = null;
      this.dataFilter.filter.name = null;
    },
    handleSelectUnit(e) {
      this.dataFilter.filter.unit = e;
    },
    importToWarehouse() {}
  }
};
</script>
