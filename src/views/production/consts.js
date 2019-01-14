let prop = { prop: "protocal" }
let obj = {
     label: "产品协议",
     width: 120,
     groupBtn: [
       {
         text: "编辑",
         param: "editProtocol"
       }
     ]
}
export default (v) => {
    let tableHeadData = [
        {
          prop: "code",
          label: "编码",
          width: 150
        },
        {
          prop: "title",
          label: "产品名称",
          width: 300
        },
        {
          prop: "original_price",
          label: "定价",
          width: 100
        },
        {
          prop: "price",
          label: "售价",
          width: 100
        },
        {
          prop: "belong_specials",
          label: "所属组合",
          minwidth: v == 0 ? 260 : 300
        },
        {
          label: "产品状态",
          prop: "state",
          useCombo: true,
          comboListIndex: 0,
          listLabel: "name",
          listValue: "id",
          actionName: "change_production_state",
          width: v == 0 ? 200 : 300
        },
        {
          label: "操作",
          width: 320,
          groupBtn: [
            {
              // isSwitch: true,
              // switchKey: 'is_valid',
              // onText: '启用',
              // offText: '停用',
              // disableText: '失效',
              // actionName: 'change_production_vailid'
            },
            {
              text: "编辑",
              param: "edit"
            },
            {
              text: "查看",
              param: "detail"
            },
            {
              text: "el-icon-delete",
              param: "delete",
              isIcon: true
            }
          ]
        }
      ];
    if(v == 0) tableHeadData.splice(4,0,obj)
    else{
        let o = { ...obj, ...prop }
        tableHeadData.splice(4,0,o)
    }
    return tableHeadData
  }
