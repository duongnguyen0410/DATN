<template>
  <PageLayout>
    <template slot="table-content">
      <h1>{{ $t("common.bill-management") }}</h1>

      <a-table
        bordered
        :columns="columns"
        :data-source="dataSource"
        :rowKey="record => record.bill_id"
        :loading="loading"
        :pagination="false"
      >
        <template slot="title" slot-scope="currentPageData">
          <a-row>
            <span> {{ $t("total") }} : {{ currentPageData.length }}</span>
            <span> {{ $t("total_money") }} : {{ `${totalMoney}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</span>

            <span style="float: right;">
              <div class="check-point">
                <a-date-picker v-model="duration.start" />
                <a-icon type="arrow-right" />
                <a-date-picker v-model="duration.end" />
              </div>
            </span>
          </a-row>
        </template>

        <div slot="filterDropdown" slot-scope="{ column }" style="padding: 8px">
          <template v-if="column.key == 'cashier_name'">
            <a-select
              v-ant-ref="c => (searchForcus = c)"
              mode="multiple"
              :value="dataFilter.cashier_name"
              style="width: 200px"
              @change="handleSelectCashierName"
            >
              <a-select-option v-for="unit in listUser" :key="unit.ID" :value="unit.Name">
                {{ unit.Name }}
              </a-select-option>
            </a-select>
          </template>
        </div>

        <a-icon slot="filterIcon" type="search" />

        <template v-for="column of columns" :slot="column.slots.title">
          {{ $t(column.slots.title) }}
        </template>

        <template slot="time_check_in" slot-scope="text">
          {{ getMomentData(text) }}
        </template>

        <template slot="total_price" slot-scope="text">
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
import moment from "moment";
import _ from "lodash";

export default {
  name: "BillManagement",
  components: {
    PageLayout,
    CreateBill
  },
  data() {
    return {
      loading: false,
      visibleModalAdd: false,
      duration: {
        start: moment().startOf("month"),
        end: moment().endOf("month")
      },
      dataFilter: {
        cashier_name: []
      },
      searchForcus: null
    };
  },
  async created() {
    this.loading = true;

    let promise = [];
    promise.push(this.getListProduct());
    promise.push(this.getListSize());
    promise.push(this.getBill());
    promise.push(this.getListStaff());
    await Promise.all(promise);

    this.loading = false;
  },
  watch: {
    dataSource() {
      console.log("change", this.dataSource);
    }
  },
  computed: {
    ...mapState({
      listProduct: state => state.product.listProduct,
      listSize: state => state.product.listSize,
      listBill: state => state.bill.listBill,
      listUser: state => state.bill.listUser
    }),
    dataSource() {
      let clone = _.cloneDeep(this.listBill);
      let map = this.getMapBillFromCloneObject(clone);
      map = this.calcuteTotalPrice(map);
      let listDataSource = this.flatMapDataSource(map);
      listDataSource = this.getFilterByName(listDataSource);
      listDataSource = this.getFilterByDuration(listDataSource);
      return listDataSource;
    },
    columns() {
      let self = this;
      return columns.filter(item => {
        switch (item.key) {
          case "cashier_name": {
            item.sorter = (a, b) => a.cashier_name.localeCompare(b.cashier_name);
            item.filtered = this.dataFilter.cashier_name.length;
            item.onFilterDropdownVisibleChange = visible => visible && setTimeout(() => this.searchForcus.focus(), 0);
            break;
          }

          case "customer_name": {
            item.sorter = (a, b) => a.customer_name.localeCompare(b.customer_name);
            break;
          }

          case "time_check_in": {
            item.sorter = (a, b) => {
              let early = moment(a.time_check_in);
              let later = moment(b.time_check_in);
              return early > later ? 1 : early < later ? -1 : 0;
            };
            break;
          }
        }

        return true;
      });
    },
    totalMoney() {
      return this.dataSource.reduce((sum, item) => {
        sum += item.total_price;
        return sum;
      }, 0);
    }
  },
  methods: {
    ...mapActions({
      getListProduct: "product/getListProduct",
      getListSize: "product/getListSize",
      getBill: "bill/getBill",
      getListStaff: "bill/getListStaff"
    }),
    addToBill(record) {
      this.$refs.createBill.addItem(record);
    },
    getMapBillFromCloneObject(clone) {
      let result = {};
      clone.map(item => {
        if (!result[item.bill_id]) {
          let { bill_id, cashier_name, customer_name, time_check_in } = item;
          result[item.bill_id] = { bill_id, cashier_name, customer_name, time_check_in, data: [] };
        }

        result[item.bill_id].data.push(item);
      });
      return result;
    },
    calcuteTotalPrice(map) {
      for (const key in map) {
        const item = map[key];
        item.total_price = item.data.reduce((sum, item) => {
          sum += +item.price * +item.quantity;
          return sum;
        }, 0);
      }

      return map;
    },
    flatMapDataSource(map) {
      let data = [];
      for (const key in map) {
        const element = map[key];
        data.push(element);
      }
      return data;
    },
    getMomentData(text) {
      return moment(text).format("YYYY-MM-DD HH:mm:ss");
    },
    handleSelectCashierName(e) {
      this.dataFilter.cashier_name = e;
    },
    getFilterByName(clone) {
      if (!this.dataFilter.cashier_name || !this.dataFilter.cashier_name.length) return clone;
      console.log(clone, this.dataFilter.cashier_name);
      return clone.filter(item => this.dataFilter.cashier_name.includes(item.cashier_name));
    },
    getFilterByDuration(clone) {
      let early = this.duration.start;
      let later = this.duration.end;
      return clone.filter(item => {
        let current = moment(item.time_check_in);
        let isBetween = current >= early && current <= later;
        return isBetween;
      });
    }
  }
};
</script>
