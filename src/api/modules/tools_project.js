import api from './config'
export function get_project_list(){
  var vm = this;
  return api.post('/api/tools_project/get_project_list',{}).catch(function(error) {
    console.log(error);
    vm.get_project_list();
  });
}
