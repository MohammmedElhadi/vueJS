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
      <v-btn  v-if="!loading" large block text @click="refresh">
        <v-icon large>mdi-refresh</v-icon>
      </v-btn>
       <div  v-if="!loading && demandes.length == 0">
        {{$t('no_result_found')}}
      </div>
      
    </v-row>
    <div class="my-5 px-1" v-for="(demande, index) in demandes" :key="index">
      <demande :demande="demande" :detail="detail"></demande>
    </div>
  </div>
</template>
<script>
import Demande from "../components/Demande.vue";
import { HTTP } from "../http-constants";
import { mapActions } from "vuex";
export default {
  components: { Demande },
  data: () => ({
    detail: false,
    demandes: [],
    loading : true
  }),
  methods: {
    ...mapActions({
      sinIn: "auth/login",
    }),
    async refresh() {
      this.loading = true
      this.demandes = [];
      this.getDemandes();
    },
    getDemandes() {
      HTTP.get("api/demande")
        .then((response) => {
          this.demandes = response.data;
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
  },

  created() {
    this.getDemandes();
  },
};
</script>
