<template>
    <Modal :transfer=false :title="payload.code_name" :width="1000" v-model="redeemCodeDetailDialog"
           @on-cancel="handleRemoveModal(remove)" size="auto"
           :mask-closable="false" :footer-hide="true">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Row class="body-top">
                    <data-list class='data-list' :isStripe='false' :table-data='dataList' :header-data='dataHeader'
                               :column-formatter='listColumnFormatter'
                               :column-formatter-data='listColumnFormatterData'></data-list>
                </Row>
                <Row class='body-footer' type='flex' justify='space-between' align='middle'>
                    <div class='number'>
                        <span>已兑换：{{used_count}}个</span>
                        <span>未兑换：{{total_count - used_count}}个</span>
                        <span>总数量：{{total_count}}个</span>
                    </div>
                    <Page :current="curPage" :page-size='pageSize' @on-change="handleCurrentChange"
                          :total="total_count"/>
                </Row>
            </Row>
        </base-input>
    </Modal>
</template>

<script>
  import BaseInput from '../../components/BaseInput'
  import BaseList from '../../components/BaseList'
  import {doTimeFormat} from '../../components/Util'
  import {RemoveModal} from './mixins'
  import {get_list_by_group} from '../../api/modules/tools_redeem_code'
  import {Config} from '../../config/base'
  import {mapState} from 'vuex'

  export default {
    mixins: [RemoveModal],
    props: {
      remove: {
        type: String
      },
      payload: {}
    },
    components: {'base-input': BaseInput, 'data-list': BaseList},
    data() {
      return {
        redeemCodeDetailDialog: true,
        loadingInstance: null,
        used_count: 999,
        total_count: 999,
        false_count: 999,
        cannot_count: 2,
        normal_count: 2,
        pageSize: 15,
        curPage: 1,
        dataList: []
      }
    },
    methods: {
      getData() {
        this.loadingInstance = this.$LoadingY({message: "加载中，请稍后", show: true})
        setTimeout(() => {
          this.loadingInstance.close();
        }, Config.base_timeout);
        get_list_by_group(this.payload.id, this.curPage - 1, this.pageSize).then(res => {
          if (res.data.res_code === 1) {
            var dataList = res.data.msg.codes
            this.dataList = dataList.map((item) => {
              if (item.state == 1) item.use_time = null
            })
            this.dataList = dataList
            this.used_count = res.data.msg.used_count;
            this.total_count = res.data.msg.total_count;
            if (this.loadingInstance) this.loadingInstance.close();
          }
        })
      },
      handleClose() {
        this.redeemCodeDetailDialog = false;
      },
      handleCurrentChange(val) {
        this.curPage = val;
        this.getData();
      },
    },
    computed: {
      ...mapState({stateList: state => state.redeem_code.state_list}),
      dataHeader() {
        return [
          {
            prop: 'code',
            label: '兑换码',
          },
          {
            prop: 'state',
            label: '状态',
            width: 120
          },
          {
            prop: 'user_id',
            label: '用户ID',
            width: 100
          },
          {
            prop: 'nickname',
            label: '昵称',
            width: 120
          },
          {
            prop: 'realname',
            label: '姓名',
            width: 120
          },
          {
            prop: 'phone',
            label: '电话',
            width: 150
          },
          {
            prop: 'use_time',
            label: '兑换时间',
            width: 200
          }
        ];
      },
      listColumnFormatter() {
        return [{
          columnName: 'use_time',
          doFormat: doTimeFormat
        }, {
          columnName: 'state',
          dataIndex: 0,
          dataProp: 'id',
          dataValue: 'name'
        }]
      },
      listColumnFormatterData() {
        return [this.stateList];
      },
    },
    mounted() {
      this.getData();
    }
  }
</script>
<style lang="scss">
    /deep/ .ivu-modal-body {
        padding: 0;
    }

    #remeed-code-detail-container {
        .close-dialog-panel {
            position: absolute;
            top: -40px;
            right: 3.5px;
            z-index: 99999;
            font-size: 30px;
            cursor: pointer;

            &:before {
                // color: #fff;
                color: #757575;
            }
        }

        .body-footer {
            height: 80px;
            background-color: #F6F6F6;
            padding: 0 50px;

            .number {
                span {
                    margin-right: 30px;
                    font-size: 16px;
                    color: #333333;
                    letter-spacing: 0;
                }
            }
        }
    }
</style>
