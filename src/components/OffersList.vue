<template>
  <div>
    <v-expansion-panel-content>
      <v-dialog v-model="dialog" width="800"  >
        <v-card>
          <v-card-title> {{$t('detail_offer')}}
            <v-spacer />
           <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn> 
            </v-card-title>
          <v-card-text>
             <v-row>
              <v-col cols="12" md="6" lg="6" xl="6">
            {{$t('wilaya')}} : <v-chip small>
              {{ offer.wilaya }}</v-chip>
            <br>
            <br>
            {{$t('etat')}} : <v-chip small>{{ offer.etat }}</v-chip>
            <br>
            <br>
             {{$t('tel')}}  :    <v-chip small> <a :href="'tel:'+offer.phone">{{offer.phone}}</a></v-chip>     
            <br>
            <br>
             {{$t('note')}} : 
             <br>
             {{offer.note}}
         
              </v-col>

         <v-col cols="12" md="6" lg="6" xl="6">
             <v-carousel height="300" v-if="offer.images.length > 0" touch>
              <v-carousel-item
                v-for="(image, i) in offer.images"
                :key="i"
                :src="image.imageURL"
              ></v-carousel-item>
            </v-carousel>
        </v-col>
             </v-row>
          </v-card-text>
          
          
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">
              {{$t('fermer')}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-data-table 
        :headers="headers"
        :items="offers"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:body="{ items }">
          <tbody>
            <tr v-for="item in items" :key="item.id" >
              <td @click="showDetail(item)">{{ $store.state.wilayas.find((ss) => ss.id = item.reponse.wilaya_id ).arabic_name}}</td>
              <td @click="showDetail(item)">{{ item.etat }}</td>
              <td @click="showDetail(item)">{{ item.reponse.prix_offert }}</td>
              <td><v-chip small> <a :href="'tel:'+item.phone">{{item.phone}}</a></v-chip></td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </v-expansion-panel-content>
  </div>
</template>
<script>
import { HTTP } from "../http-constants";
export default {
  props: ["demande_id"],
  data: () => ({
    dialog: false,
    loading: false,
    headers: [
    { text: "Wilaya"},
      { text: "Etat"},
      { text: "Prix"},
      { text: "Phone"},
    ],
    offers: [],
    offer: {
      wilaya: "",
      etat: "",
      Prix: "",
      note : "",
      phone: "",
      images : "",
    },
  }),
  methods: {
    getOffers() {
      
      this.loading = true;
      HTTP.get("api/reponse/" + this.demande_id + "/all")
        .then((response) => {
          if (response.status == 200) {
            this.offers = response.data;
            console.log(this.offers)
            this.loading = false;
          } else return;
        })
        .catch(() => {
          return ["no data found"];
        });
    },
    showDetail(it) {
      
      this.offer.wilaya = this.$store.state.wilayas.find(
        (item) => item.id == it.reponse.wilaya_id).name;
      this.offer.etat =  it.reponse.etat.nom_fr
      this.offer.note =  it.reponse.note
      this.offer.phone =  it.phone
      this.offer.images =  it.images
      console.log(it.image);
      this.dialog = true;
    },
  },
  mounted() {
    console.log(this.demande_id)
    console.log(this.offers)
    this.getOffers();
  },
};
</script>
