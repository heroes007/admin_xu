<template>
   <div>
       <h1>学员列表</h1>
        <Tables :is-serial=true @operation1="see" @operation2="edit" @operation3="deletes"  :column="columns1" :table-data="list" />
   </div>
</template>

<script>
  import Tables from '../../../components/tables.vue'
  export default {
    name: "ManagementList",
    components: { Tables },
    data (){
        return{
                columns1: [
                {
                    title: '用户名',
                    key: 'nickname',
                    align: 'left',
                },{
                    title: '真实姓名',
                    key: 'realname',
                },{
                    title: '性别',
                    key: 'sex',
                },
                {
                    title: '学科',
                    key: 'admin',
                    align: 'left',
                },
                 {
                    title: '年级',
                    key: 'phone',
                    align: 'left',
                },
                {
                    title: '所属机构',
                    key: 'company',
                    align: 'left'
                },
                 {
                    title: '最近登录时间',
                    key: 'create_time',
                    align: 'left',
                },
                {
                    title: '操作',
                    width: 260,
                    slot: 'operation',
                    operation: ['查看', '编辑', '删除']
                }],
                list: [
                    {
                        "user_id": 13186,
                        "nickname": "150****1134",
                        sex: "男",
                        "realname": "王晓东",
                        "phone": "15022211134",
                        "from_domain": '正常',
                        "create_time": "2019/01/12 21:34",
                        "action": "action",
                        admin: '超级管理员',
                        company: "北京大学人民医院"
                    }
                ]
        }
    },
    methods: {
        see(row,rowIndex){
            console.log(row,rowIndex);
        },
        edit(row,rowIndex){
            console.log(row,rowIndex);
        },
        deletes(row,rowIndex){
            console.log(row,rowIndex);
        },
    },
    mounted() {}
  }
</script>

<style scoped>
</style>