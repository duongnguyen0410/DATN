<template>
  <div class="edit-modal">
    <div class="show-modal" @click="() => (visible = !visible)">
      <slot name="show-button"></slot>
    </div>
    <a-modal
      v-model="visible"
      :title="$t('common.Edit_Item')"
      @ok="handleOk"
      class="small-modal"
    >
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col v-for="(item, index) in dataSource" :key="index" :span="12">
            <a-form-item
              v-if="index == 'AssetCode'"
              :label="$t(`${route}.AssetCode`)"
            >
              <a-select
                :disabled="avaiable.indexOf(index) < 0"
                v-decorator="[
                  index,
                  {
                    initialValue: item,
                    rules: [
                      {
                        required: true,
                        message: $t(`${route}.AssetCode_Empty`),
                      },
                    ],
                  },
                ]"
              >
                <a-select-option
                  v-for="(items, index) in listAsset"
                  :key="index"
                  :value="items.AssetCode"
                  >{{ items.AssetType }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              v-else-if="index == 'IDCreated'"
              :label="$t(`employee.IDCreated`)"
            >
              <a-select
                disabled
                v-decorator="[
                  index,
                  {
                    initialValue: item,
                    rules: [{ required: true, message: 'Please select!' }],
                  },
                ]"
              >
                <a-select-option
                  v-for="(items, index) in listUser"
                  :key="index"
                  :value="items.ID"
                  >{{ items.Name }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item v-else-if="index == 'Sex'" :label="$t('employee.Sex')">
              <a-select
                :disabled="avaiable.indexOf(index) < 0"
                v-decorator="[
                  index,
                  {
                    initialValue: item,
                    rules: [
                      { required: true, message: $t('employee.Sex_Empty') },
                    ],
                  },
                ]"
              >
                <a-select-option
                  v-for="(items, index) in ['Male', 'FeMale']"
                  :key="index"
                  :value="items"
                  >{{ $t(`employee.${items}`) }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              v-else-if="index == 'IDRole'"
              :label="$t('employee.IDRole')"
            >
              <a-select
                :disabled="avaiable.indexOf(index) < 0"
                v-decorator="[
                  index,
                  {
                    initialValue: item,
                    rules: [
                      { required: true, message: $t('employee.Role_Empty') },
                    ],
                  },
                ]"
              >
                <a-select-option
                  v-for="(items, index) in listRole"
                  :key="index"
                  :value="items.ID"
                  >{{ $t(`employee.Role_${items.ID}`) }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              v-else-if="index == 'Email'"
              :key="index"
              label="Email"
            >
              <a-input
                v-decorator="[
                  'Email',
                  {
                    initialValue: item,
                    rules: [
                      {
                        type: 'email',
                        message: $t('employee.Email_Invalid'),
                      },
                      {
                        required: true,
                        message: $t('employee.Email_Empty'),
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>

            <a-form-item
              v-else-if="index == 'Purpose'"
              :label="$t(`${route}.${index}`)"
            >
              <a-select
                :disabled="avaiable.indexOf(index) < 0"
                v-decorator="[
                  index,
                  {
                    initialValue: item,
                    rules: [
                      { required: true, message: 'Please select Purpose!' },
                    ],
                  },
                ]"
              >
                <a-select-option
                  v-for="(items, index) in listPurpose"
                  :key="index"
                  :value="items.ID"
                  >{{ items.Name }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              v-else-if="index == 'IDOwner'"
              :label="$t(`${route}.${index}`)"
            >
              <a-select
                :disabled="avaiable.indexOf(index) < 0"
                v-decorator="[
                  index,
                  {
                    initialValue: item,
                    rules: [
                      { required: true, message: 'Please select Owner!' },
                    ],
                  },
                ]"
              >
                <a-select-option
                  v-for="(items, index) in listOwner"
                  :key="index"
                  :value="items.ID"
                  >{{ items.Name }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              v-else-if="index == 'Status'"
              :label="$t(`${route}.${index}`)"
            >
              <a-select
                :disabled="avaiable.indexOf(index) < 0"
                v-decorator="[
                  index,
                  {
                    initialValue: item,
                    rules: [
                      { required: true, message: 'Please select Owner!' },
                    ],
                  },
                ]"
              >
                <a-select-option
                  v-for="(items, index) in ['Confirmed', 'Not comfirm']"
                  :key="index"
                  :value="items"
                  >{{ items }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              v-else-if="index == 'Password'"
              :label="$t(`${route}.${index}`)"
            >
              <a-input-password
                :placeholder="$t('employee.Password_Empty')"
                v-decorator="[
                  index,
                  {
                    initialValue: item,
                    rules: [
                      {
                        required: true,
                        message: $t('employee.Password_Empty'),
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>

            <a-form-item v-else :label="$t(`${route}.${index}`)">
              <a-input
                :disabled="avaiable.indexOf(index) < 0"
                v-decorator="[
                  index,
                  {
                    initialValue: item,
                    rules: [
                      {
                        required:
                          index == 'IDManaged' || index == 'Confirm'
                            ? false
                            : true,
                        message: $t(`${route}.${index}_Empty`),
                      },
                    ],
                  },
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
  name: "ModalEdit",
  data() {
    return {
      visible: false,
      form: this.$form.createForm(this, { name: "Modal Edit" }),
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
    listOwner: Array,
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
    },
  },
};
</script>
