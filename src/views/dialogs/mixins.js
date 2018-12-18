export var RemoveModal = {
    methods: {
      handleRemoveModal(id){
        setTimeout(_=>{
          var element = document.getElementById(id);
          element.parentNode.removeChild(element);
        },200)
      }
    }
}
