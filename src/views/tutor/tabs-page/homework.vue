<template>
    <div>
        <div>作业</div>
        <tables :column="column" :table-data="list" @operation1="check"/>
    </div>
</template>

<script>
    import tables from '../../../components/tables'
    export default {
        name: "homework",
        components: {tables},
        data() {
            return {
               column: [
                   {title: '选项', type: 'selection', minWidth: 100},
                   {title: '姓名', key: 'realname', minWidth: 100 },
                   {title: '作业描述', key: 'describe', minWidth: 100 },
                   {title: '作业附件', key: 'accessory', minWidth: 100 },
                   {title: '提交日期', key: 'upDate', minWidth: 180},
                   {title: '批阅', key: 'state', slot: 'state-item', stateKey: 'read', minWidth: 100},
                   {title: '评分', key: 'score', minWidth: 100 },
                   {
                       title: '操作',
                       minWidth: 100,
                       slot: 'operation',
                       align: 'left',
                       operation: [['查看','operation1']],
                   }
               ],
               list: [
                   {realname: '张三', describe: '描述', accessory: '附件', upDate: new Date(), read: 1, state: '已通过', score: 80},
                   {realname: '李四', describe: '描述', accessory: '附件', upDate: new Date(), read: 0, state: '未通过', score: 80},
                   {realname: '王五', describe: '描述', accessory: '附件', upDate: new Date(), read: 2, state: '未批阅', score: 80},
               ],
            }
        },
        methods: {
            check() {

            }
        },
        mounted() {
            const cwd = process.cwd();
            console.log(cwd);
            console.log(__dirname)
        }
    }
</script>

<style scoped>

</style>
