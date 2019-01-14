<template>
    <div class='team-grouping-view'>
        <Row class='handle-bar' type='flex' justify='center' align='middle'>
            <Button type='text' @click='dialogVisible = true' v-if="activeName === 'step1'">修改规则</Button>
            <Button type='primary' @click='makeGroupHandler' v-if="activeName === 'step1'">生成分组</Button>
            <h3 v-if="activeName === 'step2'">共筛选出 {{teamGroupData.length}} 种分组方式</h3>
            <Button type='primary' @click="activeName = 'step1'" v-if="activeName === 'step2'">返回</Button>
        </Row>
        <div class='radar-modal' v-if='showDetail' @click='showDetail = false'>
            <my-radar class='radar-container' :style='radarStyle' :data='radarData' :options='radarOption'/>
        </div>
        <el-tabs v-model="activeName">
            <el-tab-pane name='step1'>
                <data-list class='data-list light-header' :height='listHeight' @selectionChange='selectChangeHandler' @detail='detailHandler'
                    :isStripe='false' :table-data='memberData' :header-data='dataHeader'></data-list>
            </el-tab-pane>
            <el-tab-pane name='step2'>
                <div class='result-container'>
                    <Row type='flex' class='result-item' justify='center' align='middle'>
                        <Col>
                            第一组
                        </Col>
                        <Col>
                            剩余队员
                        </Col>
                    </Row>
                    <Row class='result-item' type='flex' :key="index" v-for='(item,index) in teamGroupData' justify='center' align='middle'>
                        <Col>
                            <div @click='detailHandler(item.team1)'>
                                <span :key="m_idx" v-for='(m,m_idx) in item.team1'>{{m.name}}</span>
                            </div>
                        </Col>
                        <Col>
                            <div @click='detailHandler(item.team2)'>
                                <span :key="m_idx" v-for='(m,m_idx) in item.team2'>{{m.name}}</span>
                            </div>
                        </Col>
                    </Row>
                </div>
            </el-tab-pane>
        </el-tabs>
        <el-dialog title="分组规则" :visible.sync="dialogVisible" custom-class='team-grouping-rule-dialog'>
            <Form label-width="100px" class="rule-form">
                <FormItem :label="item.label" v-for='(item, index) in propList' :key='item.prop'>
                    <el-input-number v-model="item.ruleCount" :min='0' :max='5'></el-input-number>
               </FormItem>
                <FormItem label="剩余人规则">
                    <el-switch v-model="sameRule" on-text="规则同上" off-text="自定义" :width='100'>
                    </el-switch>
               </FormItem>
                <FormItem :label="item.label" v-for='(item, index) in propList' :key='item.prop' v-if='!sameRule'>
                    <el-input-number v-model="item.team2RuleCount" :min='0' :max='5'></el-input-number>
               </FormItem>
                <FormItem label-width='0'>
                    <Button type='primary' @click='confirmRuleChange'>确认修改</Button>
               </FormItem>
            </Form>
        </el-dialog>
    </div>
</template>

<script>
    import BaseList from '../../components/BaseList';
import MyRadarChart from '../../components/RadarChart'
    export default {
        data() {
            return {
                memberData: [
                    { id: 1, name: '翟云志', pro_1: 1, pro_2: 1, pro_3: 0, pro_4: 0, pro_5: 0, pro_6: 0, pos: 1, pro_7: 0 },
                    { id: 2, name: '松哥', pro_1: 0, pro_2: 1, pro_3: 1, pro_4: 0, pro_5: 0, pro_6: 0, pos: 1, pro_7: 0 },
                    { id: 3, name: '董晨晨', pro_1: 0, pro_2: 0, pro_3: 1, pro_4: 1, pro_5: 1, pro_6: 1, pos: 2, pro_7: 1 },
                    { id: 4, name: '郭正', pro_1: 0, pro_2: 1, pro_3: 1, pro_4: 1, pro_5: 1, pro_6: 1, pos: 2, pro_7: 1 },
                    { id: 5, name: '雷正龙', pro_1: 0, pro_2: 0, pro_3: 0, pro_4: 1, pro_5: 1, pro_6: 0, pos: 3, pro_7: 1 },
                    { id: 6, name: '杜锐', pro_1: 1, pro_2: 1, pro_3: 1, pro_4: 1, pro_5: 0, pro_6: 0, pos: 1, pro_7: 0 },
                    { id: 7, name: '亚伟', pro_1: 1, pro_2: 0, pro_3: 0, pro_4: 0, pro_5: 0, pro_6: 0, pos: 1, pro_7: 1 },
                    { id: 8, name: 'caicai', pro_1: 1, pro_2: 1, pro_3: 0, pro_4: 1, pro_5: 0, pro_6: 0, pos: 1, pro_7: 1 },
                    { id: 9, name: 'bobo', pro_1: 0, pro_2: 1, pro_3: 0, pro_4: 0, pro_5: 0, pro_6: 0, pos: 1, pro_7: 0 },
                    { id: 10, name: '南哥', pro_1: 0, pro_2: 1, pro_3: 0, pro_4: 1, pro_5: 1, pro_6: 0, pos: 2, pro_7: 1 },
                    { id: 11, name: '海博', pro_1: 0, pro_2: 1, pro_3: 0, pro_4: 1, pro_5: 0, pro_6: 0, pos: 2, pro_7: 1 },
                    { id: 12, name: '张丹拓', pro_1: 0, pro_2: 1, pro_3: 0, pro_4: 1, pro_5: 0, pro_6: 0, pos: 2, pro_7: 1 },
                    { id: 13, name: '明明', pro_1: 0, pro_2: 1, pro_3: 0, pro_4: 1, pro_5: 0, pro_6: 0, pos: 2, pro_7: 1 },
                    { id: 14, name: '崔健', pro_1: 0, pro_2: 1, pro_3: 1, pro_4: 1, pro_5: 0, pro_6: 0, pos: 1, pro_7: 0 },
                    { id: 15, name: '于总', pro_1: 0, pro_2: 1, pro_3: 1, pro_4: 1, pro_5: 0, pro_6: 0, pos: 2, pro_7: 0 },
                    { id: 16, name: '长欣', pro_1: 0, pro_2: 1, pro_3: 1, pro_4: 1, pro_5: 0, pro_6: 0, pos: 2, pro_7: 1 },
                ],
                teamGroupData: [],
                dataHeader: [
                    {
                        selection: true
                    },
                    {
                        label: '序号',
                        width: 90,
                        sort: true
                    }, {
                        label: '姓名',
                        width: 120,
                        prop: 'name',
                    }, {
                        label: '组织',
                        width: 90,
                        prop: 'pro_1',
                        useMark: true,
                        ruleCount: 1,
                        team2RuleCount: 1
                    }, {
                        label: '转换',
                        width: 90,
                        prop: 'pro_2',
                        useMark: true,
                        ruleCount: 3,
                        team2RuleCount: 1
                    }, {
                        label: '3分球',
                        width: 90,
                        prop: 'pro_3',
                        useMark: true,
                        ruleCount: 2,
                        team2RuleCount: 1
                    }, {
                        label: '下线防守',
                        width: 120,
                        prop: 'pro_4',
                        useMark: true,
                        ruleCount: 3,
                        team2RuleCount: 1
                    }, {
                        label: '低位进攻',
                        width: 120,
                        prop: 'pro_5',
                        useMark: true,
                        ruleCount: 1,
                        team2RuleCount: 1
                    }, {
                        label: '高位策应',
                        width: 120,
                        prop: 'pro_6',
                        useMark: true,
                        ruleCount: 1,
                        team2RuleCount: 1
                    },{
                        label: '二次进攻',
                        width: 120,
                        prop: 'pro_7',
                        useMark: true,
                        ruleCount: 2,
                        team2RuleCount: 1
                    }, {
                        label: '操作',
                        groupBtn: [{
                            text: '修改',
                            param: 'detail'
                        }]
                    }],
                activeName: 'step1',
                sameRule: true,
                selection: [],
                dialogVisible: false,
                rules: [],
                rules2: [],
                showDetail: false,
                radarStyle:{},
                radarData:{
                    labels : ["学术功底","综合素质","培训表现","语言表达","教学技能"],
                    datasets :[
                        {
                            data : [1,2,3,4,5],
                            backgroundColor:'rgba(240,107,29,0.40)',
                            borderColor:'rgba(240,107,29,0.50)',
                            pointBackgroundColor:'#F06B1D',
                            pointBorderColor:'transparent',
                            // radius: 5,
                            // pointRadius:5,
                            // pointHoverRadius:5
                        },
                        {
                            data : [10,10,10,10,10],
                            backgroundColor:"rgba(240,107,29,0.10)",
                            borderWidth:0,
                            pointRadius:0,
                            borderColor:'transparent'
                        },
                    ]
                },
                radarOption:{
                    animation:false,
                    legend:{
                        display:false
                    },
                    scale: {
                        ticks: {
                            min:0,
                            max:10,
                            stepSize:1,
                            display:false,
                        },
                        angleLines: {
                            color: "rgba(240,107,29,0.20)"
                        },
                        pointLabels: {
                            fontSize:12,
                            fontColor:'#3b3b3b'
                        },
                        gridLines:{
                            display:false
                        }
                    },
                    tooltips:{
                        enabled:false
                    }
                }
            }
        },
        watch: {
            sameRule(val) {
                if (val) {
                    for (var i = 0; i < this.propList.length; i++) {
                        this.rules2[i] = this.propList[i].ruleCount;
                        this.propList[i].team2RuleCount = this.propList[i].ruleCount;
                    }
                }
            }
        },
        computed: {
            listHeight() {
                return window.innerHeight - 60;
            },
            selectedList() {
                if (this.selection.length > 0)
                    return this.selection;
                return this.memberData;
            },
            propList() {
                return this.dataHeader.filter(function (item) {
                    return item.prop && item.prop.indexOf('pro') > -1;
                })
            }
        },
        methods: {
            selectChangeHandler(val) {
                this.selection = val;
            },
            detailHandler(team) {
                this.radarData.labels = [];
                this.radarData.datasets[0].data = [];
                this.radarData.datasets[1].data = [];
                var count;
                var maxCount = this.selection.length > 0?Math.max(this.selection.length - 5,5):Math.max(this.memberData.length - 5,5);
                this.radarOption.scale.ticks.max = maxCount;
                for(var i=0;i<this.propList.length;i++)
                {
                    this.radarData.labels.push(this.propList[i].label);
                    this.radarData.datasets[1].data.push(maxCount);
                    count = 0;
                    for(var j=0;j<team.length;j++)
                    {
                        count += team[j][this.propList[i].prop];
                    }
                    this.radarData.datasets[0].data.push(count);
                }
                this.showDetail = true;
            },
            sortTeam(a, b) {
                if (a.pos < b.pos)
                    return -1;
                else if (a.pos == b.pos)
                    return 0;
                return 1;
            },
            confirmRuleChange() {
                for (var i = 0; i < this.propList.length; i++) {
                    this.rules[i] = this.propList[i].ruleCount;
                    this.rules2[i] = this.propList[i].team2RuleCount;
                }
                this.dialogVisible = false;
            },
            getMemberRuleData(val) {
                var result = 0;
                if (val.ruleData)
                    return val.ruleData;
                for (var i = 0; i < this.propList.length; i++) {
                    if (val[this.propList[i].prop] === 1) {
                        result += Math.pow(2, i);
                    }
                }
                val.ruleData = result;
                return result;
            },
            checkRules(list, useRule2) {

                var ruleBinary = [];
                var memberRuleCount = [];
                var i, j;
                var memberData;
                for (i = 0; i < this.rules.length; i++) {
                    ruleBinary.push(Math.pow(2, i));
                    memberRuleCount.push(0);
                }

                for (i = 0; i < list.length; i++) {
                    memberData = this.getMemberRuleData(list[i]);
                    for (j = 0; j < ruleBinary.length; j++) {
                        if ((memberData | ruleBinary[j]) == memberData) {
                            memberRuleCount[j]++;
                        }
                    }
                }

                var pass = true;
                var useRule = useRule2 ? this.sameRule?this.rules:this.rules2 : this.rules;

                for (i = 0; i < useRule.length; i++) {
                    if (useRule[i] > memberRuleCount[i]) {
                        pass = false;
                        break;
                    }
                }
                return pass;
            },
            getFlagArrs(m, n) {
                if (!n || n < 1) {
                    return [];
                }

                var resultArrs = [],
                    flagArr = [],
                    isEnd = false,
                    i, j, leftCnt;

                for (i = 0; i < m; i++) {
                    flagArr[i] = i < n ? 1 : 0;
                }

                resultArrs.push(flagArr.concat());

                while (!isEnd) {
                    leftCnt = 0;
                    for (i = 0; i < m - 1; i++) {
                        if (flagArr[i] == 1 && flagArr[i + 1] == 0) {
                            for (j = 0; j < i; j++) {
                                flagArr[j] = j < leftCnt ? 1 : 0;
                            }
                            flagArr[i] = 0;
                            flagArr[i + 1] = 1;
                            var aTmp = flagArr.concat();
                            resultArrs.push(aTmp);
                            if (aTmp.slice(-n).join("").indexOf('0') == -1) {
                                isEnd = true;
                            }
                            break;
                        }
                        flagArr[i] == 1 && leftCnt++;
                    }
                }
                return resultArrs;
            },
            makeGroupHandler() {
                var result;
                var teamData;
                if (this.selection.length === 0) {
                    result = this.getFlagArrs(this.memberData.length, 5);
                    teamData = this.memberData;
                }
                else {
                    result = this.getFlagArrs(this.selection.length, 5);
                    teamData = this.selection;
                }

                var i, j;
                var team1;
                var team2;
                this.teamGroupData = [];
                for (i = 0; i < result.length; i++) {
                    team1 = [];
                    team2 = [];
                    for (j = 0; j < result[i].length; j++) {
                        if (result[i][j] === 1) {
                            team1.push(teamData[j]);
                        }
                        else {
                            team2.push(teamData[j]);
                        }
                    }

                    //检测条件
                    if (this.checkRules(team1) && this.checkRules(team2, true)) {
                            team1.sort(this.sortTeam);
                            team2.sort(this.sortTeam);
                            this.teamGroupData.push({ team1: team1, team2: team2 });
                    }
                }
                this.activeName = 'step2';
            }
        },
        mounted() {
            for (var i = 0; i < this.propList.length; i++) {
                this.propList[i].team2RuleCount = this.propList[i].ruleCount;
                this.rules.push(this.propList[i].ruleCount);
                this.rules2.push(this.propList[i].team2RuleCount);
            }
            if(window.innerHeight > window.innerWidth)
            {
                this.radarStyle.width = '90vw';
            }
            else
            {
                this.radarStyle.width = 90 * window.innerHeight / window.innerWidth +'vw';
            }
        },

        components: {
            'data-list': BaseList,
            'my-radar':MyRadarChart
        }
    }

</script>

<style lang="scss">
    .team-grouping-view {
        background-color: #ffffff;
        height: 100%;
        .handle-bar {
            height: 60px;
        }
        .el-button {
            margin: 0 20px;
        }
        .el-tabs {
            .el-tabs__header {
                display: none;
            }
            .el-tab-pane {
                background-color: #ffffff;
                padding: 10px;
            }
        }
        .radar-modal {
            width: 100%;
            height: 100%;
            position: fixed;
            top:0;
            left:0;
            z-index: 99999;
            background-color: rgba(255,255,255,0.8);
        }
        .radar-container {
            margin: auto;
        }
        .data-list {
            .base-list-row {
                &.invalid-row {
                    background-color: #FBFBFB;
                }
                .handle-component {
                    .el-button {
                        &.btn-export {
                            border: 1px solid #333333;
                            border-radius: 22px;
                            width: 56px;
                            height: 22px;
                            padding: 0;
                        }
                    }
                }
                i {
                    color: #13ce66;
                }
            }
        }
        .result-container {
            width: 60%;
            margin: 0 auto;
            .result-item {
                border: 1px solid #cccccc;
                border-bottom: 0;
                &:last-child {
                    border-bottom: 1px solid #cccccc;
                }
                padding: 5px 0;
                .Col {
                    &:first-child {
                        border-right: 1px solid #cccccc;
                    }
                    span {
                        margin: 0 5px;
                    }
                }
            }
        }
    }
    
    .team-grouping-rule-dialog {
        width: 400px;
    }
</style>