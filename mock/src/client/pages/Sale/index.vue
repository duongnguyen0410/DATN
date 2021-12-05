<template>
  <PageLayout>
    <template slot="table-content">
      <h1>{{ $t("sale_management") }}</h1>

      <a-table :columns="columns" :data-source="listProduct" bordered :rowKey="record => record.id" :loading="loading">
        <template slot="title" slot-scope="currentPageData">
          <a-row>
            <span> {{ $t("total") }} : {{ currentPageData.length }}</span>

            <span style="float: right;">
              <CreateBill ref="createBill" />
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
          <a-button type="primary" @click="addToBill(record)">
            <a-icon type="plus-square" />
          </a-button>
        </div>
      </a-table>
    </template>
  </PageLayout>
</template>

<script>
import PageLayout from "@/components/PageLayout.vue";
import CreateBill from "@/components/Sale/CreateBill.vue";

import { mapGetters, mapState, mapActions } from "vuex";
import { columns } from "./const";
export default {
  name: "Sale",
  components: {
    PageLayout,
    CreateBill
  },
  data() {
    return {
      columns,
      loading: false,
      visibleModalAdd: false
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
      getListSize: "product/getListSize"
    }),
    addToBill(record) {
      this.$refs.createBill.addItem(record);
    },
    onDelete() {}
  }
};
</script>
