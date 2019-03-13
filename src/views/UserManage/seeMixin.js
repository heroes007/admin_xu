export default {
  data() {
    return {
      detailShow: false,
      management: [
        {name: '用户ID', title: 'username'},
        {name: '手机号', title: 'phone'},
        {name: '科室', title: 'department_id'},
        {name: '年级', title: 'grade_id'},
        {name: '注册时间', title: 'create_time'},
        {name: '最后登录', title: 'last_time'},
      ]

    }
  },
  methods: {
    close(){
      this.detailShow = false;
    }
  }
}
