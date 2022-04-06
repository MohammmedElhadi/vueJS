<template>
  <div>
    <v-card v-show="show" class="pa-2 mx-auto elevation-5" outlined>
      <v-card-title
        >{{ $t("demand") }} {{ demande.demande.id }}
        <v-spacer />
        <v-menu v-if="owner" :close-on-content-click="true" bottom left >
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-title>
                <v-dialog  v-model="delete_dialog" width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      dense
                      fa-flip-horizontal
                      rounded
                      text
                      color="red"
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{ $t("delete_demande") }}
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title
                      dark
                      class="text-h7 red darken-3 justify-center"
                    >
                      {{$t('are_you_sur')}}
                    </v-card-title>

                    <v-card-text> {{$t('this_is_not_reversible')}} </v-card-text>
                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red darken-2" text @click="retirerDemande">
                        {{$t('yes_delete')}}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-item-title>
            </v-list-item>
            <!-- <v-list-item>
                <v-list-item-title>{{ $t('disactivate') }}</v-list-item-title>
              </v-list-item> -->
          </v-list>
        </v-menu>
      </v-card-title>
      <v-card-subtitle> {{ sinse }}</v-card-subtitle>
      <v-card-text>
        <v-row align-content="center">
          <v-col md="8" lg="8" xl="8" cols="12">
            <v-chip
              v-if="demande.type"
              small
              close-icon="mdi-close-outline"
              class="white--text"
              color="deep-purple darken-4"
              >{{ getName(demande.type) }}
            </v-chip>
            <v-chip-group column>
              <v-chip
                small
                close-icon="mdi-close-outline"
                color="warning"
                v-for="category in demande.categories"
                :key="'cat' + category.id"
                >{{ getName(category) }}
              </v-chip>
            </v-chip-group>
            <v-chip-group column>
              <v-chip
                small
                close-icon="mdi-close-outline"
                color="warning"
                outlined
                v-for="subcategory in demande.subcategories"
                :key="'subcat' + subcategory.id"
                >{{ getName(subcategory)}}
              </v-chip>
            </v-chip-group>

            <v-chip-group column>
              <v-chip
                v-for="marque in demande.marques"
                :key="'mar' + marque.id"
                small
                close-icon="mdi-close-outline"
                color="success"
                >{{ getName(marque) }}
              </v-chip>
            </v-chip-group>
            <v-chip-group column>
              <v-chip
                small
                v-for="modele in demande.modeles"
                :key="'mar' + modele.id"
                close-icon="mdi-close-outline"
                color="success"
                outlined
                >{{ getName(modele) }}
              </v-chip>
            </v-chip-group>

            <br />
            <div v-if="demande.demande.note">
              <v-icon small>mdi-note</v-icon>
              {{ demande.demande.note }}
            </div>
            <v-chip-group>
              <v-chip small color="success">
                <v-icon x-small>mdi-google-maps</v-icon>
                {{$i18n.locale == 'fr' ? wilaya.code + " " +  wilaya.name 
                                       : wilaya.code + " " + wilaya.arabic_name }}
              </v-chip>
              <v-chip color="info" small>
                <v-icon x-small>mdi-</v-icon>
                {{ getName(etat) }}
              </v-chip>
            </v-chip-group>
          </v-col>

          <v-col md="4" lg="4" xl="4" cols="12">
            <v-carousel height="300" v-if="demande.images.length > 0" >
              <v-carousel-item
                v-for="(image, i) in demande.images"
                :key="i"
                :src="image.imageURL"
              ></v-carousel-item>
            </v-carousel>
          </v-col>
          <!-- {{$t('save')}} -->
          <v-btn 
            class="mx-8"
            v-if="$store.state.auth.authenticated"
            :class="demande.is_saved ? 'red--text' : ''"
            icon
            @click="ToggleSaved"
          >
            <v-icon>mdi-bookmark</v-icon> 
            {{ demande.likes > 0 ? demande.likes : "" }}
          </v-btn>

          <v-btn v-if="!detail" icon :to="'/demande/' + demande.demande.id">
            <v-icon>mdi-page-next-outline</v-icon>
          </v-btn>
        </v-row>
      </v-card-text>

      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header v-if="owner" @click="show_detail = true">
            {{ $t("show_offers") }}</v-expansion-panel-header
          >
          <v-expansion-panel-header
            v-else
            @click="show_detail = true"
            :class="demande.responded ? 'green' : 'pink'"
          >
            {{demande.responded? $t("see_offer") :$t("propose") }}</v-expansion-panel-header
          >
          <offers-list
            v-if="owner && show_detail"
            :demande_id="demande.demande.id"
          ></offers-list>
          <offre
            v-if="!owner && show_detail"
            :demande_id="demande.demande.id"
            :user_id="demande.demande.user_id"
            @offer_responded="markAsResponded()"
            @remove_offer="markAsNotResponded()"
          ></offre>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </div>
</template>
<script>
import { HTTP } from "../http-constants";
import OffersList from "./OffersList.vue";
import offre from "./offre.vue";
import { djs } from "../plugins/dayjs";
// import ImageBox from "vue-image-box";

export default {
  components: { offre, OffersList },
  props: ["demande", "detail"],
  data: () => ({
    show: true,
    show_detail: false,
    delete_dialog : false
  }),
  computed: {
    sinse() {
      return djs(this.demande.demande.updated_at).fromNow();
    },
    owner() {
      return this.demande.demande.user_id === this.$store.state.auth.user.id;
    },
    wilayas() {
      return this.$store.state.wilayas;
    },
    etats() {
      return this.$store.state.etats;
    },

    wilaya() {
      return this.$store.state.wilayas.find(
        (item) => item.id == this.demande.demande.wilaya_id
      );
    },
    etat() {
      return this.$store.state.etats.find(
        (item) => item.id == this.demande.demande.etat_id
      );
    },
  },
  methods: {
    getName(item){
      if(this.$i18n.locale == 'fr')
        return item.nom_fr;
      else return  item.nom_ar;
    },
    ToggleSaved() {
      HTTP.get("api/demande/" + this.demande.demande.id + "/ToggleSaved")
        .then((response) => {
          console.log(response.data);
          this.demande.is_saved = response.data.is_saved;
          this.demande.likes = response.data.likes;
        })
        .catch(() => {
          console.log("error");
        });
    },
    markAsResponded() {
      this.demande.responded = true;
    },
    markAsNotResponded() {
      this.demande.responded = false;
    },
    retirerDemande(){
        HTTP.delete("api/demande/" + this.demande.demande.id)
        .then((response) => {
          if (response.status == 200) {
            this.delete_dialog = false;
            this.show = false;
            this.$toasted.danger("Demande supprimée  avec succés", {
              theme: ["bubble", "outlined"],
              position: "top-right",
              duration: 5000,
            });
          }
        })
        .catch((error) => {
          return [error];
        });
    },
  },
  created() {},
  mounted() {},
  updated() {},
};
</script>
