<template>
  <div class="wrap-import-warehouse">
    <span class="header-notice">
      <a-badge class="notice-badge" :count="listBillItem.length">
        <a-button icon="account-book" type="primary" @click="showModal">{{ $t("bill") }}</a-button>
      </a-badge>
    </span>

    <a-modal v-model="visible" :title="$t('bill')" @ok.prevent="handleSubmit">
      <template slot="footer">
        <a-popconfirm :title="$t('common.Delete_Confirm')" @confirm="() => onDelete()">
          <a-button type="danger" class="custom-bg-yellow">
            <a-icon type="reload" />
          </a-button>
        </a-popconfirm>

        <a-button key="submit" type="primary" @click.prevent="handleSubmit">
          {{ $t("create") }}
        </a-button>
      </template>

      <a-form :form="form">
        <a-row>
          <a-col :span="12" class="px-1">
            <a-form-item :label="$t('name')">
              <a-auto-complete
                class="w-100"
                v-decorator="[
                  'name',
                  {
                    rules: [
                      {
                        required: true,
                        message: $t('fieldRequired')
                      }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12" class="px-1">
            <a-form-item :label="$t('phone')">
              <a-input
                class="w-100"
                v-decorator="[
                  'phone',
                  {
                    rules: [
                      {
                        required: false,
                        message: $t('fieldRequired')
                      },
                      {
                        pattern: /^0\d{9}$/,
                        message: $t('phoneInvalid')
                      }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <a-table
        bordered
        :columns="columns"
        :data-source="listBillItem"
        :rowKey="record => record.id"
        :pagination="false"
      >
        <template slot="title" slot-scope="currentPageData">
          <a-row>
            <span> {{ $t("total") }} : {{ currentPageData.length }}</span>

            <span> {{ $t("total_price") }} :{{ `${totalPrice}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</span>

            <span style="float: right;"> </span>
          </a-row>
        </template>

        <template v-for="column of columns" :slot="column.slots.title">
          {{ $t(column.slots.title) }}
        </template>

        <template slot="price" slot-scope="text">
          {{ `${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
        </template>

        <div class="it-operation" slot="operation" slot-scope="text, record">
          <a-button type="link" @click="() => remove(record)" :disabled="listBillItem.length === 1">
            <a-icon class="dynamic-delete-button" type="minus-circle-o" style="color: red;" />
          </a-button>
        </div>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    slots: { title: "name" },
    dataIndex: "name",
    key: "name",
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon"
    }
  },
  {
    slots: { title: "size" },
    dataIndex: "size",
    key: "size"
  },
  {
    slots: { title: "price" },
    dataIndex: "price",
    key: "price",
    scopedSlots: { customRender: "price" }
  },
  {
    slots: { title: "quantity" },
    dataIndex: "quantity",
    key: "quantity"
  },
  {
    slots: { title: "" },
    key: "operation",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 10
  }
];

import { mapGetters, mapState, mapActions } from "vuex";

let id = 0;
export default {
  data() {
    return {
      columns,
      visible: false,
      listBillItem: []
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "dynamic_form_item" });
    this.form.getFieldDecorator("keys", { initialValue: [], preserve: true });
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    totalPrice() {
      return this.listBillItem.reduce((sum, item) => {
        return (sum += item.price * item.quantity);
      }, 0);
    }
  },
  methods: {
    ...mapActions({
      createBill: "bill/createBill"
    }),
    showModal() {
      this.visible = true;
    },
    remove(record) {
      this.listBillItem = this.listBillItem.filter(item => item.id != record.id);
    },
    addItem(record) {
      let findItem = this.listBillItem.find(item => item.id == record.id);
      if (findItem) {
        findItem.quantity += 1;
        return;
      }
      this.listBillItem.push({ ...record, quantity: 1 });
    },

    handleSubmit(e) {
      this.form.validateFields((err, values) => {
        if (!err && this.listBillItem.length) {
          let { name, phone } = values;
          let payload = {
            customer_name: name,
            phone,
            data: this.listBillItem
          };
          this.createBillAPI(payload);
        }
      });
    },

    setValueUnit(k) {
      const actionAfterEffect = k => {
        const names = this.form.getFieldValue("names");
        const units = this.form.getFieldValue("units");

        if (!names || names.length <= k) return null;
        let asset = this.listAssets.find(item => item.id == names[k]);
        units[k] = asset.unit;

        this.form.setFieldsValue({
          units: units
        });
      };

      setTimeout(() => actionAfterEffect(k), 10);
    },
    async importAssetAPI(payload) {
      let data = await this.importAssets(payload);
      if (data.error) {
        return this.$notification.error({
          message: this.$t("common.Default_Error"),
          description: this.$t("common.Default_Error"),
          duration: 2.5
        });
      }
      this.$notification.success({
        message: this.$t("common.Default_Update_Success"),
        description: this.$t("common.Default_Update_Success"),
        duration: 2.5
      });
      this.visible = false;
    },
    onDelete() {
      this.form.resetFields();
      this.listBillItem = [];
    },
    async createBillAPI(payload) {
      let data = await this.createBill({ ...payload, cashier_id: this.userInfo.data.ID });
      if (data.error) {
        return this.$notification.error({
          message: this.$t("common.Default_Error"),
          description: this.$t("common.Default_Error"),
          duration: 2.5
        });
      }
      this.form.resetFields();
      this.listBillItem = [];
      this.visible = false;
      this.$notification.success({
        message: this.$t("common.Default_Update_Success"),
        description: this.$t("common.Default_Update_Success"),
        duration: 2.5
      });
    }
  }
};
</script>

<style>
.wrap-import-warehouse {
  display: inline;
}

.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>

<style lang="less">
.header-notice {
  display: inline-block;
  transition: all 0.3s;
  span {
    vertical-align: initial;
  }
  .notice-badge {
    color: inherit;
    .header-notice-icon {
      font-size: 16px;
      padding: 4px;
    }
  }
}
.dropdown-tabs {
  border-radius: 4px;
  .tab-pane {
    padding: 0 24px 12px;
    min-height: 250px;
  }
}

.custom-bg-yellow {
  background-color: #e6c107 !important;
  border-color: #e6c107 !important;
}
</style>
