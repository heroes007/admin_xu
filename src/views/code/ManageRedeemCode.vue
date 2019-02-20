<template>
<div class='manage-redeem-code'>
    <div class='manage-redeem-code-search-mask' v-if='showPopper' @click='showPopper = false'>

</div>
    <el-popover
  ref="searchpop"
  placement="bottom"
  width="280"
  trigger="manual"
  popper-class='manage-redeem-code-search-pop'
  :visible-arrow='false'
  v-model='showPopper'>
  <div class='search-result'>
    <h2>{{searchResult.code_name}}</h2>
    <Row class='code' type='flex' justify='space-between'>
        <span>兑换码：{{searchData}}</span>
        <span :class="{'not-use':searchResult.state !== -1}">
            <i :class='iconClass'></i>
            {{getCodeStateStr(searchResult.state)}}
        </span>
    </Row>
    <Row class='form-item' v-if='searchResult.state === -1'>
        用户ID：{{searchResult.user_id}}
    </Row>
    <Row class='form-item' v-if='searchResult.state === -1'>
        昵称：{{searchResult.nickname}}
    </Row>
    <Row class='form-item' v-if='searchResult.state === -1'>
        姓名：{{searchResult.realname}}
    </Row>
    <Row class='form-item' v-if='searchResult.state === -1'>
        电话：{{searchResult.phone}}
    </Row>
  </div>
</el-popover>
    <Row class='header' type='flex' justify='space-between' align='middle'>
        <Input
  placeholder="兑换码查询"
  icon="search"
  v-model="searchData"
  :on-icon-click="searchHandler"
  v-popover:searchpop>
</Input>
<Button type='primary' icon="plus" @click='addCode'>添加兑换码</Button>
    </Row>
    <data-list class='data-list light-header' @export='exportHandler' @detail='detailHandler' :rowClassName='getRowClassName' :isStripe='false' :table-data='dataList' :header-data='dataHeader'
    :column-formatter='listColumnFormatter' :column-formatter-data='listColumnFormatterData'></data-list>
    </div>
</template>

<script>
import BaseList from '../../components/BaseList'
import {
        mapActions,
        mapState,
        mapGetters
    } from 'vuex'
import {
    Dialog
} from '../dialogs'
import {
    ADD_REMEED_CODE,
    REMEED_CODE_DETAIL
} from '../dialogs/types'
import {
    Loading
} from 'element-ui'
import {
    doTimeFormat,
    exportCsv
} from '../../components/Util'
import {
    Config
} from '../../config/base'

import { query_code, get_list_by_group } from '../../api/modules/tools_redeem_code'
export default {
    mixins: [Dialog],
    data() {
        return {
            searchData:'',
            loadingInstance: null,
            showPopper:false,
            searchResult:{
                code_name:'',
                user_id:0,
                nickname:'',
                realname:'',
                phone:'',
                use_time:null,
                state:1
            }
        }
    },
    computed: {
         ...mapState({
                isLoading:state => state.redeem_code.isLoading,
                dataList: state => state.redeem_code.code_list,
                projectId:state => state.project.select_project_id,
                productionList:state => state.production.production_list
            }),
        iconClass(){
            return {
                'el-icon-information':this.searchResult.state !== -1,
                'el-icon-circle-check':this.searchResult.state == -1
            }
        },
        categoryList() {
            return this.$store.state.task.task_category_list;
        },
        dataHeader() {
            return [
                {
                    label:'序号',
                    width:90,
                    sort:true
                },{
                    label:'兑换码名称',
                    prop:'code_name',
                    minwidth:300
                },{
                    label:'所属产品',
                    prop:'param',
                    width:180,
                },
                {
                    prop:'',
                label:'起止时间',
                width: 200,
                mixColumn: true,
                mixFunc: (function(data) {
                    var open_date = doTimeFormat(data.open_time);
                    var end_date = doTimeFormat(data.ex_time);
                    return open_date + '至' + end_date;
                })

            },
            {
                prop:'offline_term_count',
                label:'线下学期次数',
                width:120
            },
            {
                prop:'count',
                label:'兑换码数量',
                width:120
            },
            {
                prop:'used_count',
                label:'已兑换数量',
                width:120
            },
            {
                label: '操作',
                width: 400,
                groupBtn: [{
                    text: '查询',
                    param: 'detail'
                }, {
                    isSwitch:true,
                    switchKey:'is_valid',
                    onText:'启用',
                    offText:'停用',
                    disableText:'失效',
                    actionName:'change_redeem_code_valid',
                    disabledFuc:(function(row){
                        if(new Date(row.end_time).getTime() < new Date().getTime())
                        {
                            return true;
                        }
                        return false;
                    })

                },{
                  text: '导出',
                  param: 'export',
                  btnClass:'btn-export'
                }]
            }
            ]
        },
         listColumnFormatter() {
                return [{
                    columnName: 'param',
                    dataIndex: 0,
                    dataProp: 'id',
                    dataValue: 'title'
                }]
            },
            listColumnFormatterData() {
                return [this.productionList];
            },
    },
    watch: {
        isLoading(val) {
            if (val) {
                this.loadingInstance = this.$LoadingY({message: "加载中，请稍后",show: true})
                setTimeout(() => {
                    this.loadingInstance.close();
                }, Config.base_timeout);
            } else {
               if(this.loadingInstance) this.loadingInstance.close();
            }
        }
    },
    methods: {
        ...mapActions([
            'get_code_group_list',
            'get_production_list'
        ]),
        exportHandler(index, row) {
            this.loadingInstance = this.$LoadingY({message: "加载中，请稍后",show: true})
                setTimeout(() => {
                    this.loadingInstance.close();
                }, Config.base_timeout);
            get_list_by_group(row.id,0,100000).then(res => {
                if(res.data.res_code === 1)
                {
                    var data = res.data.msg.codes;
                    for(var i=0;i<data.length;i++)
                    {
                        if(data[i].state === -1)
                        {
                            data[i].useTime = doTimeFormat(data[i].use_time);
                        }
                        else
                        {
                            data[i].useTime = '';
                        }
                        data[i].stateStr = this.getCodeStateStr(data[i].state);
                    }
                    var fileds = ['code','stateStr','user_id','nickname','realname','phone','useTime'];
                    var filedNames = ['兑换码','状态','用户ID','昵称','姓名','电话','使用时间'];
                    exportCsv(data,fileds,filedNames,row.code_name);
                }
               if(this.loadingInstance) this.loadingInstance.close();
            })
        },
        getCodeStateStr(state){
            if(state === 0)
                return '不可用';
            else if(state === 1)
                return '未兑换';
            else if(state === -1)
                return '已兑换';
            else if(state === -2)
                return '已作废';
        },
        searchHandler(){
            if(!this.searchData)
            {
                this.$alert('请输入要搜索的兑换码！', '提示', {
                                        confirmButtonText: '确定',
                                        callback: action => { }
                                    });
            }
            this.loadingInstance = this.$LoadingY({message: "加载中，请稍后",show: true})
                setTimeout(() => {
                    this.loadingInstance.close();
                }, Config.base_timeout);
            query_code(this.searchData).then(res => {
                if(res.data.res_code === 1)
                {
                    this.searchResult = res.data.msg;
                    this.showPopper = true;
                }
               if(this.loadingInstance) this.loadingInstance.close();
            })
        },
        getRowClassName(row,index) {
            if(new Date(row.end_time).getTime() < new Date().getTime())
            {
                return 'base-list-row invalid-row';
            }
            return 'base-list-row valid-row';
        },
        addCode(){
            this.handleSelModal(ADD_REMEED_CODE)
        },
        detailHandler(index ,row){
            this.handleSelModal(REMEED_CODE_DETAIL,row);
        }
    },
    mounted() {
        this.get_code_group_list(this.projectId);
        this.get_production_list({
                project_id: this.projectId,
                page_index: 0,
                page_size: 999,
                state: [0, 1]
            });
    },
    components: {
        'data-list': BaseList
    }
}
</script>
<style lang='scss'>
.manage-redeem-code-search-pop {
    .search-result {
        width:280px;
        height:280px;
        padding:20px 10px;
        box-sizing: border-box;
        h2 {
            margin: 0;
            width: 100%;
            text-align: center;
            background-color: #F6F6F6;
border-radius: 4px;
height: 45px;
line-height: 45px;
font-size: 16px;
color: #333333;
letter-spacing: 0;
        }

        .code {
            border-bottom:1px solid #CCCCCC;
            height: 54px;
            line-height: 54px;
            span {
font-size: 16px;
color: #3DAAFF;
letter-spacing: 0;

&.not-use {
    color: #757575;
}
            }
        }

        .form-item {
            margin-top: 16px;
font-size: 16px;
color: #333333;
letter-spacing: 0;
        }
    }
}

.manage-redeem-code {
        .manage-redeem-code-search-mask {
    position: fixed;
    z-index: 1000;
    width: 100%;
    height: 100%;
    left: 0;
    top:0;
    background-color: rgba(255,255,255,0.6);
}
    .header {
        height:60px;
        background-color: #333333;
        padding: 0 40px;
        .el-input {
            width:250px;
            input {
border-radius: 100px;
border-color: #cccccc;
            }
            
            i {
                color: #3B3B3B;
            }   
        }
        .el-button {
            width:120px;
            height:26px;
            background-color: #3DAAFF;
            padding: 0;
            border: 0;
            border-radius: 2px;
        }
    }
    .data-list {
        .base-list-row {
            height: 65px;
            &.invalid-row {
                background-color:  #FBFBFB;
            }
            .handle-component {
                .el-button {
                    &.btn-export {
border: 1px solid #333333;
border-radius: 22px;
width: 56px;
height:22px;
padding: 0;
                    }
                }
            }
        }
    }
}
</style>
