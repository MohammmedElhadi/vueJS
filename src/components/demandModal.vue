<template>
  <v-row justify="center">
    <v-dialog v-model="demande_dialog"
    fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable 
    max-width="90%" 
    persistent>
      <v-card>
        <v-form ref="form" class="mx-2" lazy-validation>
          <v-card-title>
            <span class="text-h5">{{ $t("new_demand") }} </span>
            <v-spacer />
            <v-btn icon dark @click="$emit('closeDemandeDiaog')">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-stepper v-model="e1">
            <v-card-text>
              <v-container>
                <v-stepper-header>
                  <v-stepper-step :complete="e1 > 1" step="1">
                    {{ $t("Marque_modele") }}
                  </v-stepper-step>

                  <v-divider></v-divider>

                  <v-stepper-step :complete="e1 > 2" step="2">
                    {{ $t("category") }}
                  </v-stepper-step>

                  <v-divider></v-divider>

                  <v-stepper-step step="3">
                    {{ $t("additionnel") }}
                  </v-stepper-step>
                </v-stepper-header>
                  <v-card-actions>
              <v-btn
                color="blue darken-1"
                class="mx-10"
                v-show="e1 > 1"
                @click="e1 = e1 - 1"
              >
                {{ $t("previous") }}
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="warning darken-1"
                class="mx-10"
                v-show="e1 < 3"
                @click="e1 = e1 + 1"
              >
                {{ $t("next") }}
              </v-btn>
              <v-btn
                color="success"
                class="mx-10"
                v-show="e1 == 3"
                @click.prevent="submitDemande()"
              >
                {{ $t("make_demand") }}
              </v-btn>
            </v-card-actions>
                <v-stepper-items>
                  <v-stepper-content step="1">
                    <v-row dense class="justify-center">
                      <v-col cols="12" xl="10" lg="10" md="10">
                        <!-- Type -->
                        <v-autocomplete
                          :items="types"
                          clearable
                          :item-text="getName()"
                          item-value="id"
                          :rules="typeRules"
                          :label="$t('type')"
                          v-model="demand.type"
                          @change="getMarques()"
                        >
                        </v-autocomplete>
                      </v-col>
                      <v-col
                        cols="12"
                        xl="10"
                        lg="10"
                        md="10"
                        v-show="is_vehicule"
                      >
                        <v-autocomplete
                          :items="continents"
                          clearable
                          :item-text="getName()"
                          item-value="id"
                          :label="$t('origine')"
                          v-model="demand.continent"
                        >
                        </v-autocomplete>
                      </v-col>
                      <v-col
                        cols="12"
                        xl="10"
                        lg="10"
                        md="10"
                        v-show="is_automobile"
                      >
                        <!-- marques -->
                        <v-autocomplete
                          multiple
                          chips
                          :items="marques"
                          :item-text="getName()"
                          item-value="id"
                          :label="$t('marque')"
                          v-model="demand.marques"
                          @change="getModeles()"
                        >
                          <template v-slot:selection="data">
                            <v-chip
                              v-bind="data.attrs"
                              :input-value="data.selected"
                              close
                              @click="data.select"
                              @click:close="
                                removeItem(data.item, demand.marques)
                              "
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
                      <v-col
                        cols="12"
                        xl="10"
                        lg="10"
                        md="10"
                        v-show="is_automobile"
                      >
                        <!-- modeles -->
                        <v-autocomplete
                          :items="modeles"
                          :messages="$t('optionnel')"
                          :item-text="getName()"
                          item-value="id"
                          :label="$t('modele')"
                          v-model="demand.modeles"
                          multiple
                        >
                          <template v-slot:selection="data">
                            <v-chip
                              v-bind="data.attrs"
                              :input-value="data.selected"
                              close
                              @click="data.select"
                              @click:close="
                                removeItem(data.item, demand.modeles)
                              "
                            >
                              {{ getName2(data.item) }}
                            </v-chip>
                          </template>
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" xl="10" lg="10" md="10">
                        <filepond-component
                          @filePondItemUploaded="demandImageUploaded($event)"
                          @filePondItemDeleted="demandImageDeleted($event)"
                        ></filepond-component>
                      </v-col>
                    </v-row>
                  </v-stepper-content>
                  <v-stepper-content step="2">
                    <v-row dense class="justify-center">
                      <v-col cols="12" xl="10" lg="10" md="10">
                        <!-- categories -->
                        <v-autocomplete
                          :items="categories"
                          :item-text="getName()"
                          item-value="id"
                          :label="$t('category')"
                          :rules="categoryRules"
                          multiple
                          v-model="demand.categories"
                          @change="getSubCategories()"
                        >
                          <template v-slot:selection="data">
                            <v-chip
                              v-bind="data.attrs"
                              :input-value="data.selected"
                              close
                              @click="data.select"
                              @click:close="
                                removeItem(data.item, demand.categories)
                              "
                            >
                              {{ getName2(data.item) }}
                            </v-chip>
                          </template>
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" xl="10" lg="10" md="10">
                        <!-- subcategories -->
                        <v-autocomplete
                          :items="subcategories"
                          :messages="$t('optionnel')"
                          :item-text="getName()"
                          item-value="id"
                          :label="$t('subcategory')"
                          v-model="demand.subcategories"
                          multiple
                          @change="getSubSubCategories($event)"
                        >
                          <template v-slot:selection="data">
                            <v-chip
                              v-bind="data.attrs"
                              :input-value="data.selected"
                              close
                              @click="data.select"
                              @click:close="
                                removeItem(data.item, demand.subcategories)
                              "
                            >
                              {{ getName2(data.item) }}
                            </v-chip>
                          </template>
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" xl="10" lg="10" md="10">
                        <!-- subsubcategories -->
                        <v-autocomplete
                          :items="subsubcategories"
                          :messages="$t('optionnel')"
                          :item-text="getName()"
                          item-value="id"
                          :label="$t('subsubcategory')"
                          v-model="demand.subsubcategories"
                          multiple
                        >
                          <template v-slot:selection="data">
                            <v-chip
                              v-bind="data.attrs"
                              :input-value="data.selected"
                              close
                              @click="data.select"
                              @click:close="
                                removeItem(data.item, demand.subsubcategories)
                              "
                            >
                              {{ getName2(data.item) }}
                            </v-chip>
                          </template>
                        </v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-stepper-content>
                  <v-stepper-content step="3">
                    <v-row dense class="justify-center">
                      <v-col cols="12" xl="10" lg="10" md="10">
                        <!-- notes -->
                        <v-textarea
                          :rules="noteRules"
                          clearable
                          :counter="500"
                          auto-grow
                          dense
                          clear-icon="mdi-close-circle"
                          :label="$t('note')"
                          v-model="demand.note"
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12" xl="10" lg="10" md="10">
                        <!-- wilaya -->
                        <v-autocomplete
                          :items="wilayas"
                          :item-text="
                            $i18n.locale == 'fr' ? 'name' : 'arabic_name'
                          "
                          :rules="wilayaRules"
                          item-value="id"
                          :label="$t('wilaya_demand')"
                          prepend-icon="mdi-google-maps"
                          v-model="demand.wilaya"
                        >
                          <template v-slot:item="slotProps">
                            {{
                              $i18n.locale == "fr"
                                ? slotProps.item.code +
                                  " " +
                                  slotProps.item.name
                                : slotProps.item.code +
                                  " " +
                                  slotProps.item.arabic_name
                            }}
                          </template>
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" xl="10" lg="10" md="10">
                        <!-- etat -->
                        <v-autocomplete
                          :items="etats"
                          :rules="etatRules"
                          :item-text="getName()"
                          item-value="id"
                          :label="$t('etat_demand')"
                          prepend-icon="mdi-circle"
                          v-model="demand.etat"
                        >
                        </v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-stepper-content>
                </v-stepper-items>
              </v-container>
            </v-card-text>

          
          </v-stepper>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { HTTP } from "../http-constants";

export default {
  props:['demande_dialog'],
  data: () => ({
    is_automobile: false,
    is_vehicule: false,
    typeRules: [(v) => !!v || "required"],
    categoryRules: [(v) => v.length != 0 || "required"],
    wilayaRules: [(v) => !!v || "required"],
    etatRules: [(v) => !!v || "required"],
    noteRules: [(v) => v.length <= 500 || ""],
    e1: 1,
    // demande_dialog: false,
    demand: {
      type: "",
      marques: [],
      modeles: [],
      categories: [],
      subcategories: [],
      subsubcategories: [],
      continent: "",
      etat: "",
      note: "",
      wilaya: "",
    },
    images: [],
    url: "",
    types: [],
    continents: [],
    marques: [],
    modeles: [],
    categories: [],
    subcategories: [],
    subsubcategories: [],
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
    //Filepond Image
    demandImageUploaded(e) {
      this.images.push(e);
    },
    demandImageDeleted(e) {
      var index = this.images.indexOf(e);
      this.images.splice(index, 1);
    },
    removeItem(item, list) {
      const index = list.indexOf(item.id);
      if (index >= 0) list.splice(index, 1);
    },
    // step 1
    getTypes() {
      HTTP.get("api/type")
        .then((repsponse) => {
          this.types = repsponse.data;
        })
        .catch(() => {
        });
    },
    getContinents() {
      HTTP.get("api/continent")
        .then((repsponse) => {
          this.continents = repsponse.data;
        })
        .catch(() => {
        });
    },
    getMarques() {
      if (this.demand.type == 2) {
        this.is_automobile = true;
        this.is_vehicule = false;
        this.demand.continent = "";

        HTTP.get("api/marque")
          .then((repsponse) => {
            this.marques = repsponse.data;
          })
          .catch(() => {
          });
      } else {
        this.is_vehicule = true;
        this.demand.continent = "";
        this.is_automobile = false;
        this.demand.marques = [];
        this.demand.modeles = [];
      }
    },
    getModeles() {
      this.modeles = [];
      HTTP.post("api/marque/modele", this.demand.marques)
        .then((repsponse) => {
          this.modeles = this.modeles.concat(repsponse.data);
        })
        .catch(() => {
   
        });
    },
    //step 2
    getCategories() {
      HTTP.get("api/category")
        .then((repsponse) => {
          this.categories = repsponse.data;
        })
        .catch(() => {

        });
    },
    getSubCategories() {
      HTTP.post("api/category/subcategories", this.demand.categories)
        .then((repsponse) => {
          this.subcategories = this.subcategories.concat(repsponse.data);
        })
        .catch(() => {

        });
    },
    getSubSubCategories() {
      HTTP.post("api/subcategory/subcategory2s", this.demand.subcategories)
        .then((repsponse) => {
          this.subsubcategories = this.subsubcategories.concat(repsponse.data);
        })
        .catch(() => {

        });
    },
    // step 3
    submitDemande() {
      let data = new FormData();
      let config = {
        header: {
          "Content-Type": "multipart/form-data",
        },
      };
      data.append("type", this.demand.type);
      data.append("continent", this.demand.continent);
      data.append("marques", this.demand.marques);
      data.append("modeles", this.demand.modeles);
      data.append("categories", this.demand.categories);
      data.append("subcategories", this.demand.subcategories);
      data.append("subsubcategories", this.demand.subsubcategories);
      data.append("etat", this.demand.etat);
      data.append("note", this.demand.note);
      data.append("wilaya", this.demand.wilaya);
      data.append("images", this.images);
      if (this.$store.state.auth.authenticated) {
        if (this.$refs.form.validate()) {
          HTTP.post("api/demande", data, config)
            .then((response) => {
              if (response.status == 200) {
                this.demande_dialog = false;
                this.$toasted.success("Demande créée avec succés!", {
                  theme: "bubble",
                  position: "bottom-center",
                  duration: 5000,
                });
                this.$emit('closeDemandeDiaog')
                if (this.$router.name == "demande") {
                  this.$router.replace({
                    name: "demande",
                    params: { id: response.data },
                  });
                } else {
                  this.$router.push({
                    name: "demande",
                    params: { id: response.data },
                  });
                }
                this.$emit("refreshDemande");
                // this.demand = {
                //                 type: "",
                //                 marques: [],
                //                 modeles: [],
                //                 categories: [],
                //                 subcategories: [],
                //                 subsubcategories: [],
                //                 continent: "",
                //                 etat: "",
                //                 note: "",
                //                 wilaya: "",
                //               }
              }
            })
            .catch(() => {

            });
        } else {
          if (!this.demand.type) {
            this.e1 = 1;
          } else {
            if (this.demand.categories.length == 0) {
              this.e1 = 2;
            }
          }
        }
      } else {
        this.$toasted.error(this.$t('connect'), {
          theme: "bubble",
          position: "bottom-center",
          duration: 3000,
        });
      }
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
    this.getTypes();
    this.getContinents();
    this.getCategories();
  },
};
</script>

