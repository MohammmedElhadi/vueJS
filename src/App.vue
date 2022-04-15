<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped :right="$vuetify.rtl">
      <v-list dense>
        <v-list-item link :to="{ name: 'profile' }" v-if="auth">
          <!-- <v-list-item  v-if="auth"> -->
          <v-list-item-action>
            <v-avatar color="indigo">
              <v-icon dark> mdi-account-circle </v-icon>
            </v-avatar>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ logged_user.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ logged_user.phone }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name: 'accueil' }">
          <v-list-item-action>
            <v-icon>mdi-home </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ $t("home") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link  :to="{name: 'demandes-filter',
                                 params: { filter: '0', id: 'type' },
                }">
          <!-- <v-list-item  v-if="auth"> -->
         <v-list-item-action>
            <v-icon>mdi-magnify</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ $t("Search_page") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- <v-list-item link :to="{ name: 'users' }">
          <v-list-item-action>
            <v-icon>mdi-home </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ $t("Users") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
        <v-list-item
          v-if="auth"
          link
          :to="{ name: 'my-demandes', params: { id: logged_user.id } }"
        >
          <v-list-item-action>
            <v-icon>mdi-file-document-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ $t("my_demands") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="auth" link :to="{ name: 'demandes-vues' }">
          <v-list-item-action>
            <v-icon>mdi-file-eye</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ $t("seen_demands") }} </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="auth" link :to="{ name: 'demandes-aime' }">
          <v-list-item-action>
            <v-icon>mdi-bookmark</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ $t("loved_demands") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="auth" link :to="{ name: 'demandes-repondue' }">
          <v-list-item-action>
            <v-icon>mdi-check</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ $t("responded_demands") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="auth" @click="logout">
          <v-list-item-action>
            <v-btn v-if="auth" icon><v-icon>mdi-logout</v-icon></v-btn>
          </v-list-item-action>
          <v-list-item-title>{{ $t("disconnect") }}</v-list-item-title>
        </v-list-item>
        <v-list-item v-else>
          <v-list-item-title>
            <login @RefreshUser="RefreshU" />
            <register @RefreshUser="RefreshU" />
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-switch
            v-model="$vuetify.theme.dark"
            :label="$t('dark_mode')"
          ></v-switch>

          <!-- Language  -->
          <v-menu v-model="languageMenu" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="text-capitalize"
                v-bind="attrs"
                v-on="on"
                text
                small
              >
                <v-icon left>mdi-earth</v-icon>
                {{ activeLang }}
                <v-icon small right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item
                v-for="(lang, index) in langs"
                :key="index"
                @click="handleMenuItemClick(lang)"
              >
                <v-list-item-title>{{ lang.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left clipped-right>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

       <v-img
          class="mx-2"
          :src="logo"
          max-height="80"
          max-width="80"
          contain
        ></v-img>
      <v-spacer />
      
      <v-spacer />
          <v-btn
          small 
          color="success" 
          elevation="6" 
          fab
           @click="demande_dialog = true">
        <v-icon> mdi-plus </v-icon>

      </v-btn>
     
      <v-menu :key="'a'+notificationKey"     :nudge-width="200" offset-x left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="mx-3" v-bind="attrs" v-on="on" icon>
            <v-badge
              overlap
              :content="notificationKey"
              :value="notificationKey"
              color="red"
            >
              <v-icon>mdi-bell</v-icon>
            </v-badge>
          </v-btn>
        </template>
        <notifications
          :notifications="notifications"
          :key="notificationKey"
          @markNotificationAsRead="markNotificationAsRead()"
        ></notifications>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- <span >+{{stats.demandes}} demandes</span> -->
      <demand-modal
        :demande_dialog="demande_dialog"
        @closeDemandeDiaog="demande_dialog = false"
      />
    </v-footer>
  </v-app>
</template>

<script>
import { HTTP } from "./http-constants";
import demandModal from "./components/demandModal.vue";
import login from "./components/login.vue";
import register from "./components/register.vue";
import Notifications from "./components/notifications.vue";
import { mapActions } from "vuex";
// import { djs } from "../plugins/dayjs";

export default {
  name: "App",
  components: { demandModal, Notifications, login, register },
  props: {
    Notificationssource: String,
  },
  data: () => ({
    stats : [],
    langs: [
      { title: "Français", abr: "fr", rtl: false },
      { title: "العربية", abr: "ar", rtl: true },
    ],
    logo_dark: require("./resources/logo_dark.png"),
    logo_light: require("./resources/logo_light.png"),
    activeLang: "Français",
    demande_dialog: false,
    languageMenu: false,
    drawer: null,
    notifications: null,
    notificationKey: 0,
    menu: false,
  }),
  mounted() {
    this.$store.dispatch("loadWilayas");
    this.$store.dispatch("loadEtats");
  },
  methods: {
    markNotificationAsRead() {
      console.log('sdfsdfsdf');
     this.notificationKey = this.notificationKey==0 ? (this.notificationKey-1) : this.notificationKey;
    },
    getStats(){
      HTTP.get('api/stat').then((response)=>{
       this.stats = response.data 
      })
    },
    ...mapActions({
      singOut: "auth/logout",
    }),
    getNotifications() {
      HTTP.get("api/notification")
        .then((response) => {
          this.notifications = response.data;
          if (this.notifications)
            this.notificationKey = this.notifications.count;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async logout() {
      await HTTP.post("api/logout").then(() => {
        this.singOut();
        this.$router.push({ name: "accueil" });
        this.$router.go();
      });
    },
    RefreshU() {
      this.logged_user = this.$store.state.auth.user;
      this.auth = this.$store.state.auth.authenticated;
      this.$i18n.locale = this.user.lang;
    },
    initLanguage() {
      if (this.auth) {
        this.$i18n.locale = this.user.lang;
      }
      let lang = this.langs.find((item) => item.abr == this.$i18n.locale);
      this.activeLang = lang.title;
      this.$vuetify.rtl = lang.rtl;
      // djs.locale(this.$i18n.locale) 
    },
    handleMenuItemClick(lang) {
      HTTP.post("api/user/lang", lang).then((response) => {
        console.log(response.data);
      });
      this.activeLang = lang.title;
      this.$i18n.locale = lang.abr;
      this.$vuetify.rtl = lang.rtl;
    },

    async initListners() {
      this.$echo
        .private("demands_channel_" + this.logged_user.id)
        .listen("NewDemandeAdded", (payload) => {
          this.notifications.notifications.unshift(payload.notification);
          this.notificationKey += 1;
          this.$toasted.success(this.$t('demande_added'), {
            theme: "bubble",
            position: "bottom-center",
            duration: 5000,
          });
          var audio = new Audio(require("./audio/reponse_notification.wav")); // path to file
          audio.play();
        });
      this.$echo
        .private("response_for_" + this.logged_user.id)
        .listen("NewReponseAdded", (payload) => {
          this.notifications.notifications.unshift(payload.notification);
          this.notificationKey += 1;
          this.$toasted.success(
            this.$t('offer_added')+
              payload.notification.data.demande.id,
            {
              theme: "bubble",
              position: "bottom-right",
              duration: 5000,
            }
          );

          var audio = new Audio(require("./audio/reponse_notification.wav")); // path to file
          audio.play();
        });
    }, 
  },
  computed: {
    auth() {
      return this.$store.state.auth.authenticated;
    },
    logged_user() {
      return this.$store.state.auth.user;
    },
    logo(){
      return this.$vuetify.theme.dark ? this.logo_dark : this.logo_light;
    }
  },

  created() {
    
    this.initListners();
    if (this.auth) {
      this.getNotifications();
      let lang = this.langs.find(
        (item) => item.abr == this.$store.state.auth.user.lang
      );
      this.$i18n.locale = lang.abr;
      this.activeLang = lang.title;
      this.$vuetify.rtl = lang.rtl;
    } else this.initLanguage();
    this.$store.dispatch("auth/login");
    this.$vuetify.theme.dark = true;
  },
  beforeCreate() {
    if (this.auth) {
      this.$i18n.locale = this.$store.state.auth.user.lang;
      // this.$vuetify.rtl = lang.rtl;
    }
  },
  updated() {},
  destroyed() {
    this.singOut();
  },
};
</script>
 <style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Tajawal&display=swap");

.application {
  font-family: "Questrial";
}
</style>
