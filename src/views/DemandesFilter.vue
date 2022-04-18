<template>
  <div>
    <div class="my-5 px-1">
      <v-row dense class="justify-center">
        <!-- Types -->
        <v-col cols="6">
          <v-autocomplete
            chips
            clearable
            clear-icon="mdi-delete"
            :items="types"
            :item-text="getName()"
            item-value="id"
            :label="$t('type_filter')"
            v-model="search.type_filters"
            @change="getMarques()"
            @click:clear="clearAll"
          >
            <template v-slot:selection="data">
              <v-chip
                v-bind="data.attrs"
                :input-value="data.selected"
                @click="data.select"
              >
                <!-- <v-avatar left>
                <v-img :src="data.item.logo"></v-img>
              </v-avatar> -->
                {{ getName2(data.item) }}
              </v-chip>
            </template>
            <!-- avatar <template v-slot:item="data">
            <template>
              <v-list-item-avatar>
                <img :src="data.item.logo" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  v-html="getName2(data.item)"
                ></v-list-item-title>
              </v-list-item-content>
            </template>
          </template> -->
          </v-autocomplete>
        </v-col>
        <!-- Marques -->
        <v-col cols="6" v-if="is_automobile">
          <v-autocomplete
            multiple
            chips
            :items="marques"
            :item-text="getName()"
            item-value="id"
            :label="$t('marque_filter')"
            v-model="search.marque_filters"
          >
            <template v-slot:selection="data">
              <v-chip
                v-bind="data.attrs"
                :input-value="data.selected"
                close
                @click="data.select"
                @click:close="removeItem(data.item, search.marque_filters)"
              >
                <v-avatar left>
                  <v-img :src="data.item.logo"></v-img>
                </v-avatar>
                {{ getName2(data.item) }}
              </v-chip>
            </template>
            <template v-slot:item="data">
              <template>
                <v-list-item-avatar>
                  <img :src="data.item.logo" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    v-html="getName2(data.item)"
                  ></v-list-item-title>
                </v-list-item-content>
              </template>
            </template>
          </v-autocomplete>
        </v-col>

        <!-- Contient -->
        <v-col cols="6" v-if="is_vehicule">
          <v-autocomplete
            multiple
            chips
            :items="continents"
            :item-text="getName()"
            item-value="id"
            :label="$t('origine')"
            v-model="search.continent_filters"
          >
            <template v-slot:selection="data">
              <v-chip
                v-bind="data.attrs"
                :input-value="data.selected"
                close
                @click="data.select"
                @click:close="removeItem(data.item, search.continent_filters)"
              >
                {{ getName2(data.item) }}
              </v-chip>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row dense class="justify-center">
        <v-btn color="success" @click="filterDemandes()">
          {{ $t("filter") }}
          <v-icon>mdi-filter</v-icon>
        </v-btn>
      </v-row>
    </div>
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
    <div class="my-5 px-1" v-for="(demande, index) in demandes" :key="index">
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
     loading : true,
    is_automobile: false,
    is_vehicule: false,
    detail: false,
    demandes: [],
    types: [],
    marques: [],
    continents: [],
    search: {
      type_filters: [],
      marque_filters: [],
      continent_filters: [],
    },
  }),
  methods: {
    getName2(item) {
      if (this.$i18n.locale == "fr") return item.nom_fr;
      else return item.nom_ar;
    },
    getName() {
      if (this.$i18n.locale == "fr") return "nom_fr";
      else return "nom_ar";
    },
    removeItem(item, list) {
      const index = list.indexOf(item.id);
      if (index >= 0) list.splice(index, 1);
    },

    getTypes() {
      HTTP.get("api/type")
        .then((repsponse) => {
          this.types = repsponse.data;
        })
        .catch(() => {

        });
    },
    getMarques() {
      if (this.search.type_filters) {
        if (this.search.type_filters == 2) {
          this.is_automobile = true;
          this.is_vehicule = false;
          this.search.continent = "";

          HTTP.get("api/marque")
            .then((repsponse) => {
              this.marques = repsponse.data;
            })
            .catch(() => {
              
            });
        } else {
          this.is_vehicule = true;
          this.search.continent_filters = [];
          this.is_automobile = false;
          this.search.marque_filters = [];
        }
      }
    },

    getContinents() {
      HTTP.get("api/continent")
        .then((repsponse) => {
          this.continents = repsponse.data;
        })
        .catch(() => {
          
        });
    },
    getDemandes() {
      this.demandes = [];
      this.loading = true
      HTTP.get(
        "api/" +
          this.$route.params.filter +
          "/" +
          this.$route.params.id +
          "/demandes"
      )
        .then((response) => {
          this.demandes = response.data;
          this.loading = false
        })
        .catch(() => {
          this.loading = false
          this.$toasted.error(this.$t("Préciser les critères de recherche"), {
            theme: "bubble",
            position: "bottom-center",
            duration: 3000,
          });
        });
    },
    filterDemandes() {
      this.demandes = [];
      this.loading = true
      let url =
        "api/filter/?" +
        "marques=" +
        JSON.stringify(this.search.marque_filters) +
        "&types=" +
        JSON.stringify(this.search.type_filters) +
        "&continents=" +
        JSON.stringify(this.search.continent_filters);
      HTTP.get(url).then((response) => {
        this.demandes = response.data;
        this.loading = false
      }).catch(() => {
          this.loading = false
          this.$toasted.error(this.$t("error"), {
            theme: "bubble",
            position: "bottom-center",
            duration: 3000,
          });
        });
    },
    clearAll() {
      this.is_automobile = false;
      this.is_vehicule = false;
      this.search.type_filters = [];
      this.search.continent_filters = [];
      this.search.marque_filters = [];
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
    this.$watch(
      () => this.$route.params,
      (toParams) => {
        this.demandes = [];
        this.loading = true
        HTTP.get(
          "api/" + toParams.filter + "/" + toParams.id + "/demandes"
        ).then((response) => {
          this.loading = false
          this.demandes = response.data;
        });
      }
    );
    this.getDemandes();
    // this.getMarques();
    this.getTypes();
    this.getContinents();
  },
};
</script>
