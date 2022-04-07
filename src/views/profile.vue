<template>
    <div>
     <v-card>
        <v-form ref="form" class="mx-2" lazy-validation>
          <v-card-title>
            <span class="text-h5">{{$t('Profile')}}</span>
          </v-card-title>
            <v-card-text>
                    <v-row dense class="justify-center">
                      <v-col cols="12" xl="10" lg="10" md="10">
                        <!-- Type -->
                        <v-autocomplete
                          :items="types"
                          item-text="nom_ar"
                          item-value="id"
                          :rules="typeRules"
                          label="Type de la véhicule"
                          required
                          v-model="demand.type"
                          @change="getMarques()"
                        >
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" xl="10" lg="10" md="10">
                        <!-- marques -->
                        <v-autocomplete
                          multiple
                          chips
                          :items="marques"
                          item-text="nom_ar"
                          item-value="id"
                          label="Marque de la véhicule"
                          required
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
                              {{ data.item.nom_fr }}
                            </v-chip>
                          </template>
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" xl="10" lg="10" md="10">
                        <!-- modeles -->
                        <v-autocomplete
                          :items="modeles"
                          item-text="nom_ar"
                          item-value="id"
                          label="Modele de la véhicule"
                          v-model="demand.modeles"
                          required
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
                              {{ data.item.nom_fr }}
                            </v-chip>
                          </template>
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" xl="10" lg="10" md="10">
                        <v-file-input
                          label="Photos de la pièce"
                          prepend-icon="mdi-camera"
                          multiple
                          show-size
                          @change="uploadPhotos"
                          accept="image/*"
                          v-model="image"
                        />
                      </v-col>
                      <v-col cols="12" xl="10" lg="10" md="10">
                        <v-img max-width="200" v-if="url" :src="url"></v-img>
                      </v-col>
                    </v-row>
            </v-card-text>

            <v-card-actions>
              <v-btn
                color="blue darken-1"
                class="mx-10"
                v-show="e1 > 1"
                @click="e1 = e1 - 1"
              >
                {{$t('Sauvgarder')}}
              </v-btn>

            </v-card-actions>
        </v-form>
      </v-card>
    </div>
</template>
<script>
import { HTTP } from "../http-constants";

export default {
  data: () => ({
     user : '',
     types : '', 
     marques : '', 
     modeles : '', 
  }),
methods :{
    getUserInfo(){
        HTTP.get("api/profile/")
        .then((response) => {
          if (response.status == 200) {
           return
          }
        })
        .catch(() => {
          return ["no data found"];
        });
    }
}

}
</script>
