<template>
  <div class="edit-modal">
    <div class="show-modal" @click="() => (visible = !visible)">
      <slot name="show-button"></slot>
    </div>
    <a-modal v-model="visible" :title="$t('common.Edit_Item')" @ok="handleOk" class="small-modal">
      <a-form :form="form">
        <a-row>
          <a-col v-bind="colHalf" class="pr-1">
            <a-form-item :label="$t(`${route}.ID`)">
              <a-select
                disabled
                v-decorator="[
                  'ID',
                  {
                    initialValue: dataSource.ID,
                    rules: [
                      {
                        required: true,
                        message: $t(`${route}.ID_Empty`)
                      }
                    ]
                  }
                ]"
              >
                <a-select-option v-for="(items, index) in listAsset" :key="index" :value="items.AssetCode"
                  >{{ items.AssetType }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col v-bind="colHalf" class="pl-1">
            <a-form-item :label="$t(`employee.Name`)">
              <a-input
                v-decorator="[
                  'Name',
                  {
                    initialValue: dataSource.Name,
                    rules: [{ required: true, message: 'Please select!' }]
                  }
                ]"
                >{{ dataSource.Name }}</a-input
              >
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col v-bind="colHalf" class="pr-1">
            <a-form-item :label="$t('employee.Sex')">
              <a-select
                v-decorator="[
                  'Sex',
                  {
                    initialValue: dataSource.Sex,
                    rules: [{ required: true, message: $t('employee.Sex_Empty') }]
                  }
                ]"
              >
                <a-select-option v-for="(items, index) in ['Male', 'FeMale']" :key="index" :value="items"
                  >{{ $t(`employee.${items}`) }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col v-bind="colHalf" class="pl-1">
            <a-form-item :label="$t('employee.IDRole')">
              <a-select
                v-decorator="[
                  'IDRole',
                  {
                    initialValue: dataSource.IDRole,
                    rules: [{ required: true, message: $t('employee.Role_Empty') }]
                  }
                ]"
              >
                <a-select-option v-for="(items, index) in listRole" :key="index" :value="items.ID"
                  >{{ $t(`employee.Role_${items.ID}`) }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col v-bind="colHalf" class="pr-1">
            <a-form-item label="Email">
              <a-input
                v-decorator="[
                  'Email',
                  {
                    initialValue: dataSource.Email,
                    rules: [
                      {
                        type: 'email',
                        message: $t('employee.Email_Invalid')
                      },
                      {
                        required: true,
                        message: $t('employee.Email_Empty')
                      }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>

          <a-col v-bind="colHalf" class="pl-1">
            <a-form-item label="Password">
              <a-input
                v-decorator="[
                  'Password',
                  {
                    rules: [{ required: false, message: $t('employee.Password') }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "ModalEditEmployee",
  data() {
    return {
      visible: false,
      form: this.$form.createForm(this, { name: "Modal Edit" }),
      colHalf: {
        xs: 24,
        sm: 12
      }
    };
  },
  props: {
    route: String,
    dataSource: Object,
    avaiable: Array,
    add: Array,
    listRole: Array,
    listUser: Array,
    listAsset: Array,
    listPurpose: Array,
    listOwner: Array
  },
  methods: {
    handleOk(e) {
      this.visible = false;
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("ModalEdit: ", values);
          this.$emit("EditItem", values);
        }
      });

      this.form.resetFields();
    }
  }
};
</script>
