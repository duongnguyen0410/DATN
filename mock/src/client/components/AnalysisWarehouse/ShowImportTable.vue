<template>
  <div>
    <a-row>
      <a-col :span="12" class="px-1">
        <a-form-item :label="$t('company')" :required="false">
          <a-input class="w-100" :value="record.company" disabled />
        </a-form-item>
      </a-col>

      <a-col :span="12" class="px-1">
        <a-form-item :label="$t('phone')" :required="false">
          <a-input class="w-100" :value="record.phone" disabled />
        </a-form-item>
      </a-col>
    </a-row>

    <a-table :columns="columns" :data-source="record.data" :rowKey="record => record.id" :pagination="false">
      <template v-for="column of columns" :slot="column.slots.title">
        {{ $t(column.slots.title) }}
      </template>

      <template slot="name" slot-scope="text, record">
        {{ mapNameAsset(record) }}
      </template>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    slots: { title: "name" },
    dataIndex: "id",
    key: "name",
    scopedSlots: {
      customRender: "name"
    }
  },
  {
    slots: { title: "count" },
    dataIndex: "count",
    key: "count"
  },
  {
    slots: { title: "price" },
    dataIndex: "price",
    key: "price"
  }
];

import { mapGetters, mapState, mapActions } from "vuex";

export default {
  name: "ShowImportTable",
  props: ["record"],
  data() {
    return {
      columns
    };
  },
  created() {
    this.getListAssets();
  },
  computed: {
    ...mapState({
      listAssets: state => state.asset.listAssets
    })
  },
  methods: {
    ...mapActions({
      getListAssets: "asset/getListAssets"
    }),
    mapNameAsset(record) {
      let findItem = this.listAssets.find(item => item.id == record.id);
      return findItem.name;
    }
  }
};
</script>
