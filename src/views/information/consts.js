import copys from '../../config/config';
let item = {
  prop: 'activity_type',
  label: '激活方式',
  width: 100,
  isBtn: true,
  param: 'doActive'
}
let d = [{
  prop: 'name',
  label: '名称',
  minWidth: 80
}, {
  prop: 'create_time',
  label: '创建时间',
  width: 120
}, {
  prop: 'grade_id',
  label: '学段',
  width: 80
}, {
  prop: 'subject_id',
  label: '学科',
  width: 80
},
  {
    label: '操作',
    width: 250,
    groupBtn: [{
      text: '编辑',
      param: 'edit'
    }, {
      text: 'ios-trash-outline',
      param: 'delete',
      hoverShow: true,
      isIcon: true
    }]
  }]
export const taskHeadData = (type) => {
  let d2 = copys.copy(d,[]);
  let d3 = copys.copy(d,[]);
  if(d2[3] !== item) d3.splice(3,0,item);
  return type ? d2 : d3
}
