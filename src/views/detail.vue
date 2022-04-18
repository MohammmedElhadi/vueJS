<template>
  <div>
    <v-row class="justify-center my-3">
      <v-progress-circular
        :size="70"
        :width="7"
        v-if="loading"
        color="red"
        indeterminate
      ></v-progress-circular>
  </v-row>
  <div class="my-5 px-1">
    <demande :demande="demande" :detail ="detail" :key="'demande_'+this.$route.params.id"></demande>
  </div>
  </div>
</template>

<script>
import Demande from "../components/Demande";
import { HTTP } from "../http-constants";
export default {
  components: { Demande },
  name: "detail",
  data: () => ({
    loading : true,
    detail : true,
    demande: null,
  }),
  beforeMount(){
    this.getDemande();
  },
  created() {
    
    this.$watch(
      () => this.$route.params,
      (toParams) => {
        this.demande = ''
        this.loading = true
        HTTP.get('api/demande/'+toParams.id+'/markAsSeen')
            .then(
              this.getDemande()
            )
            .catch()
      }
    )
    this.markAsSeen();
  },
  methods: {
    markAsSeen(){
     HTTP.get('api/demande/'+this.$route.params.id+'/markAsSeen')
     .then(()=> {

     }).catch(()=>{
       
     })
   },
     getDemande() {
      HTTP.get("api/demande/" + this.$route.params.id).then((response) => {
        this.demande = response.data[0];
        this.loading = false
      });
      
    },
  },
};
</script>
