<template>
    <div class='base-list-container'>
        <Row type='flex' justify='space-between' align='middle'>
            <div class='tab-bar'>
                <slot name='tabBar'></slot>
            </div>
            <div class='control-bar'>
                <slot name='controlBar'></slot>
            </div>
        </Row>
        <Table @on-selection-change='selectionChangeHandler' :row-class-name="rowClassName" :highlight-row='canSelect' :show-header='showHeader' :stripe="isStripe"
            :data="tableData" :height="tableHeight" @expand="rowExpandHandler" @row-click='rowClickHandler'>
            <el-table-column width="60" v-for='item in badgeHeader' :key="item.id">
                <template slot-scope="scope">
                    <el-badge class="mark" :value="showBadgeCount(item.prop,scope.row)" />
                </template>
            </el-table-column>
            <el-table-column type="selection" width="55" v-for='item in selectionHeader' :key="item.id"></el-table-column>
            <el-table-column type="index" :label="getHeaderLabel(item)" width="65" v-for='item in sortHeader' :key="item.id"></el-table-column>
            <el-table-column :prop="item.prop" :label="getHeaderLabel(item)" :width="item.width" :min-width="item.minwidth" :show-overflow-tooltip="item.hideOverflow?false:true"
                header-align='left' align='left' v-for='item in normalHeader' :key="item.id" :filters='item.useFilter?getFilters(item.prop):null'
                :filter-method='item.useFilter?doColumnFilter:null'>
                <template slot-scope="scope">
                    <span v-if="item.mixColumn && !item.isBtn && !item.limit && !item.useCombo && !item.useTimePicker &&!item.useMark">
                        {{doMix(item,scope.row)}}
                    </span>
                    <span v-if="!item.mixColumn && !item.isBtn && !item.limit && !item.useCombo && !item.isLink &&!item.useTimePicker &&!item.useMark">
                         {{showPropValue(item.prop,scope.row)}}
                    </span>
                    <a target="_blank" class="a-link" :href="showPropValue(item.prop,scope.row)" v-if="!item.mixColumn && !item.isBtn && !item.limit && item.isLink && !item.useCombo && !item.useTimePicker &&!item.useMark">
                        {{showPropValue(item.prop,scope.row)}}
                    </a>
                    <p v-if='!item.mixColumn && !item.isBtn && item.limit  && !item.useCombo && !item.useTimePicker'>
                        {{showLimiteValue(item.prop,scope.row,item.limit,item.actionName)}}
                        <span class='ellipsis' v-if='scope.row.needLimit && !scope.row.showAll'>...</span>
                        <Button type='text' class='show-all' v-if='scope.row.needLimit && !scope.row.showAll' @click='showLimitText(scope.row,item.actionName)'>显示全部</Button>
                        <Button type='text' class='fold' v-if='scope.row.needLimit && scope.row.showAll' @click='hideLimitText(scope.row,item.actionName)'>折叠</Button>
                    </p>
                    <Button :class="{'prop-btn':true}" type='text' v-if="!item.mixColumn && item.isBtn && !item.useCombo && !item.useTimePicker" @click="handleBtnClick(scope.$index,scope.row,item.param)">
                        {{showPropValue(item.prop,scope.row)}}
                    </Button>
                    <el-select v-if='item.useCombo' v-model="comboDataList[scope.$index]" :multiple='!comboIsSelect' placeholder="请选择" @change='comboChangeHandler(scope.row,scope.$index,item.actionName,item.prop)' :disabled="item.disabledFunc?item.disabledFunc(scope.row):false">
                        <el-option v-for="c in columnComboData[item.comboListIndex]" :key="c.curriculum_id" :label="c[item.listLabel]" :value="c[item.listValue]">
                        </el-option>
                    </el-select>
                    <el-date-picker v-if='item.useTimePicker'
                        v-model="comboDataList[scope.$index]"
                        type="datetime"
                        placeholder="选择日期时间"
                        @change='changeTimeSelect(scope.row,scope.$index,item.actionName,item.prop,item.param)'>
                    </el-date-picker>
                    <span v-if='item.useMark'>
                        <i class='el-icon-check' v-if='scope.row[item.prop] === 1'></i>
                    </span>
                </template>
            </el-table-column>
            <el-table-column :label="getHeaderLabel(item)" :width="item.width" header-align='left' align='left' :show-overflow-tooltip="true" v-for='item in btnHeader'
                :key="item.id">
                <template slot-scope="scope">
                    <div class='handle-component' v-for='btn in item.groupBtn' :key="btn.id" v-if='btn.showFunc?btn.showFunc(scope.row):true'>
                        <Button :type="btn.canDisabled?'primary':'text'" :class="[{'hover-show':btn.hoverShow},btn.btnClass]" @click="handleBtnClick(scope.$index,scope.row,btn.param)"
                            v-if='!btn.isSwitch && !btn.useCheckBox' :disabled="btn.canDisabled?btn.disabeldFunc(scope.row):false">
                            <i :class='btn.text' v-if='btn.isIcon'></i>
                            <span v-if='!btn.isIcon'>{{btn.canDisabled?btn.disabeldFunc(scope.row)?btn.disabledText:btn.text:btn.text}}</span>
                            </Button>
                            <el-switch :value='checkSwitchValue(scope.row,btn.switchKey)' :on-text="checkSwitchDisabled(scope.row,btn.disabledFuc)?btn.disableText:btn.onText"
                                :off-text="checkSwitchDisabled(scope.row,btn.disabledFuc)?btn.disableText:btn.offText" :disabled="checkSwitchDisabled(scope.row,btn.disabledFuc)"
                                on-color='#F06B1D' off-color='#757575' @change='changeSwitchValue(scope.row,btn.switchKey,btn.actionName,btn.param)'
                                v-if='btn.isSwitch'>
                                </el-switch>
                            <el-checkbox v-model='scope.row[btn.switchKey]' @change='changeSwitchValue(scope.row,btn.switchKey,btn.actionName,btn.param)' v-if='btn.useCheckBox'>{{btn.text}}</el-checkbox>
                    </div>
                </template>
            </el-table-column>
            <el-table-column type='expand' :width="item.width" header-align='left' align='left' v-for='item in listExpandHeader' :key="item.id">
                <template slot-scope="scope">
                    <baseList class='child-list data-list' :table-data='scope.row.childData' :header-data='item.childHeader' :is-stripe='false'
                        :parent-data='scope.row' :column-formatter='item.listColumnFormatter' @childBtnClick='childBtnClickHandler'>
                        </baseList>
                </template>
            </el-table-column>
        </Table>
        <slot name="pager"></slot>
    </div>
</template>
<script>
    import BaseList from './BaseList'
    export default {
        name: 'baseList',
        data() {
            return {
                dataChange:false,
                comboDataList: null
            }
        },
        props: {
            //表格数据
            tableData: {
                type: Array,
                required: true
            },
            //header数据
            headerData: {
                type: Array,
                required: true
            },
            showHeader: {
                type: Boolean,
                default: true
            },
            columnFormatter: {
                type: Array
            },
            columnFormatterData: {
                type: Array
            },
            columnComboData: {
                type: Array
            },
            comboModelList: {
                type: Array
            },
            isStripe: {
                type: Boolean,
                default: true
            },
            parentData: {
                type: Object
            },
            tableHeight: {
                type: Number
            },
            canSelect: {
                type: Boolean,
                default: false
            },
            rowClassName: {
                default: 'base-list-row'
            },
            comboIsSelect: {
                type: Boolean,
                default: false
            },
            comboAddDir:{
                type:Number,
                default:1
            }
        },
        watch: {
            headerData(val) {
            },
            tableData(val) {
                this.dataChange = true;
                var vm = this;
                setTimeout(function(){
                    vm.dataChange = false;
                },500);
            },
            comboModelData(val) {
                var i, j;
                if (!this.comboDataList) {
                    this.comboDataList = [];
                    if (this.comboModelList) {
                        for (i = 0; i < this.comboModelList.length; i++) {
                            this.comboDataList.push(this.comboModelList[i]);
                        }
                    }
                }
                else {
                    var foundDeferent;
                    if(this.dataChange)
                    {
                        this.comboDataList = [];
                                for (i = 0; i < val.length; i++) {
                                    this.comboDataList.push(val[i]);
                                }
                    }
                    else if (val.length !== this.comboDataList.length) {
                        if (val.length > this.comboDataList.length) {
                            if (this.comboIsSelect)
                            {
                                if(this.comboAddDir)
                                    this.comboDataList.push(null)
                                else
                                    this.comboDataList.unshift(null)
                            }
                            else
                            {
                                if(this.comboAddDir)
                                    this.comboDataList.push([]);
                                else
                                    this.comboDataList.unshift([]);
                            }
                        }
                        else {

                            if(val.length === this.comboDataList.length - 1)
                            {
                                for (i = 0; i < this.comboDataList.length.length; i++) {
                                if (this.comboIsSelect) {
                                    if (this.comboDataList[i] != val[i]) {
                                        this.comboDataList.splice.splice(i, 1);
                                        break;
                                    }

                                }
                                else {
                                    if (this.comboDataList[i].length != val[i].length) {
                                        this.comboDataList.splice.splice(i, 1);
                                        break;
                                    }
                                    else {
                                        foundDeferent = false;
                                        for (j = 0; j < this.comboDataList[i].length; j++) {
                                            if (val.indexOf(this.comboDataList[i][j]) < 0) {
                                                this.comboDataList.splice.splice(i, 1);
                                                foundDeferent = true;
                                                break;
                                            }
                                        }
                                        if (!foundDeferent) {
                                            for (j = 0; j < val.length; j++) {
                                                if (this.comboDataList[i].indexOf(val[j]) < 0) {
                                                    this.comboDataList.splice.splice(i, 1);
                                                    foundDeferent = true;
                                                    break;
                                                }
                                            }
                                        }
                                        if (foundDeferent)
                                            break;
                                    }
                                }
                            }
                            }
                            else
                            {
                                this.comboDataList = [];
                                for (i = 0; i < val.length; i++) {
                                    this.comboDataList.push(val[i]);
                                }
                            }
                        }
                    }
                }
            }
        },
        mounted() {
            // 资料管理来回切换报异常
            if (this.comboModelData && this.comboModelData.length > 0) {
                this.comboDataList = [];
                for (var i = 0; i < this.comboModelData.length; i++) {
                    this.comboDataList.push(this.comboModelData[i]);
                }
            }
        },
        methods: {
            getHeaderLabel(item) {
                return item.ruleCount?item.label + '(' + item.ruleCount + ')':item.label;
            },
            selectionChangeHandler(selection) {
                this.$emit('selectionChange', selection);
            },
            changeTimeSelect(row, index, actionName, key, param){
                this.$store.dispatch(actionName, { id: row.id, key: key, value: this.comboDataList[index] });

                if(!this.dataChange)
                    this.$emit(param, row);
            },
            showBadgeCount(propname, row)
            {
                return row[propname];
            },
            comboChangeHandler(row, index, actionName, key) {
                this.$store.dispatch(actionName, { id: row.id, key: key, value: this.comboDataList[index] })
            },
            getComboModel(prop, row) {
                return row[prop];
            },
            checkSwitchValue(row, key) {
                return row[key];
            },
            checkSwitchDisabled(row, disFunc) {
                if (disFunc)
                    return disFunc(row);
                return false;
            },
            changeSwitchValue(row, key, actionName, param) {
                if(actionName)
                    this.$store.dispatch(actionName, { id: row.id, key: key, value: !row[key] });
                if(param)
                    this.$emit(param,row);
            },
            rowExpandHandler(row, expanded) {
                if (expanded) {
                    this.$emit('expand', row);
                }
            },
            rowClickHandler(row, event, column) {
                this.$emit('rowClick', row);
            },
            childBtnClickHandler(param, index, parentData) {
                this.$emit('childBtnClick', param, index, parentData);
            },
            handleBtnClick(index, row, param) {

                if (this.parentData) {
                    this.$emit('childBtnClick', param, index, this.parentData);
                }
                else
                    this.$emit(param, index, row);
            },
            formatter(row, propname) {

            },
            doMix(headerData, row) {
                if (headerData.mixFunc) {
                    var value = (headerData.mixFunc(row));
                    if (headerData.useFormatter) {
                        for (var i = 0; i < this.columnFormatter.length; i++) {
                            if (this.columnFormatter[i].columnName == headerData.mixprop) {

                                for (var j = 0; j < this.columnFormatterData[this.columnFormatter[i].dataIndex].length; j++) {
                                    if (value instanceof Array) {
                                        var str = [], list = this.columnFormatterData[this.columnFormatter[i].dataIndex];
                                        value.map((item, index) => {
                                            list.map((_item, _index) => {
                                                if (_item.role_id == item) {
                                                    str.push(_item.role_name);
                                                }
                                            })
                                        })
                                        return str.toString();
                                    } else {
                                        if (this.columnFormatterData[this.columnFormatter[i].dataIndex][j][this.columnFormatter[i].dataProp] == value) {
                                            return this.columnFormatterData[this.columnFormatter[i].dataIndex][j][this.columnFormatter[i].dataValue];
                                        }
                                    }
                                }

                            }
                        }
                    }
                    else {
                        return value;
                    }
                }
            },
            showPropValue(propname, row) {
                if (this.columnFormatter) {
                    for (var i = 0; i < this.columnFormatter.length; i++) {
                        if (this.columnFormatter[i].columnName == propname) {
                            if (this.columnFormatter[i].doFormat) {
                                return this.columnFormatter[i].doFormat(row[propname]);
                            }
                            else {
                                for (var j = 0; j < this.columnFormatterData[this.columnFormatter[i].dataIndex].length; j++) {
                                    if (row[propname] instanceof Array) {
                                        var str = [], list = this.columnFormatterData[this.columnFormatter[i].dataIndex];
                                        row[propname].map((item, index) => {
                                            list.map((_item, _index) => {
                                                if (_item.role_id == item) {
                                                    str.push(_item.role_name);
                                                }
                                                else if(_item.special_id == item) {
                                                    str.push(_item.name);
                                                }
                                            })
                                        })
                                        return str.toString();
                                    } else {
                                        if (this.columnFormatterData[this.columnFormatter[i].dataIndex][j][this.columnFormatter[i].dataProp] == row[propname]) {
                                            return this.columnFormatterData[this.columnFormatter[i].dataIndex][j][this.columnFormatter[i].dataValue];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return row[propname];
            },
            showLimiteValue(propname, row, limit, actionName) {
                var v = this.showPropValue(propname, row);
                if (!row.needLimit && v.length > limit) {
                    this.$store.dispatch(actionName + 'need_limit', { id: row.id, needLimit: true });
                    this.$store.dispatch(actionName + 'show_all', { id: row.id, showAll: false })
                }
                if (row.showAll || !row.needLimit) {
                    return v;
                }
                else {
                    return v.substring(0, limit);
                }
            },
            showLimitText(row, actionName) {
                this.$store.dispatch(actionName + 'show_all', { id: row.id, showAll: true })
            },
            hideLimitText(row, actionName) {
                this.$store.dispatch(actionName + 'show_all', { id: row.id, showAll: false })
            },
            getChildData(row, headerData) {
                return row.childData;
            },
            getFilters(propname) {
                if (this.columnFormatter) {
                    for (var i = 0; i < this.columnFormatter.length; i++) {
                        if (this.columnFormatter[i].columnName == propname) {
                            if (this.columnFormatter[i].doFormat) {
                                break;
                            }
                            else {
                                var result = [];
                                for (var j = 0; j < this.columnFormatterData[this.columnFormatter[i].dataIndex].length; j++) {
                                    result.push({
                                        text: this.columnFormatterData[this.columnFormatter[i].dataIndex][j][this.columnFormatter[i].dataValue],
                                        value: { prop: propname, value: this.columnFormatterData[this.columnFormatter[i].dataIndex][j][this.columnFormatter[i].dataProp] }
                                    })
                                }
                                return result;
                            }
                        }
                    }
                }
                return null;
            },
            doColumnFilter(value, row) {
                return row[value.prop] === value.value;
            }
        },
        computed: {
            normalHeader() {
                return this.headerData.filter(function (item) {
                    if(item.isFree){
                        return true;
                    }
                    return !item.groupBtn && !item.selection && !item.sort && !item.listExpand && !item.badge;
                })
            },
            btnHeader() {
                return this.headerData.filter(function (item) {
                    if(item.isFree){
                        return false;
                    }

                    if (item.groupBtn) {
                        return true;
                    }

                    return false;
                })
            },
            selectionHeader() {
                return this.headerData.filter(function (item) {
                    return item.selection;
                })
            },
            sortHeader() {
                return this.headerData.filter(function (item) {
                    return item.sort;
                })
            },
            listExpandHeader() {
                return this.headerData.filter(function (item) {
                    return item.listExpand;
                })
            },
            badgeHeader() {
                return this.headerData.filter(function (item) {
                    return item.badge;
                })
            },
            comboModelData() {
                return this.comboModelList;
            }
        }
    }

</script>
<style lang='scss'>
    .base-list-container {
        .tab-bar {
            display: inline-block;
            span {
                padding: 10px 15px;
                cursor: pointer;
            }
        }
        .control-bar {
            display: inline-block;
        }
        thead {
            tr {
                th {
                    .cell {
                        font-weight: 200;
                    }
                }
            }
        }
        &.light-header {
            thead {
                tr {
                    height: 50px;
                    th {
                        background-color: #ffffff;
                        .cell {
                            background-color: #ffffff;
                            font-weight: 400;
                            font-size: 14px;
                            color: #757575;
                            letter-spacing: 0;
                        }
                    }
                }
            }
        }
        .base-list-row {
            .cell {
                font-size: 14px;
                color: #141111;
                letter-spacing: 0;
                .handle-component {
                    display: inline-block
                }
                .el-button {
                    margin: 0;
                    span {
                        font-size: 14px;
                        color: #141111;
                        i {
                            color: #757575;
                        }
                    }
                    &:hover {
                        span {
                            color: #F06B1D;
                            i {
                                color: #F06B1D;
                            }
                        }
                    }

                    &.el-button--primary {
                        background-color: #F06B1D;
                        border:0;
                        span {
                            color: #ffffff;
                            i {
                                color: #ffffff;
                            }
                        }
                        &:hover {
                        span {
                            color: #ffffff;
                            i {
                                color: #ffffff;
                            }
                        }
                        }
                        &.is-disabled {
                            background-color: #757575;
                        }
                    }
                }
                .el-select {
                    width: 100%;
                }
                .handle-component {
                    margin-right: 30px;
                    &.prop-btn {
                        margin: 0;
                    }
                    .el-switch {
                        &.is-disabled {
                            .el-switch__core {
                                background-color: #757575!important;
                                .el-switch__button {
                                    display: none;
                                }
                            }
                            .el-switch__label {
                                text-align: center;
                                span {
                                    position: relative;
                                    top: 0;
                                    left: 0;
                                }
                            }
                        }
                    }
                }
            }
            .hover-show {
                display: none;
            }
            &:hover {
                .hover-show {
                    display: inline-block;
                }
            }
            .show-divider {
                border-right: 1px solid #979797;
                padding-left: 14px;
                margin-right: 14px;
            }
            .a-link {
                color: #428bca;
            }
            .a-link:hover {
                text-decoration: underline !important;
            }
        }
    }
</style>
