export function doGroupSlice(numPerRow, data) {
  var result = [];
  for (var i = 0; i < data.length; i += numPerRow) {
    result.push(data.slice(i, i + numPerRow))
  }
  return result;
}
export function doTimeFormat(val) {
  if (val == "0000-00-00 00:00:00") {
    return "不限期";
  }
  var date = new Date(val);
  var monthStr = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
  var dateStr = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
  return date.getFullYear() + '-' + monthStr + '-' + dateStr;
}
export function doDateFormat(val) {
  var date = new Date(val);
  var monthStr = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
  var dateStr = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
  var hourStr = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
  var miniteStr = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
  return date.getFullYear() + '-' + monthStr + '-' + dateStr + ' ' + hourStr + ':' + miniteStr;
}
export function doOfflineCurriculumTypeFormat(val) {
  switch (val) {
    case 1:
      return '讲座';
    case 2:
      return '实践';
  }
}
export function doSortFormatCatalogList(list) {
  if (list.length === 0)
    return [];

  var groupList = [];
  var i, j;
  var existGroup;
  for (i = 0; i < list.length; i++) {
    existGroup = false;
    for (j = 0; j < groupList.length; j++) {
      if (list[i].group_orderby === groupList[j].group_orderby) {
        existGroup = true;
        groupList[j].classList.push(list[i]);
        break;
      }
    }
    if (!existGroup) {
      groupList.push({
        curriculum_id: list[i].curriculum_id,
        group_orderby: list[i].group_orderby,
        group_name: list[i].group_name,
        classList: [list[i]]
      });
    }
  }

  for (i = 0; i < groupList.length; i++) {
    groupList[i].classList.sort(function (a, b) {
      if (a.orderby < b.orderby)
        return -1;
      else if (a.orderby > b.orderby)
        return 1;
      return 0;
    });
  }

  groupList.sort(function (a, b) {
    if (a.group_orderby < b.group_orderby)
      return -1;
    else if (a.group_orderby > b.group_orderby)
      return 1;
    return 0
  });

  return groupList;
}

export function cleanHtmlLabel(val) {
  return val.replace("<[^>]*>", "");
}

import json2csv from 'json2csv'

export function exportCsv(data, fields, fileNames, fileName) {
  try {
    var result = json2csv({data: data, fields: fields, fieldNames: fileNames});
    var csvContent = "data:text/csv;charset=GBK,\uFEFF" + result;
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${(fileName || 'file')}.csv`);
    document.body.appendChild(link); // Required for FF
    link.click(); // This will download the data file named "my_data.csv".
    document.body.removeChild(link); // Required for FF

  } catch (err) {
    // Errors are thrown for bad options, or if the data is empty and no fields are provided.
    // Be sure to provide fields if it is possible that your data array will be empty.
    console.error(err);
  }
}

export function reunitPrice(val) {
  return (val / 100).toString();
}

export const MenuList = [
  {
    name: 'manage-project',
    title: '机构管理',
    icon: '01.organ_gray'
  },
  {
    name: 'manage-user',
    icon: '02.user_gray',
    title: '用户管理',
    checkItem: 'admin'
  },
  {
    name: '2',
    icon: '03.student_gray',
    title: '学员管理',
    check: 'student',
    list:[{
      name: 'manage-student',
      title: '学员管理',
    }, 
    {
        name: 'redeem-code',
        title: '兑换码管理'
    },
    {
        name: 'manage-my-assignment',
        title: '批阅任务作业',
        badge: true
      }]

  },
  {
    name: ['manage-production', 'manage-production-curriculum'],
    title: '产品信息',
    icon: '04.product_gray',
    checkItem: 'product-information'
  },
  {
    name: '4',
    title: '课程管理',
    icon: '05.class_gray',
    check: 'manager',
    list: [{
      check: true,
      name: ['online-course', 'online-course-chapter'],
      title: '线上课'
    },
      {
        check: true,
        name: ['offline-course', 'offline-course-manage-signup'],
        title: '线下课'
      }, {
        name: 'task',
        title: '任务包'
      },
      {
        name: 'course-download-data',
        title: '课程资料'
      }, {
        name: 'public-download-data',
        title: '推荐资料'
      }]
  },
  {
    name: '5',
    title: '平台管理',
    icon: '06.terrace_gray',
    check:'platform',
    list: [{
      name: 'manage-lb',
      title: '广告图'
    }, {
      name: 'manage-news',
      title: '行业资讯'
    }, {
      name: 'notification-chat',
      title: '通知管理',
    }]
  },
  // {
  //   name: '1',
  //   title: '超级管理员',
  //   icon: 'md-person',
  //   check: 'admin',
  //   list: [{
  //     name: 'manage-user',
  //     title: '查看用户'
  //   },
  //     {
  //       name: 'manage-lb',
  //       title: '广告图管理'
  //     },
  //     // {
  //     //     name: 'manage-app',
  //     //     title: '平台更新'
  //     // },
  //     {
  //         name: 'manage-news',
  //         title: '点师动态'
  //     },
  //     // {
  //     //     name: 'statistics-data',
  //     //     title: '点击量统计'
  //     // },
  //     // {
  //     //     name: 'from-page-data',
  //     //     title: '页面来源统计'
  //     // }
  //   ]
  // },
  // {
  //   name: '2',
  //   title: '学员管理',
  //   icon: 'ios-people',
  //   check: 'manager',
  //   list: [{
  //     name: 'manage-student',
  //     title: '查看学员'
  //   },
  //     // {
  //     //     name: 'manage-recruit',
  //     //     title: '招生管理'
  //     // },
  //     // {
  //     //     name: 'redeem-code',
  //     //     title: '兑换码管理'
  //     // },
  //     {
  //         name: 'notification-chat',
  //         title: '我的通知',
  //         badge: true
  //     }
  //   ]
  // },
  // {
  //     name: '3',
  //     title: '我是导师',
  //     icon: 'ios-book',
  //     check: 'teacher',
  //     list:[
  //     {
  //         name: 'manage-my-assignment',
  //         title: '我的指导'
  //     },
  //     // {
  //     //     name: 'manage-my-interview',
  //     //     title: '我的面试'
  //     // }
  //     ]
  // },
  // {
  //   name: '4',
  //   title: '创建管理',
  //   icon: 'ios-keypad',
  //   check: 'manager',
  //   list: [{
  //     check: true,
  //     name: ['online-course', 'online-course-chapter'],
  //     title: '线上课'
  //   },
  //     {
  //       check: true,
  //       name: ['offline-course', 'offline-course-manage-signup'],
  //       title: '线下课'
  //     }, {
  //       name: 'task',
  //       title: '任务包'
  //     },
  //     {
  //       name: 'course-download-data',
  //       title: '课程资料'
  //     }, {
  //       name: 'public-download-data',
  //       title: '推荐资料'
  //     }]
  // },
  // {
  //   name: '6',
  //   title: '产品管理',
  //   icon: 'ios-list-box',
  //   check: 'admin',
  //   list: [
  //     {
  //       check: true,
  //       name: ['manage-production', 'manage-production-curriculum'],
  //       title: '产品信息'
  //     },
  //     {
  //       name: 'manage-production-group',
  //       title: '产品组合'
  //     }]
  // }
]