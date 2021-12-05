<template>
  <section class="it-modal-add">
    <div>
      <slot name="exportExcel"></slot>
    </div>
    <div class="show-modal" @click="() => (visible = !visible)">
      <slot name="show-button"></slot>
    </div>
    <a-modal
      v-model="visible"
      :title="$t('common.Add_Tooltip')"
      @ok="handleOk"
      class="small-modal"
    >
      <a-form :form="form">
        <a-row :gutter="24">
          <template v-for="(item, index) in add">
            <a-col v-if="item == 'Email'" :key="index" :span="12">
              <a-form-item label="Email" class="it-form-item">
                <a-input
                  v-decorator="[
                    'Email',
                    {
                      rules: [
                        {
                          type: 'email',
                          message: $t(`${route}.Email_Invalid`),
                        },
                        {
                          required: true,
                          message: $t(`${route}.Email_Empty`),
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>

            <a-col :key="index" v-else-if="item == 'Password'" :span="12">
              <a-form-item
                :label="$t(`${route}.Password`)"
                class="it-form-item"
              >
                <a-input-password
                  :placeholder="$t(`${route}.Password_Empty`)"
                  v-decorator="[
                    item,
                    {
                      rules: [
                        {
                          required: true,
                          message: $t(`${route}.Password_Empty`),
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>

            <a-col :key="index" v-else-if="item == 'Sex'" :span="12">
              <a-form-item :label="$t(`${route}.Sex`)" class="it-form-item">
                <a-select
                  :placeholder="$t(`${route}.Sex_Empty`)"
                  v-decorator="[
                    item,
                    {
                      rules: [
                        {
                          required: true,
                          message: $t(`${route}.Sex_Empty`),
                        },
                      ],
                    },
                  ]"
                >
                  <a-select-option
                    v-for="item in ['Male', 'FeMale']"
                    :key="item"
                    :value="item"
                    >{{ $t(`${route}.${item}`) }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :key="index" v-else-if="item == 'IDRole'" :span="12">
              <a-form-item :label="$t(`${route}.IDRole`)">
                <a-select
                  :placeholder="$t(`${route}.Role_Empty`)"
                  v-decorator="[
                    item,
                    {
                      rules: [
                        {
                          required: true,
                          message: $t(`${route}.Role_Empty`),
                        },
                      ],
                    },
                  ]"
                >
                  <a-select-option
                    v-for="item in listRole"
                    :key="item.ID"
                    :value="item.ID"
                    >{{ $t(`${route}.Role_${item.ID}`) }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :key="index" v-else-if="item == 'AssetCode' && route != 'asset'" :span="12">
              <a-form-item :label="$t(`${route}.AssetCode`)">
                <a-select
                  :placeholder="$t(`${route}.AssetCode_Empty`)"
                  v-decorator="[
                    item,
                    {
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
                    v-for="item in listAsset"
                    :key="item.AssetCode"
                    :value="item.AssetCode"
                    >{{ item.AssetType }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :key="index" v-else-if="item == 'Purpose'" :span="12">
              <a-form-item :label="$t(`${route}.Purpose`)">
                <a-select
                  :placeholder="$t(`${route}.Purpose_Empty`)"
                  v-decorator="[
                    item,
                    {
                      rules: [
                        {
                          required: true,
                          message: $t(`${route}.Purpose_Empty`),
                        },
                      ],
                    },
                  ]"
                >
                  <a-select-option
                    v-for="item in listPurpose"
                    :key="item.ID"
                    :value="item.ID"
                    >{{ item.Name }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :key="index" v-else-if="item == 'Status'" :span="12">
              <a-form-item :label="$t(`${route}.Status`)">
                <a-select
                  :placeholder="$t(`${route}.Status_Empty`)"
                  disabled
                  v-decorator="[
                    item,
                    {
                      initialValue: 'Unconfirm',
                      rules: [
                        {
                          required: true,
                          message: $t(`${route}.Status_Empty`),
                        },
                      ],
                    },
                  ]"
                >
                  <a-select-option
                    v-for="item in ['Unconfirm']"
                    :key="item"
                    :value="item"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :key="index" v-else-if="item == 'IDOwner'" :span="12">
              <a-form-item :label="$t(`${route}.IDOwner`)">
                <a-select
                  :placeholder="$t(`${route}.IDOwner_Empty`)"
                  v-decorator="[
                    item,
                    {
                      rules: [
                        {
                          required: true,
                          message: $t(`${route}.IDOwner_Empty`),
                        },
                      ],
                    },
                  ]"
                >
                  <a-select-option
                    v-for="item in listOwner"
                    :key="item.ID"
                    :value="item.ID"
                    >{{ item.Name }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>

            <a-col v-else :key="index" :span="12">
              <a-form-item :label="$t(`${route}.${item}`)" class="it-form-item">
                <a-input
                  v-decorator="[
                    item,
                    {
                      rules: [
                        {
                          required: true,
                          message: $t(`${route}.${item}_Empty`),
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
          </template>
        </a-row>
      </a-form>
    </a-modal>
  </section>
</template>

<script>
import _ from "lodash";
export default {
  name: "ModalAdd",
  data() {
    return {
      visible: false,
      form: this.$form.createForm(this, { name: "Modal Add" }),
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
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.visible = false;

          console.log("Modal Add: ", values);
          this.$emit("AddItem", values);

          this.form.resetFields();
        }
      });
    },
  },
};
</script>
