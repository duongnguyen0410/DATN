<template>
  <page-layout>
    <template slot="table-content">
      <modal-add v-bind="{ add, listRole, route: 'employee' }" @AddItem="onAdd">
        <a-tooltip slot="show-button" placement="top" :title="$t('common.Add')">
          <a-button type="primary">
            {{ $t("common.Add") }}
          </a-button>
        </a-tooltip>
      </modal-add>

      <template v-if="dataSource.length && fetchedDataSource">
        <a-table
          bordered
          :data-source="dataSource"
          :columns="columns"
          :scroll="{ x: 1300 }"
          :rowKey="item => item.ID"
          @change="handleTableChange"
        >
          <template v-for="column of columns" :slot="column.slots.title">
            {{ $t(`employee.${column.slots.title}`) }}
          </template>

          <div class="it-operation" slot="operation" slot-scope="text, record, index">
            <modal-edit
              @EditItem="onEdit"
              route="employee"
              :data-source="record"
              :avaiable="avaiable"
              :add="add"
              :listRole="listRole"
              :listUser="listUser"
              :key="index"
            >
              <a-tooltip slot="show-button" placement="top" :title="$t('common.Edit_Tooltip')">
                <a-button type="primary">
                  <a-icon type="edit" />
                </a-button>
              </a-tooltip>
            </modal-edit>
            <a-popconfirm
              v-if="dataSource.length"
              :title="$t('common.Delete_Confirm')"
              @confirm="() => onDelete(record)"
            >
              <a-tooltip placement="bottom" :title="$t('common.Delete_Tooltip')">
                <a-button type="danger">
                  <a-icon type="delete" />
                </a-button>
              </a-tooltip>
            </a-popconfirm>
          </div>

          <div slot="Name" slot-scope="text">
            {{ text }}
          </div>

          <div slot="Email" slot-scope="text">
            {{ text }}
          </div>

          <div slot="IDCreated" slot-scope="text">
            {{ mapUser(text) }}
          </div>

          <div slot="IDRole" slot-scope="text, record, index">
            <a-tag :key="index" :color="text.indexOf('A') == 0 ? 'volcano' : 'geekblue'">
              {{ $t(`employee.Role_${text}`) }}
            </a-tag>
          </div>

          <div slot="Sex" slot-scope="text, record, index">
            <a-tag :key="index" :color="text.indexOf('F') == 0 ? 'volcano' : 'geekblue'">
              {{ $t(`employee.${text}`) }}
            </a-tag>
          </div>
        </a-table>
      </template>
    </template>
  </page-layout>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import { mapGetters, createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("employee");
import { columns } from "./const";

import { FETCH, CREATE, DELETE, UPDATE } from "@/store/types";

import PageLayout from "@/components/PageLayout.vue";
import ModalAdd from "@/components/ModalAdd.vue";
import ModalEdit from "./ModalEdit.vue";
import ExportExcel from "@/components/ExportExcel.vue";

export default {
  name: "Employee",
  data() {
    return {
      columns,
      form: this.$form.createForm(this, {
        name: "Form Employee"
      }),
      visible: false,
      filter: {},
      sorter: {},
      fetchedDataSource: false
    };
  },
  components: {
    PageLayout,
    ModalAdd,
    ModalEdit,
    ExportExcel
  },
  async created() {
    try {
      let { success, data } = await this.fetch();
      if (success && data.total.length) this.configColumnFromResponse(data);
    } catch (error) {
      this.$notification.error({
        message: this.$t("common.Default_Error"),
        description: this.$t("common.Default_Error"),
        duration: 2.5
      });
    }

    this.fetchedDataSource = true;
  },
  computed: {
    ...mapState({
      dataSource: state => state.dataSource,
      avaiable: state => state.avaiable,
      add: state => state.add,
      listRole: state => state.listRole,
      listUser: state => state.listUser
    })
  },
  methods: {
    ...mapActions({
      fetch: FETCH,
      create: CREATE,
      delete: DELETE,
      update: UPDATE
    }),
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter);
      this.filter = { ...filters };
      this.sorter = { ...sorter };
    },
    onAdd(item) {
      console.log(item);
      this.create(item).catch(error => {
        alert(this.$t("common.Default_Error"));
      });
    },
    async onEdit(item) {
      try {
        await this.update(item);
        this.$notification.success({
          message: this.$t("common.Default_Update_Success"),
          description: this.$t("common.Default_Update_Success"),
          duration: 2.5
        });
      } catch (error) {
        this.$notification.error({
          message: this.$t("common.Default_Error"),
          description: "Update failed!",
          duration: 2.5
        });
      }
    },
    onDelete(item) {
      this.delete(item).catch(error => {
        alert(this.$t("common.Default_Error"));
      });
    },
    mapUser(user_id) {
      let user = this.listUser.find(item => item.ID == user_id);
      return user ? user.Name : "";
    },
    mapDate(item) {
      moment.locale(this.$i18n.locale);
      return moment(item).format("L") + " " + moment(item).format("LTS");
    },
    configColumnFromResponse(data) {
      this.columns.filter(item => {
        switch (item.key) {
          case "IDRole": {
            let set = new Set(
              _.reduce(
                data.total,
                function(result, value, key) {
                  result.push(value.IDRole);
                  return result;
                },
                []
              )
            );
            let arr = Array.from(set);
            let filters = _.reduce(
              arr,
              (result, value, key) => {
                result.push({
                  text: this.$t(`employee.Role_${value}`),
                  value: value
                });
                return result;
              },
              []
            );

            item.sorter = (a, b) => a.IDRole.localeCompare(b.IDRole);
            item.filters = [...filters];
            item.onFilter = (value, record) => record.IDRole.indexOf(value) == 0;
            item.width = 200;
            break;
          }

          case "Sex": {
            item.sorter = (a, b) => a.Sex.localeCompare(b.Sex);
            item.filters = [
              { text: this.$t("employee.Male"), value: "Male" },
              { text: this.$t("employee.FeMale"), value: "FeMale" }
            ];
            item.onFilter = (value, record) => record.Sex.indexOf(value) == 0;
            break;
          }

          case "Name": {
            item.sorter = (a, b) => a.Name.localeCompare(b.Name);
            break;
          }
        }
        return true;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.header-search {
  .search-icon {
    font-size: 16px;
    cursor: pointer;
  }

  .search-input {
    border: 0;
    border-bottom: 1px rgba(3, 5, 6, 0.23) solid;
    transition: width 0.3s ease-in-out;

    input {
      border: 0;
      box-shadow: 0 0 0 0;
    }

    &.leave {
      width: 0px;

      input {
        display: none;
      }
    }

    &.enter {
      width: 200px;

      input:focus {
        box-shadow: 0 0 0 0;
      }
    }
  }
}

.it-modal-add {
  margin-bottom: 12px;
}
</style>
