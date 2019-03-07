<template>
   <div>
       <h1>表格</h1>
       <!-- :is-serial=true -->
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
                    title: '用户昵称',
                    key: 'nickname',
                },{
                    title: '用户权限',
                    key: 'roles',
                },{
                    title: '手机号',
                    key: 'phone',
                },
                {
                    title: '注册时间',
                    key: 'create_time',
                },{
                    title: '操作',
                    width: 260,
                    slot: 'operation',
                    operation: ['查看', '编辑', '删除']
                }],
                list: [
                    {
                        "user_id": 13186,
                        "nickname": "150****1134",
                        "realname": "",
                        "phone": "15022211134",
                        "from_domain": 1,
                        "create_time": "2019-03-04T07:03:57.000Z",
                        "roles": '超级管理员',
                        "action": "action"
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