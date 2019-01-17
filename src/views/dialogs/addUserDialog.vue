<template>
    <Modal :transfer=false title="创建用户" v-model="addUserDialog" @on-cancel="handleRemoveModal(remove)" size="auto"
           :mask-closable="false" :footer-hide="true">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Row class="body-top" v-if="true">
                    <Form ref="form" :model="form" :label-width="80" class="add-teacher-form">
                        <FormItem label="是否注册" style="text-align: center">
                            <el-checkbox v-model="form.doRegist"></el-checkbox>
                        </FormItem>
                        <div class="btn-content">
                            <Button type="primary" style="width: 200px;" @click="createHandler">创建</Button>
                        </div>
                    </Form>
                </Row>
                <Row class='msg'>
                    勾选注册将会提供一个新的注册账号，不勾选将会返回一个手机验证码需要手动注册。
                </Row>
            </Row>
        </base-input>
    </Modal>
</template>

<script>
  import BaseInput from '../../components/BaseInput'
  import {RemoveModal} from './mixins'
  import UploadPanel from '../../components/UploadPanel'
  import {get_student_detail,} from '../../api/modules/tools_student'
  import {create_test_user} from '../../api/modules/tools_user'
  import {Loading} from 'element-ui'
  import {Config} from '../../config/base'
  import {MPop} from '../../components/MessagePop'

  export default {
    mixins: [RemoveModal, MPop],
    props: {
      remove: { type: String },
      payload: {}
    },
    components: {
      'base-input': BaseInput
    },
    data() {
      return {
        addUserDialog: true,
        form: {
          doRegist: true
        },
        loadingInstance: null,
        isSend: false
      }
    },
    computed: {},
    methods: {
      handleClose() {
        this.addUserDialog = false;
      },
      createHandler() {
        create_test_user(this.form.doRegist ? 1 : 0).then(res => {
          if (res.data.res_code === 1) {
            if (this.form.doRegist) {
              this.$alert('用户名：' + res.data.msg.username + '密码：' + res.data.msg.password, '创建成功', {
                confirmButtonText: '确定',
                customClass: 'add-user-dialog-alert',
                callback: action => {
                }
              });
            } else {
              this.$alert('用户名：' + res.data.msg.username + '验证码（请在30分钟内使用注册）：' + res.data.msg.sms_code, '创建成功', {
                confirmButtonText: '确定',
                customClass: 'add-user-dialog-alert',
                callback: action => {
                }
              });
            }
          }
        })
      }
    },
  }
</script>
<style lang="scss" scoped>
    /deep/ .btn-content {
        text-align: center;
    }
    .add-teacher-form {
        margin: 30px;
    }
    /deep/ .ivu-row{
        text-align: center;
    }
</style>
