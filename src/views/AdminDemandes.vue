<template>
  <v-card class="justify-center pa-10">
    <v-card-title>
      Demandes
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
      :items="demandes"
      :items-per-page="10"
      class="elevation-1"
      :sort-by="['', 'wilaya']"
      :sort-desc="[false, true]"
      multi-sort
    >
      <template v-slot:item.actions="{ item }">
        <v-icon v-if="!loading" @click="deleteItem(item)"> mdi-delete </v-icon>
           <v-progress-circular
           v-else
                indeterminate
                color="primary"
        ></v-progress-circular>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
      <template v-slot:item.demander="{ item }">
        <a :href="'tel:' + item.phone"> {{ item.demander.name }}</a>
      </template>
      <template v-slot:item.reponses="{ item }">
        {{ item.reponses.length }}
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ getTime(item.created_at) }}
      </template>
      <template v-slot:item.types="{ item }">
        <v-chip v-for="type in item.types" :key="'typ' + type.id">
          {{ type.nom_fr }}
        </v-chip>
      </template>
      <template v-slot:item.demandes="{ item }">
        {{ item.demandes.length }}
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
    loading : false,
    search: "",
    demandes: [],
    headers: [
      { text: "id", value: "id" },
      { text: "demander", value: "demander" },
      { text: "Reponses", value: "reponses" },
      { text: "wilaya", value: "wilaya_id" },
      { text: "création", value: "created_at" },
      { text: "Types", value: "types" },
    //   { text: "Status", value: "statut" },
      { text: "Actions", value: "actions" },
    ],
    types: [],  
    // status: ['active' , 'suspendue'],  
  }),
  
    methods : {
        getTime(timestamp){
           return djs(timestamp).format('DD/MM/YYYY') 
        },
       
      deleteItem (item) {
          this.loading=true;
          HTTP.delete('api/admin/demande/'+item.id).then(()=>{
            this.demandes.splice(this.demandes.indexOf(item), 1)
            this.loading = false;
            this.$toasted.success(this.$t('demande supprimée'), {
                  theme: "bubble",
                  position: "bottom-center",
                  duration: 3000,
                });

          }).catch(()=>{
              this.loading = false;
              this.$toasted.error(this.$t('error'), {
                  theme: "bubble",
                  position: "bottom-center",
                  duration: 3000,
                });
          })
      },

       getTypes() {
      HTTP.get("api/type")
        .then((repsponse) => {
          this.types = repsponse.data;
        })
        .catch(() => {
     
        });
    },
    initialize(){
      HTTP.get("api/admin/demande").then((response) => {
      this.demandes = response.data;
    });
    }
    },

  created() {
    this.getTypes();
    this.initialize();
  },
};
</script>
