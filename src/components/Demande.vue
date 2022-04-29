<template>
  <div>
    <v-card v-show="show" class="pa-2 mx-auto elevation-5" outlined>
      <v-card-title
        >{{ $t("demand") }} {{ demande.demande.id }}
        <v-spacer />
        <v-menu v-if="owner" :close-on-content-click="true" bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-title>
                <v-dialog v-model="delete_dialog" width="500">
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
                      {{ $t("are_you_sur") }}
                    </v-card-title>

                    <v-card-text>
                      {{ $t("this_is_not_reversible") }}
                    </v-card-text>
                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red darken-2" text @click="retirerDemande">
                        {{ $t("yes_delete") }}
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
            <!-- type && continent -->
            <v-chip-group column>
            <v-chip
              v-if="demande.type"
              small
              close-icon="mdi-close-outline"
              class="white--text"
              color="deep-purple darken-4"
               :to="{
                  name: 'demandes-filter',
                  params: { filter: 'type', id: demande.type.id },
                }"
              >{{ getName(demande.type) }}
            </v-chip>
              <v-chip
                small
                close-icon="mdi-close-outline"
                color="indigo darken-4"
                class="white--text"
                v-for="continent in demande.continents"
                :key="'cont' + continent.id"
                link
                :to="{
                  name: 'demandes-filter',
                  params: { filter: 'continent', id: continent.id },
                }"
                >{{ getName(continent) }}
              </v-chip>

            </v-chip-group>
            <!-- category -->
            <v-chip-group column>
              <v-chip
                small
                close-icon="mdi-close-outline"
                color="warning"
                v-for="category in demande.categories"
                :key="'cat' + category.id"
                link
                :to="{
                  name: 'demandes-filter',
                  params: { filter: 'category', id: category.id },
                }"
                >{{ getName(category) }}
              </v-chip>
            </v-chip-group>
            <!-- subcategory -->
            <v-chip-group column>
              <v-chip
                small
                close-icon="mdi-close-outline"
                color="warning"
                outlined
                v-for="subcategory in demande.subcategories"
                :key="'subcat' + subcategory.id"
                link
                :to="{
                  name: 'demandes-filter',
                  params: { filter: 'subcategory', id: subcategory.id },
                }"
                >{{ getName(subcategory) }}
              </v-chip>
            </v-chip-group>
            <!-- subcategory2 -->
            <v-chip-group column v-if="detail"> 
              <v-chip
                small
                close-icon="mdi-close-outline"
                color="warning"
                outlined
                v-for="subcategory2 in demande.subcategory2s"
                :key="'subsubcat' + subcategory2.id"
                link
                :to="{
                  name: 'demandes-filter',
                  params: { filter: 'subcategory2', id: subcategory2.id },
                }"
                >{{ getName(subcategory2) }}
              </v-chip>
            </v-chip-group>
            <!-- marque -->
            <v-chip-group column>
              <v-chip
                v-for="marque in demande.marques"
                :key="'mar' + marque.id"
                small
                close-icon="mdi-close-outline"
                color="success"
                link
                :to="{
                  name: 'demandes-filter',
                  params: { filter: 'marque', id: marque.id },
                }"
              >
                <v-avatar left>
                  <v-img :src="marque.logo"></v-img>
                </v-avatar>
                {{ getName(marque) }}
              </v-chip>
            </v-chip-group>
            <!-- modele -->
            <v-chip-group column>
              <v-chip
                small
                v-for="modele in demande.modeles"
                :key="'mar' + modele.id"
                close-icon="mdi-close-outline"
                color="success"
                  :to="{
                  name: 'demandes-filter',
                  params: { filter: 'modele', id: modele.id },
                }"
                outlined
                >{{ getName(modele) }}
              </v-chip>
            </v-chip-group>

            <br />
            <div v-if="demande.demande.note">
              <div
                :class="!$vuetify.theme.dark ? 'black--text' : 'white--text'"
                class="font-weight-bold"
              >
                <!-- <div class="black--text font-weight-bold"> -->
                {{ demande.demande.note }}
              </div>
            </div>
            <v-chip-group>
              <v-chip small color="success"
              :to="{
                  name: 'demandes-filter',
                  params: { filter: 'wilaya', id: wilaya.id },
                }"
              >
                <v-icon x-small>mdi-google-maps</v-icon>
                {{
                  $i18n.locale == "fr"
                    ? wilaya.code + " " + wilaya.name
                    : wilaya.code + " " + wilaya.arabic_name
                }}
              </v-chip>
              <v-chip color="info" small
               :to="{
                  name: 'demandes-filter',
                  params: { filter: 'etat', id: etat.id },
                }"
              >
                <v-icon x-small>mdi-</v-icon>
                {{ getName(etat) }}
              </v-chip>
            </v-chip-group>
          </v-col>

          <v-col md="4" lg="4" xl="4" cols="12">
            <v-carousel height="300" v-if="demande.images.length > 0">
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

      <v-expansion-panels 
      v-model="open" 
      multiple>
        <v-expansion-panel>
          <v-expansion-panel-header v-if="owner" @click="show_detail = true">
            {{ $t("show_offers") }}</v-expansion-panel-header
          >
          <v-expansion-panel-header
            v-else
            @click="show_detail = true"
            :class="demande.responded ? 'green' : 'pink'"
          >
            {{
              demande.responded ? $t("see_offer") : $t("propose")
            }}</v-expansion-panel-header
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
    delete_dialog: false,
    open : []
  }),
  computed: {
    sinse() {
      this.$i18n.locale == 'ar' ?djs.locale('ar-dz') :  djs.locale(this.$i18n.locale) 
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
    getName(item) {
      if (this.$i18n.locale == "fr") return item.nom_fr;
      else return item.nom_ar;
    },
    ToggleSaved() {
      HTTP.get("api/demande/" + this.demande.demande.id + "/ToggleSaved")
        .then((response) => {
          this.demande.is_saved = response.data.is_saved;
          this.demande.likes = response.data.likes;
        })
        .catch(() => {
        });
    },
    markAsResponded() {
      this.demande.responded = true;
    },
    markAsNotResponded() {
      this.demande.responded = false;
    },
    retirerDemande() {
      HTTP.delete("api/demande/" + this.demande.demande.id)
        .then((response) => {
          if (response.status == 200) {
            this.delete_dialog = false;
            this.show = false;
            this.$toasted.danger("Demande supprimée  avec succés", {
              theme: ["bubble", "outlined"],
              position: "bottom-right",
              duration: 5000,
            });
          }
        })
        .catch((error) => {
          return [error];
        });
    },
    showMarqueDemandes(id) {
      HTTP.get("api/marque/" + id + "/demandes").then((response) => {
        this.$emit("showMarqueDemandes", response.data);
      });
    },
  },
  created() {
    this.open = this.detail?[0]:[]
    this.show_detail = this.detail;

  },
  mounted() {},
  updated() {},
};
</script>
