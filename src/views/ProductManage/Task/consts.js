// dataHeader() {
//     let setAuthTube = JSON.parse(localStorage.getItem('PERSONALDETAILS')).role_id !== 4
//     let btnList = [{ text: '编辑',  param: 'edit' }, { text: '删除',  param: 'delete' }]
//     let arr = [
//             { sort:true,  label: '序号', minWidth: 50, },
//             { prop: 'title', label: '作业名称', minWidth:200, align: 'left' },
//             { prop: 'curriculum_title', label: '绑定课程', minWidth:200,  align: 'left' },
//             { prop: 'course', label: '类型', minWidth: 100 },
//             { label: '操作', minWidth: 260, align:"center",
//                 groupBtn: [{  text: '批阅', param: 'marking' }]
//             }]
//     return arr
// },
export default [
    {
      sort:true,
      label: '序号',
      minWidth: 50,
    },
    {
      prop: 'title',
      label: '作业名称',
      // minWidth: 80
      minWidth:200,
      align: 'left'
    },
    {
      prop: 'curriculum_title',
      label: '绑定课程',
      minWidth:200,
      align: 'left'
    },
    {
      prop: 'course',
      label: '类型',
      minWidth: 100
    },
    
      {
        label: '操作',
        minWidth: 260,
        align:"center",
        groupBtn: [
          {
            text: '批阅',
            param: 'marking',
          },
          {
          text: '编辑',
          param: 'edit'
        }, {
          text: '删除',
          param: 'delete',
        }]
}]