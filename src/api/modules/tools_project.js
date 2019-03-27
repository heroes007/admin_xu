import api from './config'


export function get_project_list(){
  var vm = this;
  return api.post('/user/getOrganizations',{}).catch(function(error) {
    vm.get_project_list();
  });
}
