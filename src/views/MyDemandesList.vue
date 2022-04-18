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
      <div  v-if="!loading && demandes.length == 0">
        {{$t('no_result_found')}}
      </div>
    </v-row>
    <div class="my-5 px-1" v-for="demande in demandes" :key="'dem'+demande.id">
      <demande :demande="demande" :detail="detail"></demande>
    </div>
  </div>
</template>
<script>
import Demande from "../components/Demande.vue";
import { HTTP } from "../http-constants";
export default {
  components: { Demande },
  data: () => ({
    detail : false,
        loading : true,
    demandes: [],
  }),
  methods: {
   

      getDemandes() {
      HTTP.get("api/demande/my_demandes")
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
