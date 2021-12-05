<template>
  <PageLayout>
    <template slot="table-content">
      <h1>{{ $t("user.profile") }}</h1>

      <a-form v-if="!loading" :form="form">
        <a-row>
          <a-col v-bind="colHalf" class="pr-1">
            <a-form-item :label="$t(`employee.ID`)">
              <a-input
                disabled
                v-decorator="[
                  'ID',
                  {
                    initialValue: userFullInfo.ID,
                    rules: [
                      {
                        required: true,
                        message: $t(`employee.ID_Empty`)
                      }
                    ]
                  }
                ]"
              >
              </a-input>
            </a-form-item>
          </a-col>

          <a-col v-bind="colHalf" class="pl-1">
            <a-form-item :label="$t(`employee.Name`)">
              <a-input
                v-decorator="[
                  'Name',
                  {
                    initialValue: userFullInfo.Name,
                    rules: [{ required: true, message: 'Please select!' }]
                  }
                ]"
                >{{ userFullInfo.Name }}</a-input
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
                    initialValue: userFullInfo.Sex,
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
                    initialValue: userFullInfo.IDRole,
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
                    initialValue: userFullInfo.Email,
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
              <a-input-password
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

        <a-row>
          <a-button type="primary" @click="handleSubmit">{{ $t("submit") }}</a-button>
        </a-row>
      </a-form>
    </template>
  </PageLayout>
</template>

<script>
import PageLayout from "@/components/PageLayout.vue";

import { mapGetters, mapState, mapActions } from "vuex";
import { FETCH } from "@/store/types";
import moment from "moment";
import _ from "lodash";

export default {
  name: "Profile",
  components: {
    PageLayout
  },
  data() {
    return {
      loading: false,
      form: this.$form.createForm(this, { name: "Profile" }),
      colHalf: {
        xs: 24,
        sm: 12
      }
    };
  },
  async created() {
    this.loading = true;

    let promise = [];
    promise.push(this.getUserInfo(this.userInfo));
    promise.push(this.fetchData());
    await Promise.all(promise);

    this.loading = false;
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      userFullInfo: state => state.staff.userFullInfo,
      listRole: state => state.employee.listRole
    })
  },
  methods: {
    ...mapActions({
      getUserInfo: "staff/getUserInfo",
      updateUserInfo: "staff/updateUserInfo",
      fetchData: `employee/${FETCH}`
    }),
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.updateUserInfoAPI(values);
        }
      });
    },
    async updateUserInfoAPI(payload) {
      let data = await this.updateUserInfo(payload);
      console.log(data);
    }
  }
};
</script>
