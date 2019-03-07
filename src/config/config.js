import $LoadingY from '../plug/loading'
import { Config } from './base'
var loadingInstance = null;
export default{
    IsLoading: (val) => {
        if (val) {
            loadingInstance = $LoadingY({message: "加载中，请稍后",show: true})
            setTimeout(() => {
                loadingInstance.close()
            }, Config.base_timeout);
        }else {
            if(loadingInstance) loadingInstance.close();
        }
    },
      /* 深拷贝 */
    copy: function(obj1, obj2){
        var obj2 = obj2 || {};
        for (let name in obj1) {
        if(obj1[name] != null){
            if (typeof obj1[name] === "object") {
            obj2[name] = obj1[name].constructor === Array ? [] : {};
            this.copy(obj1[name], obj2[name]);
            } else {
            obj2[name] = obj1[name];
            }
        }else{
            obj2[name] = null;
        }
        }
        return obj2; //然后在把复制好的对象给return出去
    },
      // 为小于10的数字添加0
    addZero (data) {
        if (typeof data === 'number') return data < 10 ? '0' + data : data + ''
    },
}