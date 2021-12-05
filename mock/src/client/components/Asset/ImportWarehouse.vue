<template>
  <div class="wrap-import-warehouse">
    <a-button icon="import" type="primary" @click="showModal">{{ $t("import_warehouse") }}</a-button>

    <a-modal v-model="visible" :title="$t('import_warehouse_modal')" @ok="handleSubmit">
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleSubmit">
          {{ $t("add") }}
        </a-button>
      </template>

      <a-form :form="form">
        <a-row>
          <a-col :span="12" class="px-1">
            <a-form-item :label="$t('company')" :required="false">
              <a-auto-complete
                class="w-100"
                :data-source="listCompany"
                v-decorator="[
                  'company',
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
            <a-form-item :label="$t('phone')" :required="false">
              <a-input
                class="w-100"
                v-decorator="[
                  'phone',
                  {
                    rules: [
                      {
                        required: true,
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

        <a-row>
          <a-col class="px-1" :span="5">&nbsp;</a-col>
          <a-col class="px-1" :span="6">{{ $t("name") }}</a-col>
          <a-col class="px-1" :span="4">{{ $t("count") }}</a-col>
          <a-col class="px-1" :span="4">{{ $t("price") }}</a-col>
          <a-col class="px-1" :span="4">{{ $t("unit") }}</a-col>
          <a-col class="px-1" :span="1">&nbsp;</a-col>
        </a-row>

        <a-row v-for="(k, index) in form.getFieldValue('keys')" :key="k">
          <a-col class="px-1" :span="5">{{ $t("common.asset") }} {{ index }}</a-col>

          <a-col class="px-1" :span="6">
            <a-form-item :required="false">
              <a-select
                class="w-100"
                allowClear
                show-search
                v-decorator="[
                  `names[${k}]`,
                  {
                    rules: [
                      {
                        required: true,
                        message: $t('fieldRequired')
                      }
                    ]
                  }
                ]"
                :filter-option="filterOptionName"
                @change="setValueUnit(k)"
              >
                <a-select-option v-for="asset in listAssets" :key="asset.id" :value="asset.id">
                  {{ asset.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col class="px-1" :span="4">
            <a-form-item :required="false">
              <a-input-number
                :min="0"
                :step="0.01"
                class="w-100"
                v-decorator="[
                  `counts[${k}]`,
                  {
                    validateTrigger: ['change', 'blur'],
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

          <a-col class="px-1" :span="4">
            <a-form-item :required="false">
              <a-input-number
                v-decorator="[
                  `prices[${k}]`,
                  {
                    validateTrigger: ['change'],
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

          <a-col class="px-1" :span="4">
            <a-form-item :required="false">
              <a-input
                disabled
                v-decorator="[
                  `units[${k}]`,
                  {
                    validateTrigger: ['change', 'blur'],
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
          <a-col class="px-1" :span="1">
            <a-icon
              v-if="form.getFieldValue('keys').length > 1"
              class="dynamic-delete-button"
              type="minus-circle-o"
              :disabled="form.getFieldValue('keys').length === 1"
              @click="() => remove(k)"
            />
          </a-col>
        </a-row>

        <a-form-item v-bind="formItemLayoutWithOutLabel">
          <a-button class="w-100" type="dashed" @click="add"> <a-icon type="plus" /> {{ $t("add") }} </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { mapGetters, createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("asset");

let id = 0;
export default {
  data() {
    return {
      visible: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 }
        }
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 }
        }
      },
      listCompany: []
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "dynamic_form_item" });
    this.form.getFieldDecorator("keys", { initialValue: [], preserve: true });
  },
  computed: {
    ...mapState({
      listAssets: state => state.listAssets,
      listUnits: state => state.listUnits
    })
  },
  methods: {
    ...mapActions({
      importAssets: "importAssets"
    }),
    remove(k) {
      const { form } = this;
      // can use data-binding to get
      const keys = form.getFieldValue("keys");
      // We need at least one passenger
      if (keys.length === 1) {
        return;
      }

      // can use data-binding to set
      form.setFieldsValue({
        keys: keys.filter(key => key !== k)
      });
    },

    add() {
      const { form } = this;
      // can use data-binding to get
      const keys = form.getFieldValue("keys");
      const nextKeys = keys.concat(id++);
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        keys: nextKeys
      });
    },

    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          const { keys, names, counts, prices, company, phone } = values;
          let listItems = [];
          for (let i = 0; i < keys.length; i++) {
            listItems.push({ id: names[i], count: counts[i], price: prices[i] });
          }
          let result = {
            company,
            phone,
            data: listItems
          };
          if (!result.data.length) return;
          this.importAssetAPI(result);
        }
      });
    },
    showModal() {
      this.visible = true;
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
      this.form.resetFields();
    },
    filterOptionName(input, option) {
      if (!input) return true;
      let textOption = option?.componentOptions?.children[0]?.text?.toLowerCase();
      input = input.toLowerCase();

      return textOption.includes(input);
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
