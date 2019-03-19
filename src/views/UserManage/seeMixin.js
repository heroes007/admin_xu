
let setData = (type) =>{
  const MECH = {name: '所属机构', title: 'role_id'}
  const AUTH = {name: '管理权限', title: 'role_id'}
  let d = type == 1 ? [MECH] : type == 2 ? [AUTH] : type == 3 ? [MECH,AUTH] : [{name: '科室', title: 'department_name'},{name: '年级', title: 'grade_name'}]
  return [
    {name: '用户ID', title: 'username'},
    {name: '手机号', title: 'phone'},
    ...d,
    {name: '注册时间', title: 'create_time'},
    {name: '最后登录', title: 'last_time'},
  ]
}
export default {
  data() {
    return {
      detailShow: false,
      management: setData(1),
      institution: setData(2),
      mentor: setData(3),
      student: setData(),
    }
  },
  methods: {
    close(){
      this.detailShow = false;
    }
  }
}

