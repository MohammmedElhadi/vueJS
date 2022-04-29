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
      <div v-if="!loading && demandes.length == 0">
        {{ $t("no_result_found") }}
      </div>
    </v-row>
    <div
      class="my-5 px-1"
      v-for="demande in demandes"
      :key="'dem' + demande.id"
    >
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
export default {
  components: { Demande },
  data: () => ({
    moreExists: false,
    nextpage: 0,
    moreLoading: false,
    detail: false,
    loading: true,
    demandes: [],
  }),
  methods: {
    getDemandes(page = 1) {
      HTTP.get("api/demande/my_demandes?page=" + page)
        .then((response) => {
          let pagination = response.data.pagination;
          if (pagination.current_page < pagination.last_page) {
            (this.moreExists = true),
              (this.nextpage = pagination.current_page + 1);
          } else {
            this.moreExists = false;
          }
          this.demandes = response.data.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.$toasted.error(this.$t("error"), {
            theme: "bubble",
            position: "bottom-center",
            duration: 3000,
          });
        });
    },
    getMoreDemandes(){
       this.moreLoading = true;
        HTTP.get("api/demande/my_demandes?page="+this.nextpage)
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
  computed: {
    wilayas() {
      return this.$store.state.wilayas;
    },
    etats() {
      return this.$store.state.etats;
    },
  },
  created() {
    this.getDemandes();
  },
};
</script>
