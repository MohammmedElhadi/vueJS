<template>
  <div>
    <v-row class="justify-center my-3">
      <v-progress-circular
        :size="50"
        :width="5"
        v-if="loading"
        color="red"
        indeterminate
      ></v-progress-circular>
      <v-btn v-if="!loading" large block text @click="refresh">
        <v-icon large>mdi-refresh</v-icon>
      </v-btn>
      <div v-if="!loading && demandes.length.length == 0">
        {{ $t("no_result_found") }}
      </div>
    </v-row>
    <div class="my-5 px-1" v-for="(demande, index) in demandes" :key="index">
      <demande :demande="demande" :detail="detail"></demande>
    </div>
   
    <v-row class="justify-center my-3">
        <v-progress-circular
        :size="50"
        :width="5"
        v-if="moreLoading"
        color="red"
        indeterminate
      ></v-progress-circular>
      <v-btn v-else v-show="moreExists" @click="getMoreDemandes">{{
        $t("show_more")
      }}</v-btn>
    </v-row>
  </div>
</template>
<script>
import Demande from "../components/Demande.vue";
import { HTTP } from "../http-constants";
import { mapActions } from "vuex";
export default {
  components: { Demande },
  data: () => ({
    moreExists : false,
    nextpage : 0,
    detail: false,
    demandes : [],
    loading : true,
    moreLoading : false
  }),
  methods: {
    ...mapActions({
      sinIn: "auth/login",
    }),
    async refresh() {
      this.loading = true,
      this.paginate_demandes ={};
      this.demandes = []
      this.getDemandes();
    },
    getDemandes(page = 1) {
      HTTP.get("api/demande?page="+page)
        .then((response) => {
          let pagination = response.data.pagination
          if(pagination.current_page < pagination.last_page){
            this.moreExists = true,
            this.nextpage = pagination.current_page+1;
          }
          else{
             this.moreExists = false;
          }
          this.demandes = response.data.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
          this.$toasted.error(this.$t("error"), {
            theme: "bubble",
            position: "bottom-center",
            duration: 3000,
          });
        });
    },
    getMoreDemandes(){
       this.moreLoading = true;
        HTTP.get("api/demande?page="+this.nextpage)
        .then((response) => {
          let pagination = response.data.pagination
        if(pagination.current_page < pagination.last_page){
            this.moreExists = true,
            this.nextpage = pagination.current_page+1;
          }
          else{
             this.moreExists = false;
          }
          response.data.data.forEach((demande)=>{
          this.demandes.push(demande);
          })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
          this.$toasted.error(this.$t("error"), {
            theme: "bubble",
            position: "bottom-center",
            duration: 3000,
          });
        }).finally(()=>{
           this.moreLoading = false;
        });
    }
  },

  created() {
    this.getDemandes();
  },
};
</script>
