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
    }
}