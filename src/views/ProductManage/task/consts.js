import copys from '../../../config/config';
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
export const taskHeadData = (type) => {
    let d2 = copys.copy(d,[]);
    let d3 = copys.copy(d,[]);
    // if(d2[3] !== item) d3.splice(3,0,item);
    return type ? d2 : d3
}
