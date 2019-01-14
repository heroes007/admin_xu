<template>
<Modal title="产品协议" :footer-hide=true v-model="editProtocol" @on-cancel="handleRemoveModal(remove)" :closeOnClickModal="false">
    <base-input @closedialog="handleClose">
      <Row slot="body">
          <Form class="add-task-form">
                <FormItem>
                    <text-editor ref='description_editor' :content='description'/>
               </FormItem>
                <FormItem class="btns">
                    <Button class="btn-orange" @click="handleSubmit('form')">保存</Button>
               </FormItem>
            </Form>
      </Row>
    </base-input>
</Modal>
</template>
<!-- task_id = 19 -->
<script>
import { RemoveModal } from "./mixins";
import api from "../../api/modules/config";
import Editor from "../../components/Editor";
import BaseInput from "../../components/BaseInput";
export default {
  mixins: [RemoveModal],
  components: {
    "base-input": BaseInput,
    // "upload-panel": UploadPanel,
    "text-editor": Editor
    // "data-list": BaseList
  },
  props: {
    remove: {
      type: String
    },
    payload: {}
  },
  data() {
    return {
      editProtocol: "",
      description: "",
      current_protocol_id: ''
    };
  },
  mounted() {
    this.handleQueryProtocol()
  },
  methods: {
    handleClose() {
      this.description = "";
      this.editProtocol = false;
    },
    handleQueryProtocol() {
        
      api
        .post("api/protocol/get_product_protocol", {
          product_id: this.payload
        })
        .then(res => {
          if (res.data.res_code == 1) {
            this.description = res.data.msg.content;
            this.current_protocol_id = res.data.msg.protocol_id;
          } else {
            this.$Message.warning(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 保存协议
     */
    handleSubmit() {
        var content = this.$refs.description_editor.editor.getContent();
            if(this.content){
               this.$Message.warning('请填写协议~');
                return false;
            }
      api
        .post("api/protocol/update_protocol", {
          protocol_id: this.current_protocol_id,
          name: "",
          content: content
        })
        .then(res => {
          if (res.data.res_code == 1) {
            this.$Message.warning('保存成功');
            this.editProtocol = false;
          } else {
            this.$Message.warning(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss">
#edit-protocol-container {
  @import "base.scss";
  input,
  textarea {
    resize: none;
    outline: none;
  }
  .close-dialog-panel {
    position: absolute;
    top: -40px;
    right: 13.5px;
    z-index: 99999;
    font-size: 30px;
    cursor: pointer;
    &:before {
      // color: #fff;
      color: #757575;
    }
  }
  .el-dialog {
    width: 800px;
    background: none;

    .curriculum-list {
      .title {
        padding: 0 20px;
        h2 {
          font-size: 16px;
        }
      }
      .search-bar {
        padding: 0 20px;
        margin-bottom: 20px;
        .el-button {
          background: #fb843e;
          border-radius: 4px;
          border: 0;
        }
      }
    }

    .body-top {
      padding-bottom: 10px;
    }

    .el-dialog__header {
      background: #333333;
      border-radius: 4px 4px 0 0;
      padding: 16px;
    }
    .el-dialog__body {
      padding: 0;
      background: #fff;
      border-radius: 0 0 4px 4px;
    }
    .add-task-form {
      width: 80%;
      margin: 30px auto;
      .el-date-editor--datetimerange,
      .el-select {
        width: 100%;
      }
      input {
        border-radius: 0;
        border: 1px solid #cccccc;
      }
      .approval {
        .el-form-item__content {
          text-align: left;
          line-height: 38px;
        }
      }

      .row-container {
        height: 36px;
      }

      .el-input-number {
        width: 100%;
      }
      // -------- 修改了单选框样式 ------------

      .el-radio__inner {
        display: inline-block;
        position: relative;
        border: 1px solid #bfcbd9;
        border-radius: 4px;
        box-sizing: border-box;
        width: 18px;
        height: 18px;
        background-color: #fff;
        z-index: 1;
        transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
          background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
        border-color: #979797;
        background-color: transparent;
        &::after {
          box-sizing: content-box;
          content: "";
          border: 2px solid #fff;
          border-left: 0;
          border-top: 0;
          height: 8px;
          left: 5px;
          position: absolute;
          top: 1px;
          transform: rotate(45deg) scaleY(0);
          width: 4px;
          transition: transform 0.15s cubic-bezier(0.71, -0.46, 0.88, 0.6) 0.05s;
          transform-origin: center;
          border-radius: 0;
          background-color: transparent;
        }
      }
      .is-checked {
        .el-radio__label {
          border: 1px solid #5fa137;
          color: #5fa137;
        }

        .el-radio__inner {
          border-color: #5fa137;
          background-color: #5fa137;
        }
        .el-checkbox__inner {
          border-color: #5fa137;
          background-color: #5fa137;
        }
        .el-radio__inner::after {
          transform: rotate(45deg) scaleY(1);
        }
      }
      // -------- 修改了单选框样式 ------------
      @mixin el-upload-common($w) {
        .el-upload {
          text-align: left;
          width: 100%;
          .el-icon-upload {
            color: #999999;
          }
          .el-upload__tip {
            font-size: 12px;
            color: #757575;
            letter-spacing: 0;
            line-height: 20px;
            text-align: left;
            margin-top: 0;
          }
          .el-dragger {
            // float: left;
            // width: 240px;
            border-radius: 0;
            background-color: #f6f6f6;
            border: 1px solid #cccccc;
            width: 100%;
            height: $w;
            .el-icon-upload {
              margin-left: 0;
              // margin-top: $_top;
            }
            .el-dragger__text {
              font-size: 14px;
              color: #757575;
              letter-spacing: 0;
              line-height: 14px;
              margin-top: 20px;
            }
          }
        }
      }
      .upload-form1 {
        @include el-upload-common(200px);
      }
      .check-upload {
        text-align: left;
      }
      .inter-data {
        .el-form-item__label {
          width: 100px !important;
        }
        .el-form-item__content {
          margin-left: 102px !important;
        }
      }
      .upload-file-list {
        text-align: left;
        width: 40%;
        .datetime {
          position: absolute;
          right: -170px;
          top: 16px;
        }
        .file-item {
          cursor: pointer;
          // padding-top: 6px;
          // padding-bottom: 6px;
          // margin-top: 15px;
          // margin-bottom: 15px;
          position: relative;

          &:hover {
            color: #fb843e;
          }
          .filename {
            width: 150px;
            overflow: hidden;
            height: 30px;
            line-height: 30px;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
          }
          .el-icon-delete {
            position: absolute;
            right: -20px;
            top: 10px;
          }
        }
      }
      .btns {
        margin-top: 50px;
        .el-form-item__content {
          margin-left: 0 !important;
          margin-top: 10px !important;
          line-height: 0;
          .finish-btn {
            margin-left: 0;
            margin-top: 20px;
            background: #fb843e;
            border-radius: 4px;
            width: 160px;
            height: 36px;
            border: 0;
            &:last-child {
              margin-left: 8px;
            }
          }
          // button {
          //     width: 100px;
          //     height: 36px;
          //     background: #FFFFFF;
          //     border: 1px solid #999999;
          //     border-radius: 4px;
          // }
        }

        .btn-pre {
          float: left;
          color: #333333;
        }

        .btn-orange {
          background: #fb843e;
          border: 1px solid #f06b1d;
          border-radius: 4px;
          color: #fff;
          width: 200px;
          height: 36px;
        }
      }
      .el-form-item__content {
        // margin-left: 0 !important;
        line-height: 0;
        .el-textarea {
          .el-textarea__inner {
            background: #ffffff;
            border: 1px solid #cccccc;
            // height: 140px;
            border-radius: 0;
            // width: 390px;
          }
        }
        .editor {
          .vueditor {
            line-height: 100%;
          }
        }
      }
    }
  }
}
</style>
