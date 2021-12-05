<template>
  <PageLayout>
    <template slot="table-content">
      <h1>{{ $t("product_management") }}</h1>

      <a-table :columns="columns" :data-source="listProduct" bordered :rowKey="record => record.id" :loading="loading">
        <template slot="title" slot-scope="currentPageData">
          <a-row>
            <span> {{ $t("total") }} : {{ currentPageData.length }}</span>

            <span style="float: right;">
              <a-button icon="plus-circle" type="primary" @click="showModalAdd">{{ $t("add") }}</a-button>
            </span>
          </a-row>
        </template>

        <a-icon slot="filterIcon" type="search" />

        <template v-for="column of columns" :slot="column.slots.title">
          {{ $t(column.slots.title) }}
        </template>

        <template slot="price" slot-scope="text">
          {{ `${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
        </template>

        <div class="it-operation" slot="operation" slot-scope="text, record">
          <a-tooltip placement="bottom" :title="$t('common.Edit_Tooltip')">
            <a-button type="primary" @click="viewDetail(record)">
              <a-icon type="edit" />
            </a-button>
          </a-tooltip>

          <a-popconfirm :title="$t('common.Delete_Confirm')" @confirm="() => onDelete(record)">
            <a-tooltip placement="bottom" :title="$t('common.Delete_Tooltip')">
              <a-button type="danger">
                <a-icon type="delete" />
              </a-button>
            </a-tooltip>
          </a-popconfirm>
        </div>
      </a-table>

      <a-modal v-model="visibleModalAdd" :title="$t('modalAddProduct')" @ok.prevent="handleSubmit">
        <a-form-model
          ref="productForm"
          :model="formProductItem"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item prop="name" :label="$t('name')">
            <a-input v-model="formProductItem.name" />
          </a-form-model-item>

          <a-form-model-item prop="size" :label="$t('size')">
            <a-select v-model="formProductItem.size">
              <a-select-option v-for="item in listSize" :value="item" :key="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item prop="price" :label="$t('price')">
            <a-input-number
              class="w-100"
              v-model="formProductItem.price"
              :min="0"
              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\$\s?|(,*)/g, '')"
            />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </template>
  </PageLayout>
</template>

<script>
import { columns, rules } from "./const";
import { mapGetters, mapState, mapActions } from "vuex";

import PageLayout from "@/components/PageLayout.vue";
export default {
  name: "Product",
  components: {
    PageLayout
  },
  data() {
    return {
      columns,
      rules,
      loading: false,
      visibleModalAdd: false,
      formProductItem: {},
      labelCol: { span: 5 },
      wrapperCol: { span: 12 },
      productItemID: null
    };
  },
  async created() {
    this.loading = true;
    await this.getListProduct();
    await this.getListSize();
    this.loading = false;
  },
  computed: {
    ...mapState({
      listProduct: state => state.product.listProduct,
      listSize: state => state.product.listSize
    })
  },
  methods: {
    ...mapActions({
      getListProduct: "product/getListProduct",
      getListSize: "product/getListSize",
      createProduct: "product/createProduct",
      updateProduct: "product/updateProduct",
      deleteProduct: "product/deleteProduct"
    }),
    showModalAdd() {
      this.productItemID = "add";
      this.visibleModalAdd = true;
      this.formProductItem = {};
    },
    async handleSubmit(e) {
      try {
        await this.$refs.productForm.validate();

        if (this.productItemID == "add") this.createProductAPI(this.formProductItem);
        else this.updateProductAPI({ id: this.productItemID, ...this.formProductItem });
      } catch (error) {
        console.error(error);
      }
    },
    async createProductAPI(payload) {
      let response = await this.createProduct(payload);
      if (response.error) {
        return this.$notification.error({
          message: this.$t("common.Default_Error"),
          description: this.$t("common.Default_Error"),
          duration: 2.5
        });
      }

      this.visibleModalAdd = false;
      this.$refs.productForm.resetFields();
      this.$notification.success({
        message: this.$t("defaultCreateSuccess"),
        description: this.$t("defaultCreateSuccess"),
        duration: 2.5
      });
    },
    async updateProductAPI(payload) {
      let response = await this.updateProduct(payload);
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
      this.productItemID = record.id;
      this.formProductItem = record;
      this.visibleModalAdd = true;
    },
    async onDelete(record) {
      let response = await this.deleteProduct(record);

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
    }
  }
};
</script>
