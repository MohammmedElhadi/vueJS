<template>
  <v-card class="justify-center pa-10">
    <v-card-title>
      Marques
      <v-spacer></v-spacer>
     
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :search="search"
      :headers="headers"
      :items="marques"
      :items-per-page="10"
      class="elevation-1"
      :sort-desc="[false, true]"
      multi-sort
    >
    <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>My CRUD</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
           <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
            New Item
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="new_marque.nom"
                    label="Libelé"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="new_marque.logo"
                    label="Url du Logo"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-avatar>
                    <v-img :src="new_marque.logo" />
                  </v-avatar>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
            <v-btn color="blue darken-1" text @click="createMarque"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
        </v-toolbar>
    </template>

      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
      <template v-slot:item.logo="{ item }">
        <v-avatar>
          <v-img :src="item.logo" />
        </v-avatar>
      </template>
      <!-- <template v-slot:item.statut="{ item }">
       <v-select
          :items="status"
          label="Standard"
          v-model="item.statut"
        ></v-select>
      </template> -->
      <!-- <template v-slot:body="{ items }">
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.wilaya_id }}</td>
            <td>
              <v-chip small>
                <a :href="'tel:' + item.phone">{{ item.phone }}</a></v-chip
              >
            </td>
          </tr>
        </tbody>
      </template> -->
    </v-data-table>
  </v-card>
</template>
<script>
import { HTTP } from "../http-constants";
import { djs } from "../plugins/dayjs";
export default {
  data: () => ({
    loading: false,
    search: "",
    marques: [],
    headers: [
      { text: "id", value: "id" },
      { text: "nom_ar", value: "nom_ar" },
      { text: "nom_fr", value: "nom_fr" },
      { text: "logo", value: "logo" },
    ],
    new_marque: {
      nom: "",
      logo: "",
    },
  }),

  methods: {
    getTime(timestamp) {
      return djs(timestamp).format("DD/MM/YYYY");
    },
    initialize() {
      this.marques = []
      HTTP.get("api/admin/marque").then((response) => {
        this.marques = response.data;
      });
    },

    createMarque() {
      let data = new FormData();
      let config = {
        header: {
          "Content-Type": "multipart/form-data",
        },
      };
      data.append("nom", this.new_marque.nom);
      data.append("logo", this.new_marque.logo);
        HTTP.post("api/admin/marque", data, config)
            .then((response) => {
              if (response.status == 200) {
                   this.$toasted.success(this.$t('Marque ajoutée'), {
                  theme: "bubble",
                  position: "bottom-center",
                  duration: 3000,
                });
                this.initialize();
              }
            }).catch(()=>{
              this.loading = false;
              this.$toasted.error(this.$t('error'), {
                  theme: "bubble",
                  position: "bottom-center",
                  duration: 3000,
                });
          })
    }
  },

  created() {
    this.initialize();
  },
};
</script>
