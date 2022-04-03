<template>
    <div>
      {{user}} 
    </div>
</template>
<script>
import { HTTP } from "../http-constants";

export default {
  data: () => ({
     user : '',
    //  types : '', 
    //  marques : '', 
    //  modeles : '', 
  }),
methods :{
    getUserInfo(){
        HTTP.get("api/profile/"+11)
        .then((response) => {
          if (response.status == 200) {
           this.user = response.data; 
          }
        })
        .catch(() => {
          return ["no data found"];
        });
    },
    created(){
      this.getUserInfo();
    }
},



}
</script>
