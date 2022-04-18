<template>
  <v-form ref="form" class="mx-2" lazy-validation>
    <v-card class="pa-0">
      <v-card-title>
        <span class="text-h5">{{ $t("profile") }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
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
              >
                <template v-slot:item="slotProps"
                  >{{ slotProps.item.code }}-{{ slotProps.item.name }}
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
          <br />
          <v-divider />
          <br />
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
            <v-col cols="12">
              <!-- modeles -->
              <v-autocomplete
                :items="modeles"
                :item-text="getName()"
                item-value="id"
                :label="$t('modeles')"
                v-model="user.modeles"
                required
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
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <!-- categories -->
              <v-autocomplete
                :items="categories"
                :item-text="getName()"
                item-value="id"
                :label="$t('categories')"
                required
                multiple
                chips
                v-model="user.categories"
              >
                <template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    close
                    @click="data.select"
                    @click:close="removeItem(data.item, user.categories)"
                  >
                    {{ getName2(data.item) }}
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12">
              <!-- subcategories -->
              <v-autocomplete
                :items="subcategories"
                :item-text="getName()"
                item-value="id"
                multiple
                :label="$t('subcategory')"
                v-model="user.subcategories"
              >
                <template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    close
                    @click="data.select"
                    @click:close="removeItem(data.item, user.subcategories)"
                  >
                    {{ getName2(data.item) }}
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12">
              <!-- subsubcategories -->
              <v-autocomplete
                :items="subsubcategories"
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
                    @click:close="removeItem(data.item, user.subsubcategories)"
                  >
                    {{ getName2(data.item) }}
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn color="success" class="mx-10" @click.prevent="update()">
          {{ $t("save") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
<script>
import { HTTP } from "../http-constants";
export default {
  components: {},
  data: () => ({
    nameRules: [(v) => !!v || "Name is required"],
    phoneRules: [
      (v) => !!v || "Phone is required",
      (v) => /^\d+$/.test(v) || "Phone must be a number",
    ],
    passRules: [(v) => !!v || "password is required"],
    typeRules: [(v) => v.length != 0 || "type is required"],
    wilayaRules: [(v) => !!v || "wilaya is required"],

    /*************************************** */
    user: {},
    types: [],
    continents: [],
    marques: [],
    modeles: [],
    categories: [],
    subcategories: [],
    subsubcategories: [],
  }),
  computed: {
    wilayas() {
      return this.$store.state.wilayas;
    },
    etats() {
      return this.$store.state.etats;
    },
  },

  methods: {
    removeItem(item, list) {
      const index = list.indexOf(item.id);
      if (index >= 0) list.splice(index, 1);
    },
    getName2(item) {
      if (this.$i18n.locale == "fr") return item.nom_fr;
      else return item.nom_ar;
    },
    getName() {
      if (this.$i18n.locale == "fr") return "nom_fr";
      else return "nom_ar";
    },
    getUserInfo() {
      HTTP.get("api/user/profile").then((repsponse) => {
        let data = repsponse.data;
        this.user.name = data.name;
        this.user.phone = data.phone;
        this.user.wilaya = data.wilaya_id;
        this.user.types = data.types.map((a) => a.id);
        this.user.continents = data.continents.map((a) => a.id);
        this.user.marques = data.marques.map((a) => a.id);
        this.user.modeles = data.modeles.map((a) => a.id);
        this.user.categories = data.categories.map((a) => a.id);
        this.user.subcategories = data.subcategories.map((a) => a.id);
        this.user.subsubcategories = data.subcategories2.map((a) => a.id);
        this.getModeles();
        this.getSubCategories();
        this.getSubSubCategories();
      });
    },
    init() {
      this.getTypes();
      this.getContinents();
      this.getMarques();
      this.getCategories();
      this.getAllModeles();
      this.getAllSubCategories();
      this.getAllSubSubCategories();
    },
    async getTypes() {
      let response = await HTTP.get("api/type");
      this.types = response.data;
    },
    async getContinents() {
      let response = await HTTP.get("api/continent");
      this.continents = response.data;
    },
    async getAllModeles() {
      let response = await HTTP.get("api/modele");
      this.modeles = response.data;
    },
    async getAllSubCategories() {
      let response = await HTTP.get("api/subcategory");
      this.subcategories = response.data;
    },
    async getAllSubSubCategories() {
      let response = await HTTP.get("api/subcategory2");
      this.subsubcategories = response.data;
    },
    async getMarques() {
      let response = await HTTP.get("api/marque");
      this.marques = response.data;
    },
    getModeles() {
      this.modeles = [];
      HTTP.post("api/marque/modele", this.user.marques)
        .then((repsponse) => {
          this.modeles = this.modeles.concat(repsponse.data);
        })
        .catch(() => {
         
        });
    },
    async getCategories() {
      let response = await HTTP.get("api/category");
      this.categories = response.data;
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

    update() {
      if (this.$refs.form.validate()) {
        HTTP.put("api/user/update/"+this.$store.state.auth.user.id ,  this.user)
          .then((response) => {
            if (response.status == 200) {
              this.$toasted.info(this.$t("updated"), {
                theme: "bubble",
                position: "bottom-center",
                duration: 5000,
                keepOnHover: true,
              });
            }
          })
          .catch(() => {
           
          })
          .finally();
      }
    },
  },

  created() {
    this.getUserInfo();
    this.init();
  },
  mounted() {},
};
</script>
