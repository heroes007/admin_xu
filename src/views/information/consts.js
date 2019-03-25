import copys from '../../config/config';
// let item = {
//   prop: 'activity_type',
//   label: '激活方式',
//   width: 100,
//   isBtn: true,
//   param: 'doActive'
// }
let d = [
{
  sort:true,
  label: '序号',
  minWidth: 50,
  // width:10
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
  // minWidth: 80
  minWidth:200,
  align: 'left'
},
{
  prop: 'course',
  label: '类型',
  // minWidth: 80
  minWidth: 100
},
// {
//   prop: 'create_time',
//   label: '创建时间',
//   width: 120
// },
// {
//   prop: 'grade_id',
//   label: '学段',
//   width: 80
// },
// {
//   prop: 'subject_id',
//   label: '学科',
//   width: 80
// },
  {
    label: '操作',
    minWidth: 260,
    align:"center",
    groupBtn: [
      // {
      //   text: '统计',
      //   param: 'statistics'
      // },
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
      // hoverShow: true,
      // isIcon: true
    }]
  }]
export const taskHeadData = (type) => {
    let d2 = copys.copy(d,[]);
    let d3 = copys.copy(d,[]);
    // if(d2[3] !== item) d3.splice(3,0,item);
    return type ? d2 : d3
}
