<template>
  <div>
    <div v-if="demandes.length == 0">
          <h1>No demandes yet</h1>
    </div>
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
    demandes: [],
  }),
  methods: {
    async getDemandes() {
     let repsponse =  await HTTP.get("api/demande/demandesrepondu")
     this.demandes = repsponse.data;
       
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
