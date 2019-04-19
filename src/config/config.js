import $LoadingY from '../plug/loading'
import {Config} from './base'
import axios from 'axios'
import Vue from 'vue'
import {Base64} from 'js-base64';
import postData from '../api/postData'

var loadingInstance = null;
export default {
    IsLoading: (val) => {
        if (val) {
            loadingInstance = $LoadingY({message: "加载中，请稍后", show: true})
            setTimeout(() => {
                loadingInstance.close()
            }, Config.base_timeout);
        } else {
            if (loadingInstance) loadingInstance.close();
        }
    },
    /* 深拷贝 */
    copy: function (obj1, obj2) {
        var obj2 = obj2 || {};
        for (let name in obj1) {
            if (obj1[name] != null) {
                if (typeof obj1[name] === "object") {
                    obj2[name] = obj1[name].constructor === Array ? [] : {};
                    this.copy(obj1[name], obj2[name]);
                } else {
                    obj2[name] = obj1[name];
                }
            } else {
                obj2[name] = null;
            }
        }
        return obj2; //然后在把复制好的对象给return出去
    },
    // 为小于10的数字添加0
    addZero(data) {
        if (typeof data === 'number') return data < 10 ? '0' + data : data + ''
    },
    // 获取权限
    getAuth(v) {
        let d = Base64.decode(localStorage.getItem('PERMISSIONS'));
        let d1 = JSON.parse(d.slice(4))
        let da = null
        d1.map((t) => {
            let n = +t.permission_code.slice(0, 2)
            if (n === v) da = t
        })
        if (da && da.hasOwnProperty('child')) return da.child
        return false
    },

    //判断管理身份
    status(n) {
        switch (n) {
            case 1:
                return '总管理员'
                break
            case 2:
                return '机构管理员'
                break
            case 3:
                return '学管'
                break
            case 4:
                return '辅导老师'
                break;
            // case 5:
            //   return '辅导员'
            default:
                return '不存在该身份'
        }
    },
    // 为小于10的数字添加0
    addZero(data) {
        if (typeof data === 'number') return data < 10 ? '0' + data : data + ''
    },
    // 格式化日期 为小于10日期 拼0
    formatDateStr: function (year, month, day) {
        return year + '/' + this.addZero(month) + ((day && this.addZero) ? '/' : '') + this.addZero(day)
    },
    // 格式化日期 YYYY/MM/DD HH:MM:SS
    formatTime(times) {
        return (times instanceof Date === true)
            ? times.getFullYear() + '/' + this.addZero(times.getMonth() + 1) + '/' + this.addZero(times.getDate()) + ' ' + this.addZero(times.getHours()) +
            ':' + this.addZero(times.getMinutes()) + ':' + this.addZero(times.getSeconds()) : times
    },
    // 格式化日期 YYYY/MM/DD
    formatDate(times) {
        return (times instanceof Date === true)
            ? times.getFullYear() + '/' + this.addZero(times.getMonth() + 1) + '/' + this.addZero(times.getDate())
            : times
    },
    setLockType(d) {
        let arr = [{id: 0, title: '不限'}, {id: 1, title: '按课程'}, {id: 2, title: '按章节'}, {id: 3, title: '按视频'}]
        let d1 = ''
        arr.forEach((t) => {
            if (t.id == d) d1 = t.title
        })
        return d1
    },
    setProductState(n) {
        // -2删除 -1下架 0未上架 1测试 2上架 3推荐
        let stateText = ''
        switch (n) {
            case -2:
                stateText = '删除'
                break;
            case -1:
                stateText = '下架'
                break;
            case 0:
                stateText = '未上架'
                break;
            case 1:
                stateText = '测试'
                break;
            case 2:
                stateText = '上架'
                break;
            case 3:
                stateText = '推荐'
                break;
        }
        return stateText
    },
    // 获取当前角色的权限
    getRoleId() {
        return JSON.parse(localStorage.getItem('PERSONALDETAILS')).role_id
    },
    // 设置role_id === 4 的权限  只能查看产品 批阅作业
    setAuthTube() {
        return JSON.parse(localStorage.getItem('PERSONALDETAILS')).role_id !== 4
    },
    //table导出excel
    downExcel(th, list) {
        var title = '', content = ''
        th.forEach(item => {
            title += `<th>${item.title}</th>`
        })
        title = `<tr>${title}</tr>`
        list.forEach(item => {
            let detail = '', trs = ''
            th.forEach(it => {
                detail += `<td>${item[it.key]}</td>`
            })
            trs += `<tr>${detail}</tr>`
            content += trs
        })
        var tables = title + content
        let html = "<html><head><meta charset='utf-8' /></head><body><table>";
        html += tables;
        html += "</table></body></html>";
        var blob = new Blob([html], {type: "application/vnd.ms-excel"});
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = "兑换码数据.xls";
        a.click()
    },
    //阿拉伯数字转换为简写汉字
    ArabiaToSimplifiedChinese(Num) {
        for (let i = Num.length - 1; i >= 0; i--) {
            Num = Num.replace(",", "")//替换Num中的“,”
            Num = Num.replace(" ", "")//替换Num中的空格
        }
        if (isNaN(Num)) { //验证输入的字符是否为数字
            //alert("请检查小写金额是否正确");
            return;
        }
        //字符处理完毕后开始转换，采用前后两部分分别转换
        let part = String(Num).split(".");
        let newchar = "";
        //小数点前进行转化
        for (let i = part[0].length - 1; i >= 0; i--) {
            if (part[0].length > 10) {
                //alert("位数过大，无法计算");
                return "";
            }//若数量超过拾亿单位，提示
            let tmpnewchar = ""
            let perchar = part[0].charAt(i);
            switch (perchar) {
                case "0":
                    tmpnewchar = "零" + tmpnewchar;
                    break;
                case "1":
                    tmpnewchar = "一" + tmpnewchar;
                    break;
                case "2":
                    tmpnewchar = "二" + tmpnewchar;
                    break;
                case "3":
                    tmpnewchar = "三" + tmpnewchar;
                    break;
                case "4":
                    tmpnewchar = "四" + tmpnewchar;
                    break;
                case "5":
                    tmpnewchar = "五" + tmpnewchar;
                    break;
                case "6":
                    tmpnewchar = "六" + tmpnewchar;
                    break;
                case "7":
                    tmpnewchar = "七" + tmpnewchar;
                    break;
                case "8":
                    tmpnewchar = "八" + tmpnewchar;
                    break;
                case "9":
                    tmpnewchar = "九" + tmpnewchar;
                    break;
            }
            switch (part[0].length - i - 1) {
                case 0:
                    tmpnewchar = tmpnewchar;
                    break;
                case 1:
                    if (perchar != 0) tmpnewchar = tmpnewchar + "十";
                    break;
                case 2:
                    if (perchar != 0) tmpnewchar = tmpnewchar + "百";
                    break;
                case 3:
                    if (perchar != 0) tmpnewchar = tmpnewchar + "千";
                    break;
                case 4:
                    tmpnewchar = tmpnewchar + "万";
                    break;
                case 5:
                    if (perchar != 0) tmpnewchar = tmpnewchar + "十";
                    break;
                case 6:
                    if (perchar != 0) tmpnewchar = tmpnewchar + "百";
                    break;
                case 7:
                    if (perchar != 0) tmpnewchar = tmpnewchar + "千";
                    break;
                case 8:
                    tmpnewchar = tmpnewchar + "亿";
                    break;
                case 9:
                    tmpnewchar = tmpnewchar + "十";
                    break;
            }
            newchar = tmpnewchar + newchar;
        }
        //替换所有无用汉字，直到没有此类无用的数字为止
        while (newchar.search("零零") != -1 || newchar.search("零亿") != -1 || newchar.search("亿万") != -1 || newchar.search("零万") != -1) {
            newchar = newchar.replace("零亿", "亿");
            newchar = newchar.replace("亿万", "亿");
            newchar = newchar.replace("零万", "万");
            newchar = newchar.replace("零零", "零");
        }
        //替换以“一十”开头的，为“十”
        if (newchar.indexOf("一十") == 0) {
            newchar = newchar.substr(1);
        }
        //替换以“零”结尾的，为“”
        if (newchar.lastIndexOf("零") == newchar.length - 1) {
            newchar = newchar.substr(0, newchar.length - 1);
        }
        return newchar;
    }
}
