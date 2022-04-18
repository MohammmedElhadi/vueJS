<template>
  <v-card class="justify-center pa-10">
    <v-card-title>
      Users
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
      :items="users"
      :items-per-page="10"
      class="elevation-1"
      :sort-by="['calories', 'fat']"
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
                        v-model="editedItem.name"
                        label="Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.phone"
                        label="phone"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.wilaya_id"
                        label="wilaya"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <!-- Type -->
                        <v-autocomplete
                          :items="types"
                          clearable
                          multiple
                          item-text="nom_fr"
                          item-value="id"
                          :rules="typeRules"
                          :label="$t('type')"
                          v-model="editedItem.types"
                        >
                        </v-autocomplete>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
      <template v-slot:item.phone="{ item }">
        <v-chip>
          <a :href="'tel:' + item.phone">{{ item.phone }}</a>
        </v-chip>
      </template>
      <template v-slot:item.created_at="{ item }">
            {{               
                getTime(item.created_at)
            }}
      </template>
      <template v-slot:item.types="{ item }">
           <v-chip v-for="type in item.types" :key="'typ'+type.id">
               {{type.nom_fr}}
           </v-chip>
      </template>
      <template v-slot:item.demandes="{ item }">
            {{               
                item.demandes.length
            }}
      </template>
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
    dialog: false,
    dialogDelete: false,
    search: "",
    users: [],
    headers: [
      { text: "name", value: "name" },
      { text: "phone", value: "phone" },
      { text: "wilaya", value: "wilaya_id" },
      { text: "inscription", value: "created_at" },
      { text: "Demandes", value: "demandes" },
      { text: "Types", value: "types" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      name: "",
      phone: "",
      wilaya: "",
      types : [],
    },
    defaultItem: {
      name: "",
      phone: "",
      wilaya: "",
    },
    types: [],  
  }),
   computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    methods : {
        getTime(timestamp){
           return djs(timestamp).format('DD/MM/YYYY') 
        },
        editItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.users.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.users[this.editedIndex], this.editedItem)
        } else {
          this.users.push(this.editedItem)
        }
        this.close()
      },
       getTypes() {
      HTTP.get("api/type")
        .then((repsponse) => {
          this.types = repsponse.data;
        })
        .catch(() => {
     
        });
    },
    },

  created() {
    this.getTypes();
    HTTP.get("api/admin/user").then((response) => {
      this.users = response.data;
    });
  },
};
</script>
