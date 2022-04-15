<template>
  <div>
    <v-form ref="form" class="mx-2" lazy-validation>
      <v-expansion-panel-content>
        <v-row>
          <v-col ols="12">
            <v-autocomplete
              dense
              :items="wilayas"
              :item-text="$i18n.locale == 'fr' ? 'name' : 'arabic_name'"
              item-value="id"
              :label="$t('wilaya')"
              prepend-icon="mdi-google-maps"
              :rules="wilayaRules"
              v-model="offer.wilaya_id"
            >
              <template v-slot:item="slotProps">
                {{
                  $i18n.locale == "fr"
                    ? slotProps.item.code + " " + slotProps.item.name
                    : slotProps.item.code + " " + slotProps.item.arabic_name
                }}
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="12">
            <!-- etat -->
            <v-autocomplete
              dense
              :items="etats"
              :item-text="getName()"
              item-value="id"
              :label="$t('etat')"
              prepend-icon="mdi-circle"
              :rules="etatRules"
              v-model="offer.etat_id"
            >
            </v-autocomplete>
          </v-col>
        </v-row>

        <v-text-field
          dense
          :placeholder="$t('prix')"
          v-model="offer.prix_offert"
          prepend-icon="mdi-currency-usd"
          :rules="prixRules"
          :suffix="$t('DZD')"
        ></v-text-field>
        <v-textarea
          clearable
          auto-grow
          dense
          clear-icon="mdi-close-circle"
          :label="$t('description')"
          prepend-icon="mdi-note"
          v-model="offer.note"
        ></v-textarea>
        <v-col cols="12">
          <filepond-component
            v-show="!has_offer"
            @filePondItemUploaded="demandImageUploaded($event)"
            @filePondItemDeleted="demandImageDeleted($event)"
          />
          <v-col v-show="has_offer" md="8" lg="6" xl="6" cols="12">
            <v-carousel height="300" v-if="offer.images.length > 0">
              <v-carousel-item
                v-for="(image, i) in offer.images"
                :key="i"
                :src="image.imageURL"
              ></v-carousel-item>
            </v-carousel>
          </v-col>
        </v-col>
        <v-btn
          dense
          fa-flip-horizontal
          rounded
          color="success"
          :disabled="disabled"
          @click="SubmitOffer()"
        >
          {{ $t("responde") }}
        </v-btn>
        <v-dialog v-if="offer.id" v-model="delete_dialog" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              dense
              fa-flip-horizontal
              rounded
              text
              color="red"
              :disabled="!disabled"
              v-bind="attrs"
              v-on="on"
            >
              {{ $t("remove_offer") }}
            </v-btn>
          </template>

          <v-card>
            <v-card-title dark class="text-h7 red darken-3 justify-center">
              {{ $t("are_you_sur") }}
            </v-card-title>

            <v-card-text> {{ $t("this_is_not_reversible") }}</v-card-text>
            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-2" text @click="retirerOffer">
                {{ $t("yes_delete") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-expansion-panel-content>
    </v-form>
  </div>
</template>
<script>
import { HTTP } from "../http-constants";
export default {
  props: ["demande_id", "user_id"],
  data: () => ({
    wilayaRules: [(v) => !!v || "required"],
    etatRules: [(v) => !!v || "required"],
    prixRules: [(v) => !!v || "required"],

    disabled: false,
    delete_dialog: false,
    offer: {
      id: "",
      wilaya_id: "", //this.$store.state.auth.user.wilaya_id,
      etat_id: "",
      prix_offert: "",
      note: "",
      images: [],
      url: "",
    },
    has_offer: false,
    dialog: false,
  }),
  computed: {
    wilayas() {
      return this.$store.state.wilayas;
    },
    etats() {
      return this.$store.state.etats;
    },
    auth() {
      return this.$store.state.auth.authenticated;
    },
  },
  methods: {
    getName() {
      if (this.$i18n.locale == "fr") return "nom_fr";
      else return "nom_ar";
    },

    //Filepond Image
    demandImageUploaded(e) {
      this.offer.images.push(e);
    },
    demandImageDeleted(e) {
      console.log(e);
      var index = this.offer.images.indexOf(e);
      this.offer.images.splice(index, 1);
    },

    getMyOffer() {
      HTTP.get("api/reponse/" + this.demande_id)
        .then((response) => {
          if (response.status == 200) {
            let offer = response.data.reponse;
            this.offer.id = offer.id;
            this.offer.prix_offert = offer.prix_offert;
            this.offer.wilaya_id = offer.wilaya_id;
            this.offer.etat_id = offer.etat_id;
            this.offer.note = offer.note;
            // console.log(response.data.image)
            this.offer.images = response.data.images;
            this.disabled = true;
            this.has_offer = true;
          }
        })
        .catch(() => {
          return ["no data found"];
        });
    },
    SubmitOffer() {
      if (!this.$refs.form.validate()) {
        return;
      } else {
        if (this.auth) {
          let formData = new FormData();
          formData.append("demande_id", this.demande_id);
          formData.append("prix_offert", this.offer.prix_offert);
          formData.append("wilaya_id", this.offer.wilaya_id);
          formData.append("etat_id", this.offer.etat_id);
          formData.append("note", this.offer.note);
          formData.append("images", this.offer.images);
          // debugger
          HTTP.post("api/demande/" + this.demande_id + "/offer", formData)
            .then((response) => {
              if (response.status == 200) {
                let offer = response.data.reponse;
                this.offer.id = offer.id;
                this.offer.prix_offert = offer.prix_offert;
                this.offer.wilaya_id = offer.wilaya_id;
                this.offer.etat_id = offer.etat_id;
                this.offer.note = offer.note;
                this.offer.images = response.data.images;
                this.disabled = true;
                this.has_offer = true;
                this.disabled = true;
                this.$emit("offer_responded");
                this.$toasted.success(this.$t("offer_created_success"), {
                  theme: "bubble",
                  position: "bottom-center",
                  duration: 3000,
                });
                this.has_offer = true;
              }
            })
            .catch(() => {
              this.$toasted.error(this.$t("error"), {
                theme: "bubble",
                position: "bottom-center",
                duration: 3000,
              });
            });
        } else {
          this.$toasted.error(this.$t("connect"), {
            theme: "bubble",
            position: "bottom-center",
            duration: 3000,
          });
        }
      }
    },
    retirerOffer() {
      HTTP.delete("api/reponse/" + this.offer.id)
        .then((response) => {
          if (response.status == 200) {
            this.delete_dialog = false;
            this.offer = {
              id: "",
              wilaya_id: "", //this.$store.state.auth.user.wilaya_id,
              etat_id: "",
              prix_offert: "",
              note: "",
              images: [],
              url: "",
            };
            this.disabled = false;
            this.has_offer = false;
            this.$emit("remove_offer");
            this.$toasted.success(this.$t("offer_deleted_success"), {
              theme: "bubble",
              position: "bottom-center",
              duration: 3000,
            });
          }
        })
        .catch((error) => {
          return [error];
        });
    },
  },
  created() {
    this.getMyOffer();
  },
};
</script>

