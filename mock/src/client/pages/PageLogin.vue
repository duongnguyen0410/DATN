<template>
  <div class="container">
    <div class="content">
      <div class="top">
        <div class="header">
          <a-avatar src="/static/icon/logo.png" />
          <span class="title">{{ systemName }}</span>
        </div>
        <div class="desc">Web technical</div>
      </div>

      <div class="login">
        <a-form @submit="onSubmit" :form="form">
          <a-tabs size="large" :tabBarStyle="{ textAlign: 'center' }">
            <a-tab-pane :tab="$t('login.login_account')" key="1">
              <a-form-item>
                <a-input
                  size="large"
                  :placeholder="$t('login.type_username')"
                  v-decorator="[
                    'username',
                    {
                      rules: [
                        {
                          required: true,
                          message: 'Please input your username!'
                        }
                      ]
                    }
                  ]"
                >
                  <a-icon slot="prefix" type="user" />
                </a-input>
              </a-form-item>

              <a-form-item>
                <a-input
                  size="large"
                  :placeholder="$t('login.type_password')"
                  type="password"
                  v-decorator="[
                    'password',
                    {
                      rules: [
                        {
                          required: true,
                          message: 'Please input your password!'
                        }
                      ]
                    }
                  ]"
                >
                  <a-icon slot="prefix" type="lock" />
                </a-input>
              </a-form-item>
            </a-tab-pane>
          </a-tabs>
          <a-form-item style="margin: 0px !important;">
            <language />
          </a-form-item>
          <a-form-item>
            <a-button :loading="logging" class="w-100 mt-3" size="large" htmlType="submit" type="primary">{{
              $t("login.login")
            }}</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import language from "@/components/Language.vue";
import { mapActions } from "vuex";
import { AUTH_REQUEST, FETCH_AUTHENTICATION } from "../store/types";
import { message } from "ant-design-vue";

export default {
  name: "Login",
  data() {
    return {
      logging: false,
      form: this.$form.createForm(this, { name: "Login" })
    };
  },
  components: {
    language
  },
  computed: {
    systemName() {
      return "SOICT-HUST";
    }
  },
  methods: {
    ...mapActions({
      fetch: FETCH_AUTHENTICATION
    }),
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
          console.log("Login: ", values);
          this.logging = true;

          try {
            let result = await this.$store.dispatch(AUTH_REQUEST, values);
            console.log("auth", result);
            this.logging = false;
            if (!result.data.success) alert(this.$t("login.login_invalid"));
            else this.$router.push({ path: `/sale` }); // -> go to Sale page
          } catch (error) {
            this.logging = false;
            this.$notification.error({
              message: this.$t("common.login_failed"),
              description: "Sorry, please login again!",
              duration: 2.5
            });
            console.log(error);
          }
        }
      });
    }
  },
  created: function() {
    this.fetch().finally(param => {
      if (this.$store.getters.isAuthenticated) {
        this.$router.push({ path: `/sale` }); // -> go to Sale page
      }
    });
  }
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background: #f0f2f5 url("https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg") no-repeat center 110px;
  background-size: 100%;
  .content {
    padding: 32px 0;
    flex: 1;
    @media (min-width: 768px) {
      padding: 112px 0 24px;
    }
    .top {
      text-align: center;
      .header {
        height: 44px;
        line-height: 44px;
        a {
          text-decoration: none;
        }
        .logo {
          height: 44px;
          vertical-align: top;
          margin-right: 16px;
        }
        .title {
          font-size: 33px;
          color: rgba(0, 0, 0, 0.85);
          font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
      .desc {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }
    .login {
      width: 368px;
      margin: 0 auto;
      @media screen and (max-width: 576px) {
        width: 95%;
      }
      @media screen and (max-width: 320px) {
        .captcha-button {
          font-size: 14px;
        }
      }
      .icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #1890ff;
        }
      }
    }
  }
}
</style>

<style>
.it-modal-add {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: stretch;
  align-content: stretch;
}

.it-operation {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: baseline;
  align-content: stretch;
}

.it-operation button {
  margin: 0px 3px;
}
</style>
