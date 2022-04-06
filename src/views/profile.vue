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
              <!-- notes -->
              <v-text-field
                type="password"
                :label="$t('password') + ' *'"
                prepend-icon="mdi-key"
                hide-details="auto"
                :rules="passRules"
                v-model="user.password"
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
                item-text="nom_ar"
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
                    {{ data.item.nom_ar }}
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12">
              <!-- marques -->
              <v-autocomplete
                multiple
                chips
                :items="marques"
                item-text="nom_ar"
                item-value="id"
                :label="$t('marques')"
                required
                v-model="user.marques"
                @change="getModeles($event)"
              >
                <template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    close
                    @click="data.select"
                    @click:close="removeItem(data.item, user.marques)"
                  >
                    {{ data.item.nom_ar }}
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12">
              <!-- modeles -->
              <v-autocomplete
                :items="modeles"
                item-text="nom_ar"
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
                    {{ data.item.nom_ar }}
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
                item-text="nom_fr"
                item-value="id"
                :label="$t('categories')"
                required
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
                    @click:close="removeItem(data.item, user.categories)"
                  >
                    {{ data.item.nom_fr }}
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12">
              <!-- subcategories -->
              <v-autocomplete
                :items="subcategories"
                item-text="nom_fr"
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
                    @click:close="removeItem(data.item, user.subcategories)"
                  >
                    {{ data.item.nom_fr }}
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12">
              <!-- subsubcategories -->
              <v-autocomplete
                :items="subsubcategories"
                item-text="nom_fr"
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
                    {{ data.item.nom_fr }}
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn color="success" class="mx-10" @click.prevent="register()">
          {{ $t("signin") }}
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
    user: null,
    nameRules: [(v) => !!v || "Name is required"],
    phoneRules: [
      (v) => !!v || "Phone is required",
      (v) => /^\d+$/.test(v) || "Phone must be a number",
    ],
    passRules: [(v) => !!v || "password is required"],
    typeRules: [(v) => v.length != 0 || "type is required"],
    wilayaRules: [(v) => !!v || "wilaya is required"],

    /*************************************** */
    types: [],
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
   
     async getTypes() {
      let response = await HTTP.get("api/type");
      this.types = response.data;
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
        .catch((error) => {
          console.log(error);
        });
    },
    //-----------------------------------
    async getCategories() {
      let response = await HTTP.get("api/category");
      this.categories = response.data;
    },
    getSubCategories() {
      HTTP.post("api/category/subcategories" , this.user.categories)
        .then((repsponse) => {
          this.subcategories = this.subcategories.concat(repsponse.data)
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSubSubCategories() {
      HTTP.post("api/subcategory/subcategory2s" ,  this.user.subcategories)
        .then((repsponse) => {
          this.subsubcategories = this.subsubcategories.concat (repsponse.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
     async getUserInfo() {
      let repsponse = await HTTP.get("api/user/profile");
      this.user = repsponse.data;
      this.getModeles();
      this.getCategories();
      this.getSubCategories();
      this.getSubSubCategories();
    },
  },

  created() {
    this.getUserInfo();
    this.getTypes();
    this.getMarques(); 
  },
  mounted(){
   
  }
};
</script>
