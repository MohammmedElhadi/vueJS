<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      eager
      max-width="90%"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="my-2" block v-bind="attrs" right v-on="on" color="info">
          {{ $t("signin") }}
        </v-btn>
      </template>
      <v-card>
        <v-form ref="form" class="mx-2" lazy-validation>
          <v-card-title>
            <span class="text-h5">{{ $t("signin") }}</span>
            <v-spacer />
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-stepper v-model="e1">
            <v-card-text>
              <v-container>
                <v-stepper-header>
                  <v-stepper-step :complete="e1 > 1" step="1">
                    {{ $t("contact_info") }}
                  </v-stepper-step>

                  <v-divider></v-divider>

                  <v-stepper-step :complete="e1 > 2" step="2">
                    {{ $t("marque_info") }}
                  </v-stepper-step>

                  <v-divider></v-divider>

                  <v-stepper-step step="3">
                    {{ $t("category_info") }}
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
                color="blue darken-1"
                class="mx-10"
                v-show="e1 < 3"
                @click="e1 = e1 + 1"
              >
                {{ $t("next") }}
              </v-btn>

                 <v-progress-circular
                 v-if="loading"
                 class="mx-10"
                  v-show="e1 == 3"
                indeterminate
                color="success"
              ></v-progress-circular>
              <v-btn
                v-else
                color="success"
                class="mx-10"
                v-show="e1 == 3"
                @click.prevent="register()"
              >
                {{ $t("signin") }}
              </v-btn>
            </v-card-actions>
                <v-stepper-items>
                  <v-stepper-content step="1">
                    <v-row dense>
                      <v-col cols="12">
                        <!-- nom -->
                        <v-text-field
                          :label="$t('name') + ' *'"
                          prepend-icon="mdi-account"
                          hide-details="auto"
                          :rules="nameRules"
                          v-model="user.name"
                        ></v-text-field>
                      </v-col>
                      <v-col md="6" lg="6" cols="12">
                        <!-- password -->
                        <v-text-field
                          type="password"
                          :label="$t('password') + ' *'"
                          prepend-icon="mdi-key"
                          hide-details="auto"
                          :rules="passRules"
                          v-model="user.password"
                          @keyup="checkPassword"
                        ></v-text-field>
                      </v-col>
                      <v-col md="6" lg="6" cols="12">
                        <!-- password 2 -->
                        <v-text-field
                          type="password"
                          :label="$t('confirm_password') + ' *'"
                          prepend-icon="mdi-key"
                          :messages="
                            checkPassword() ? '' : $t('check_password')
                          "
                          hide-details="auto"
                          :rules="passRules"
                          v-model="user.password2"
                          @keyup="checkPassword"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <!-- phone -->
                        <v-text-field
                          prepend-icon="mdi-phone"
                          :label="$t('tel') + ' *'"
                          hide-details="auto"
                          :rules="phoneRules"
                          v-model="user.phone"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12">
                        <!-- wilaya -->
                        <v-autocomplete
                          :items="wilayas"
                          item-text="name"
                          item-value="id"
                          :label="$t('wilaya') + ' *'"
                          prepend-icon="mdi-google-maps"
                          required
                          :rules="wilayaRules"
                          v-model="user.wilaya"
                          @click="wilayas = $store.state.wilayas"
                        >
                          <template v-slot:item="slotProps"
                            >{{ slotProps.item.code }}-{{ slotProps.item.name }}
                          </template>
                        </v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-stepper-content>

                  <v-stepper-content step="2">
                    <v-row dense>
                      <v-col cols="12">
                        <!-- Type -->
                        <v-autocomplete
                          ref="types"
                          :items="types"
                          :item-text="getName()"
                          item-value="id"
                          :rules="typeRules"
                          :label="$t('types') + ' *'"
                          chips
                          required
                          multiple
                          v-model="user.types"
                          close
                        >
                          <template v-slot:selection="data">
                            <v-chip
                              v-bind="data.attrs"
                              :input-value="data.selected"
                              close
                              @click="data.select"
                              @click:close="removeItem(data.item, user.types)"
                            >
                              {{ getName2(data.item) }}
                            </v-chip>
                          </template>
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <!-- Continent -->
                        <v-autocomplete
                          ref="types"
                          :messages="$t('optionnel')"
                          :items="continents"
                          :item-text="getName()"
                          item-value="id"
                          :label="$t('origine')"
                          chips
                          multiple
                          v-model="user.continents"
                          close
                        >
                          <template v-slot:selection="data">
                            <v-chip
                              v-bind="data.attrs"
                              :input-value="data.selected"
                              close
                              @click="data.select"
                              @click:close="
                                removeItem(data.item, user.continents)
                              "
                            >
                              {{ getName2(data.item) }}
                            </v-chip>
                          </template>
                        </v-autocomplete>
                      </v-col>
                      <!-- marques -->
                      <v-col cols="12">
                        <v-autocomplete
                          multiple
                          chips
                          :items="marques"
                          :item-text="getName()"
                          item-value="id"
                          :label="$t('marque')"
                          v-model="user.marques"
                          @change="getModeles()"
                        >
                          <template v-slot:selection="data">
                            <v-chip
                              v-bind="data.attrs"
                              :input-value="data.selected"
                              close
                              @click="data.select"
                              @click:close="removeItem(data.item, user.marques)"
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
<!-- modeles -->
                      <!-- <v-col cols="12">
                        
                        <v-autocomplete
                          :items="modeles"
                          :messages="$t('optionnel')"
                          :item-text="getName()"
                          item-value="id"
                          :label="$t('modeles')"
                          v-model="user.modeles"
                          chips
                          multiple
                        >
                          <template v-slot:selection="data">
                            <v-chip
                              v-bind="data.attrs"
                              :input-value="data.selected"
                              close
                              @click="data.select"
                              @click:close="removeItem(data.item, user.modeles)"
                            >
                              {{ getName2(data.item) }}
                            </v-chip>
                          </template>
                        </v-autocomplete>
                      </v-col> -->
                    </v-row>
                  </v-stepper-content>
                  <v-stepper-content step="3">
                    <v-row dense>
                      <v-col cols="12">
                        <!-- profession -->
                      <v-autocomplete
                          ref="professions"
                          prepend-icon="mdi-cog"
                          :items="professions"
                          :item-text="getName()"
                          item-value="id"
                          :label="$t('profession') + ' *'"
                          v-model="user.professions"
                          close
                        >
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <!-- categories -->
                        <v-autocomplete
                          :items="categories"
                          :item-text="getName()"
                          item-value="id"
                          :label="$t('categories')"
                          multiple
                          chips
                          v-model="user.categories"
                          @change="getSubCategories"
                        >
                          <template v-slot:selection="data">
                            <v-chip
                              v-bind="data.attrs"
                              :input-value="data.selected"
                              close
                              @click="data.select"
                              @click:close="
                                removeItem(data.item, user.categories)
                              "
                            >
                              {{ getName2(data.item) }}
                            </v-chip>
                          </template>
                        </v-autocomplete>
                      </v-col>
                      <!-- subcategories -->
                      <!-- <v-col cols="12">
                        <v-autocomplete
                          :items="subcategories"
                          :messages="$t('optionnel')"
                          :item-text="getName()"
                          item-value="id"
                          multiple
                          :label="$t('subcategory')"
                          v-model="user.subcategories"
                          @change="getSubSubCategories"
                        >
                          <template v-slot:selection="data">
                            <v-chip
                              v-bind="data.attrs"
                              :input-value="data.selected"
                              close
                              @click="data.select"
                              @click:close="
                                removeItem(data.item, user.subcategories)
                              "
                            >
                              {{ getName2(data.item) }}
                            </v-chip>
                          </template>
                        </v-autocomplete>
                      </v-col> -->
                      <!-- subsubcategories -->
                      <!-- <v-col cols="12">
                        <v-autocomplete
                          :items="subsubcategories"
                          :messages="$t('optionnel')"
                          :item-text="getName()"
                          item-value="id"
                          multiple
                          :label="$t('subsubcategory')"
                          v-model="user.subsubcategories"
                        >
                          <template v-slot:selection="data">
                            <v-chip
                              v-bind="data.attrs"
                              :input-value="data.selected"
                              close
                              @click="data.select"
                              @click:close="
                                removeItem(data.item, user.subsubcategories)
                              "
                            >
                              {{ getName2(data.item) }}
                            </v-chip>
                          </template>
                        </v-autocomplete>
                      </v-col> -->
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
  name: "register",
  data: () => ({
    nameRules: [(v) => !!v || ""],
    phoneRules: [
      (v) => !!v || "",
      (v) => 9 <= v.length && v.length<= 10 || "",
      (v) => /^\d+$/.test(v) || "",
    ],
    passRules: [(v) => !!v || "required"],
    typeRules: [(v) => v.length != 0 || "required"],
    wilayaRules: [(v) => !!v || "required"],

    e1: 1,  
    dialog: false,
    user: {
      types: [],
      professions: [],
      continents: [],
      marques: [],
      modeles: [],
      categories: [],
      subcategories: [],
      subsubcategories: [],
      image: "",
      bio: "",
      wilaya: "",
      name: "",
      password: "",
      password2: "",
      phone: "",
    },
    is_vehicule: false,
    is_automobile: false,
    types: [],
    professions: [],
    continents: [],
    marques: [],
    modeles: [],
    categories: [],
    subcategories: [],
    subsubcategories: [],
    wilayas: [],
    etats: [],
    loading : false
  }),
  computed: {},
  methods: {
    checkPassword() {
      return this.user.password === this.user.password2;
    },
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
    getNextselect() {
      if (this.user.types.length > 0) {
        if (this.user.types.includes(2)) {
          this.is_automobile = true;
        } else {
          this.is_vehicule = true;
        }
      }
    },
     getTypes() {
      HTTP.get("api/type").then((response) =>{
        this.types = response.data;
      });
      
    },
     getProfessions() {
    HTTP.get("api/profession").then((response) =>{
       this.professions = response.data; 
      });
      
    },
     getContinents() {
     HTTP.get("api/continent").then((response) =>{
        this.continents = response.data;
      });
    },
     getMarques() {
     HTTP.get("api/marque").then((response) =>{
         this.marques = response.data;
      });
    
    },
    //-----------------------------------
    getModeles() {
      this.modeles = [];
      HTTP.post("api/marque/modele", this.user.marques)
        .then((repsponse) => {
          this.modeles = this.modeles.concat(repsponse.data);
        })
        .catch(() => {
         
        });
    },
    //-----------------------------------
     getCategories() {
      HTTP.get("api/category").then((response) =>{
       this.categories = response.data;
      });
      
    },
    getSubCategories() {
      HTTP.post("api/category/subcategories", this.user.categories)
        .then((repsponse) => {
          this.subcategories = this.subcategories.concat(repsponse.data);
        })
        .catch(() => {
         
        });
    },
    getSubSubCategories() {
      HTTP.post("api/subcategory/subcategory2s", this.user.subcategories)
        .then((repsponse) => {
          this.subsubcategories = this.subsubcategories.concat(repsponse.data);
        })
        .catch(() => {
          
        });
    },

    register() {
     if (!this.checkPassword()) {
          this.e1 = 1;
          this.$toasted.error(this.$t("check_password"), {
            theme: "bubble",
            position: "top-center",
            duration: 5000,
            keepOnHover: true,
          });
     }
     else{
          if (this.$refs.form.validate()) {
            this.loading = true
        HTTP.post("api/register", this.user)
          .then((response) => {
            if (response.status == 200) {
              HTTP.get("/sanctum/csrf-cookie").then(() => {
                HTTP.post("api/login", {
                  phone: this.user.phone,
                  password: this.user.password,
                })
                  .then(() => {
                    this.$store.dispatch("auth/login");
                    this.dialog = false;
                    this.$emit("RefreshUser");
                    this.$toasted.info("Bienvenue", {
                      theme: "bubble",
                      position: "top-center",
                      duration: 5000,
                    });
                    setTimeout(() => {
                    this.$router.go();
                    }, 2000);
                  
                  })
                  .catch(() => {
                    this.loading = false
                     this.$toasted.error(this.$t("error"), {
                      theme: "bubble",
                      position: "top-center",
                      duration: 5000,
                    });
                    
                  })
                  .finally(()=>{
                    this.loading = false
                  });
                
              }).catch(()=>{
                  this.loading = false
              });
            }
          })
          .catch((error) => {
              this.loading = false
              this.e1 = 1;
              let message = error.response.data.message;
              this.$toasted.error(this.$t(message)
               ,
                {
                  theme: "bubble",
                  position: "top-center",
                  duration: 3000,
                }
              );
            })
            // this.loading= false;

      } else {
        if (this.user.types.length == 0) {
          this.e1 = 2;
        } else this.e1 = 1;
      }
     }
    },
  },
  created(){
    if(this.$store.state.wilayas.length === 0)
          this.$store.dispatch("loadWilayas");
    this.wilayas = this.$store.state.wilayas;
  },
  mounted() {
    this.getProfessions();
    this.getTypes();
    this.getContinents();
    this.getMarques();
    this.getCategories();
  },
};
</script>
<style>
.container {
  max-width: 100vw;
  padding: 0px;
  margin: 0px;
}
</style>
