<template>
    <div>
        <Table @on-row-click="rowClick" :columns="columns" :data="datas" ref="tables" class="tables"
               @on-expand="expand" :height="tabelHeight" @on-select="selectTables" @on-select-all="selectAll"
               @on-selection-change="onSelectionChange" @on-select-all-cancel="selectAllCancel"
               @on-select-cancel="selectCancel">
            <!-- content-html -->
            <template slot-scope="{ column, row, index }" slot="content-html">
                <span v-html="row[column.key]"></span>
            </template>
            <template slot-scope="{ column, row, index }" slot="accessory">
                <div style="white-space: nowrap; text-overflow: ellipsis; width: 100%;overflow: hidden">
                    <span v-if="row.accessory&&row.accessory != '-'">
                        <Icon type="ios-link" style="margin-right: 10px;height: 20px;"/>
                    </span>
                    <span>{{row.accessory}}</span>
                </div>
            </template>
            <!--stateInform判断通知按钮展示内容-->
            <template slot-scope="{ column, row, index }" slot="operation">
                <!-- operationLower operationStudentNum-->
                <span v-if="column.hasOwnProperty('operationLower')|| column.hasOwnProperty('operationStudentNum')">
                    <span v-for="(t,i) in handleOperation(column, row)" :key="i">
                        <span v-if="handleBtnShow(column,row,t)" :class="handleBtnShowClass(column,row,t)">
                            <Button type="text" size="small" style="margin-right: 5px" @click="show(row,index,t[1])">
                                {{handleBtnText(t,row,column)}}
                            </Button>
                        </span>
                    </span>
                </span>
                <span v-else-if="column.isShowBtn" v-show="Boolean(row.use_state)">
                    <span v-for="(t,i) in column.operation" :key="i">
                        <span v-if="handleBtnShow(column,row,t)" :class="handleBtnShowClass(column,row,t)">
                            <Button type="text" size="small" style="margin-right: 5px" @click="show(row,index,t[1])">
                                {{handleBtnText(t,row,column)}}
                            </Button>
                        </span>
                    </span>
                </span>
<!--                state为true展示按钮一，否则按钮二-->
                <span v-else-if="column.isAppraise">
                    <span v-for="(t,i) in row.state == 1 ? column.operation.slice(0, 1) : column.operation.slice(1, 2)" :key="i" :class="row.state !== 1 ? 'colorGray' : ''">
                        <Button type="text" size="small" style="margin-right: 5px" @click="show(row,index,t[1])">
                            {{handleBtnText(t,row,column)}}
                        </Button>
                    </span>
                </span>
<!--                自定义展示按钮位置-->
                <span v-else-if="column.localList">
                    <span v-for="(t,i) in row.localState ? column.operation : spliceList(column.operation, column.localList)" :key="i">
                        <span v-if="handleBtnShow(column,row,t)" :class="handleBtnShowClass(column,row,t)">
                            <Button type="text" size="small" style="margin-right: 5px" @click="show(row,index,t[1])">
                                {{handleBtnText(t,row,column)}}
                            </Button>
                        </span>
                    </span>
                </span>
                <span v-else
                      v-for="(t,i) in row.stateInform ? row.state == 1 ? column.operation.slice(0,2).concat(column.operation.slice(3,4)) : column.operation.slice(2,4) : column.operation"
                      :key="i">
                    <span v-if="handleBtnShow(column,row,t)" :class="handleBtnShowClass(column,row,t)">
                        <Button type="text" size="small" style="margin-right: 5px" @click="show(row,index,t[1])">
                            {{handleBtnText(t,row,column)}}
                        </Button>
                    </span>
                </span>
                <Switch :class="column.isShow ? '' : 'operation_btn_show'"
                        v-if="column.isSwitch && handleBtnShow(column,row) && !Boolean(row.use_state)"
                        v-model="row[column.switchKey]" size="large" @on-change="change(row)">
                    <span slot="open">{{column.switchList[0]}}</span>
                    <span slot="close">{{column.switchList[1]}}</span>
                </Switch>
                <Card v-if="column.isCard && row.use_state == 1" class="card-show">
                    <div class="triangle"></div>
                    <div class="card-box">
                        <img class="card-img" :src="row.head_img_url" alt="">
                        <div class="card-content">
                            <div class="content-user">
                                <div class="content-user-name">{{row.realname}}</div>
                                <img class="content-user-sex" :src="row.sex == 1 ? male : female" alt="">
                            </div>
                            <div class="content-userid">用户ID：{{row.user_id}}</div>
                        </div>
                    </div>
                </Card>
            </template>
            <template slot-scope="{ column, row, index }" slot="radio-item">
                <Radio @on-change="radioChange(row,column)" v-model="row[column.key]"></Radio>
            </template>
            <template slot-scope="{ column, row, index }" slot="state-item">
                <span v-if="column.stateOther"
                      :class="'state-key-other'+row[column.stateKey]">{{row[column.key]}}</span>
                <span v-else :class="'state-key'+row[column.stateKey]">{{row[column.key]}}</span>
            </template>
            <template slot-scope="{ column, row, index }" slot="sex">{{row.sex == 0 ? '女' : '男'}}</template>
            <template slot-scope="{ column, row, index }" slot="_index">{{row._index == 0 ? '未认证' : '已认证'}}</template>
        </Table>
    </div>
</template>
<script>
    import postData from 'src/api/postData'
    import male from '../assets/img/male.png'
    import female from '../assets/img/female.png'

    export default {
        data() {
            return {
                female, male,
                datas: [],
                columns: [],
                btnList: [],
            }
        },
        props: {
            column: {
                type: Array,
                default: () => []
            },
            tableData: {
                type: Array,
                default: () => []
            },
            // isSerial -->  序号
            isSerial: {
                type: Object,
                // default: false
            },
            // 选项
            isSelection: {
                type: Boolean,
                default: false
            },
            // 选项
            isSelectionRight: {
                type: Boolean,
                default: false
            },
            //筛选选项
            selectList: {
                type: Array,
            },
            seeUrl: {
                type: String,
                default: ''
            },
            tabelHeight: {
                type: Number
            },
            selectIndex: {
                type: Number
            },
            deleteData: {
                type: Boolean
            },
        },
        watch: {
            tableData(_new) {
                this.tableData = _new;
                this.handleTableData(_new)
            },
            column(_new) {
                this.handleColumns(_new)
            },
            deleteData() {
                this.$refs.tables.objData[this.selectIndex]._isChecked = false;
            }
        },
        methods: {
            spliceList(list, data) {
                let newList = []
                data.forEach((item, index) => {
                    newList.push(list[index])
                })
                return newList
            },
            handleOperation(c, row) {
                let list = c.operation
                if (c.hasOwnProperty('operationLower')) return row.state == -1 ? [list[0], list[3]] : list
                if (c.hasOwnProperty('operationStudentNum')) return row.student_num ? list : [list[0], list[1], list[3], list[4]]
            },
            rowClick(row, rowIndex) {
                this.show(row, rowIndex, 'row-click', true)
            },
            expand(row, states) {
                this.$emit('expand', row, states)
            },
            //operationLast为true操作展示第一个，false展示最后一个
            handleBtnShowClass(c, r, t) {
                if (!c.hasOwnProperty('operation_btn_hide')) {
                    if (c.hasOwnProperty('operationLast') && c.operationLast) {
                        if (c.operation[c.operation.length - 1][0] == t[0]) return 'operation_btn_see'
                    } else if (c.isInform) {
                        if (c.operation[0][0] == t[0] || c.operation[2][0] == t[0]) return 'operation_btn_see'
                    } else if (c.operation[0][0] == t[0]) return 'operation_btn_see'
                    if (!r.operation_btn_show) return 'operation_btn_show'
                    return ''
                }
                return ''
            },
            handleBtnShow(c, r, t) {
                if (c.hasOwnProperty('operation_btn_hide')) {
                    return c.operation_btn_hide && t[2] ? r.mark_state : true
                } else return true
            },
            radioChange(r, c) {
                this.datas.map((t, k) => {
                    t.state = false
                    if (t.id === r.id) {
                        t.state = true;
                        this.$emit('radioChange', t)
                    }
                })
            },
            handleTableData(d) {
                let d3 = [];
                if (d.length > 0) {
                    d3 = this.$config.setDataInit(d)
                    d3.map((t, k) => {
                        if (this.isSerial && this.isSerial.isSerial) t.serial_number = this.isSerial.current > 1 && this.isSerial.pageSize ? this.$config.addZero((this.isSerial.current - 1)*this.isSerial.pageSize + (k + 1)) : this.$config.addZero(k + 1)
                        if (t.hasOwnProperty('slot')) {
                            if (t.operation.length > 0) this.btnList = t.operation
                        }
                        t.operation_btn_show = false
                    })
                }
                this.datas = d3
            },
            show(row, rowIndex, params, bool) {
                if(params === 'downTable') {
                    postData('code/getCodeHistory', {code_id: row.id, page_size: 20, page_num: 1}).then(res => {
                        res.data.list.forEach(item => {
                            item.product_name = row.product_name
                            item.organization_name = row.organization_name
                            item.is_state = item.use_state == 0 ? '未使用' : '已使用'
                            item.state_name = item.state == -1 ? '已失效' : '生效中'
                        })
                        let titleList = [
                            {title: '兑换码', key: 'code'},
                            {title: '兑换产品', key: 'product_name'},
                            {title: '所属机构', key: 'organization_name'},
                            {title: '使用状态', key: 'is_state'},
                            {title: '用户姓名', key: 'realname'},
                            {title: '用户ID', key: 'user_id'},
                            {title: '有效状态', key: 'state_name'},
                        ]
                        this.$refs.tables.exportCsv({
                            filename: row.title,
                            columns: titleList,
                            data: res.data.list
                        });
                    })
                }
                if (this.seeUrl && !bool) {
                    postData(this.seeUrl, {id: row.organization_id}).then((res) => {
                        if (res.data) {
                            row = {...row, ...res.data[0]}
                            row.head_img_url = res.data[0].admin[0].head_img_url
                            if (this.selectList) row.list = this.getArray(this.selectList, res.data[0].admin[0])
                            this.$emit(params, row, rowIndex)
                        }
                    })
                } else {
                    if (this.selectList) row.list = this.getArray(this.selectList, row)
                    this.$emit(params, row, rowIndex)
                }
            },
            handleColumns(c, type) {
                if (c && c.length > 0) {
                    if (type) {
                        if (this.isSerial && this.isSerial.isSerial) c.unshift({title: '序号', key: 'serial_number', minWidth: 70})
                        if (this.isSelection) c.unshift({type: 'selection', width: 60, align: 'right'})
                        if (this.isSelectionRight) c.push({type: 'selection', width: 100, align: 'center'})
                    }
                    c.map((t) => {
                        if (t.hasOwnProperty('slot') && t.slot == "operation" && !t.hasOwnProperty('align')) t.align = 'left'
                        if (!t.hasOwnProperty('align')) t.align = 'center'
                        t.tooltip = true
                    })
                    this.columns = c
                }
            },
            change(row) {
                this.$emit('table-swtich', row)
            },
            handleBtnText(t, r, c) {
                // operation_state -- 处理 兑换码
                if (Array.isArray(t[0])) {
                    if (c.operation_state) return r.state == 1 ? t[0][0] : t[0][1]
                    return c.operation_state && r.use_state ? t[0][0] : c.operation_state && r.use_state === 0 ? t[0][1] : t[0]
                } else return t[0]
            },
            getArray(name, string) {
                string.role_name = this.$config.status(string.role_id)
                let arr = [], str
                name.forEach((item, index) => {
                    for (var x in string) {
                        if (x == item.title) {
                            if (item.title == 'role_id' && x == 'role_id' && string[x] == 1) {
                                arr.push(`${item.name}: ${string.realname}`)
                            } else {
                                str = item.name + ':' + ' ' + (string[x] === '' || string[x] == null ? '-' : string[x])
                                arr.push(str)
                            }
                        }
                    }
                })
                return arr
            },
            selectCancel(selection, row) {
                this.$emit('select-tables', selection, row)
            },
            selectTables(selection, row) {
                this.$emit('select-tables', selection, row)
            },
            selectAllCancel(selection, row) {
                this.$emit('on-select-all', selection, row)
            },
            selectAll(selection, row) {
                this.$emit('on-select-all', selection, row)
            },
            onSelectionChange(selection) {
                this.$emit('on-selection-change', selection)
            },
        },
        mounted() {
            this.handleColumns(this.column, 1)
            this.handleTableData(this.tableData)
        }
    }
</script>
<style lang='less' scoped>
    .triangle {
        position: relative;
        top: -33px;
        left: 50%;
        transform: translateX(-50%);
        height: 0;
        width: 28px;
        border-width: 0 18px 18px;
        border-style: solid;
        border-color: transparent transparent #fff;
    }

    .card-box {
        display: flex;
        align-items: center;

        .card-img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
        }

        .card-content {
            margin-left: 20px;

            .content-user {
                display: flex;
                align-items: center;

                .content-user-name {
                    font-family: PingFangSC-Medium;
                    font-size: 20px;
                    color: #474C63;
                    letter-spacing: 0;
                }

                .content-user-sex {
                    height: 17px;
                    width: 17px;
                    margin-left: 8px;
                }
            }

            .content-userid {
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #474C63;
                letter-spacing: 0;
                margin-top: 20px;
            }
        }
    }

    .card-show {
        position: absolute;
        display: none;
    }

    /deep/ .ivu-table-row-hover {
        .card-show {
            position: absolute;
            left: 50%;
            transform: translateY(20%);
            display: inline-block;
            width: 254px;
            height: 118px;
            z-index: 1;
            border: none;
        }
    }

    /deep/ .ivu-card-body {
        box-shadow: 0 0 10px 0 rgba(147, 151, 173, 0.22);
        background-color: #fff;
        border-radius: 8px;
    }

    .state-key1, .state-key-other1 {
        color: #2EBF07;
    }

    /deep/ .ivu-table-row {
        color: #474C63;
    }

    .state-key-other0 {
        color: #474C63;
    }

    .state-key0 {
        color: #F54802;
    }

    .state-key2 {
        color: #666;
    }

    /deep/ .ivu-table th {
        height: 50px;
    }

    /deep/ .ivu-btn {
        color: #4098FF;
    }

    .colorGray{
        /deep/ .ivu-btn {
            color: #1B1B1B;
            cursor: auto;
        }
    }


    /deep/ .ivu-btn-text:focus {
        box-shadow: none
    }

    /deep/ .ivu-radio-inner {
        /*border-radius: unset;*/
        width: 22px;
        height: 22px;
        border-radius: 4px;
        border: 1px solid #9397AD;
    }

    /deep/ .ivu-radio-wrapper {
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 0;
    }

    /deep/ .ivu-radio .ivu-radio-inner {
        background-position: 1.5px 1.5px;
    }

    /deep/ .ivu-radio-checked .ivu-radio-inner {
        background-image: url('../assets/icons/icon/tick.png');
        background-repeat: no-repeat;
        background-size: 16px 16px;
        background-position: 1.5px 1.5px;
        border-color: #5298f7;
    }

    /deep/ .ivu-radio-inner::after {
        display: none;
    }

    /deep/ .ivu-tooltip-rel {
        width: 100%;
    }

    /deep/ .row-switch-disable {
        color: #9397AD;
    }

    .poptip-main {
        display: flex;
        margin-top: 20px;
        margin-bottom: 10px;
        align-items: center;

        .poptip-img {
            width: 80px;
            height: 80px;
            margin-right: 20px;
            border-radius: 40px;
        }

        .poptip-content {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;

            h2 {
                font-family: PingFangSC-Medium;
                font-size: 20px;
                color: #474C63;
                text-align: left;
                margin-bottom: 10px;
            }

            p {
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #474C63;
            }
        }
    }

    /deep/ .ivu-table td.demo-table-info-column {
        color: #F54802;
    }

    /deep/ .ivu-btn {
        display: flex;
    }

    .operation_btn_show {
        display: none
    }

    /deep/ .operation_btn_see .ivu-btn-text {
        margin-left: -5px;
    }

    /deep/ .ivu-table-row:hover {
        .operation_btn_show {
            display: inline-block;

            .ivu-btn-text {
                margin-left: -5px;
            }
        }
    }
</style>
