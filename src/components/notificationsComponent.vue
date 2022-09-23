<template>
  <div>
    <v-menu :nudge-width="200" offset-x left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="mx-3" v-bind="attrs" v-on="on" icon>
          <v-badge
            :content="notifications.length"
            :value="notifications.length"
            color="red"
          >
            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-card class="mx-auto" width="800">
        <v-card-title>
          {{ $t("notifications-new") }}
          <v-spacer></v-spacer>
        </v-card-title>
        <v-divider></v-divider>
        <v-list-item-group v-model="read" active-class="green--text" multiple>
          <v-virtual-scroll :items="items" :item-height="50" height="300">
            <template v-slot:default="{ item }">
              <v-list-item
                :key="item.data.id"
                @click="getNotification(item)"
                color="success"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-avatar>
                    <v-avatar
                      :color="
                        item.type == 'App\\Notifications\\ReponseNotification'
                          ? 'purple whiten-3'
                          : 'yellow whiten-3'
                      "
                      size="56"
                      :class="
                        item.type == 'App\\Notifications\\ReponseNotification'
                          ? 'white--text'
                          : 'black--text'
                      "
                      item.type
                    >
                      {{
                        item.type == "App\\Notifications\\ReponseNotification"
                          ? "R"
                          : "D"
                      }}
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title
                      v-resize-text="{
                        ratio: 1,
                        minFontSize: '14px',
                        maxFontSize: '14px',
                      }"
                      >{{ notification_title(item) }}</v-list-item-title
                    >
                    <v-list-item-subtitle
                      class="text--primary"
                      v-text="notification_body(item)"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon v-if="!active" color="grey lighten-1">
                      mdi-circle-outline
                    </v-icon>
                    <v-icon v-else color="grey lighten-1">
                      mdi-circle
                    </v-icon>
                  </v-list-item-action>
                </template>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-list-item-group>
      </v-card>
    </v-menu>
  </div>
</template>
<script>
import { HTTP } from "../http-constants";
export default {
  data: () => ({
    // read: [],
    notifications : []
  }),
  computed: {
    items() {
      return this.notifications.notifications;
    },
    read(){
        let read = this.items.filter((el) => {
          return el.read_at == null;
        })
        // .map(({ id }) => ({ id }));
        let readed = []
      for (let not in read) {
           readed.push(this.items.indexOf(read[not]));
          }
        return readed;
    }
  },
  methods: {
    getNotifications() {
      HTTP.get("api/notification")
        .then((response) => {
          this.notifications = response.data;
        })
        .catch(() => {});
    },
    getRead() {
      console.log("this.items")
      console.log(this.items)
      let notis = this.items
        .filter((el) => {
          return el.read_at != null;
        })
        .map(({ id }) => ({ id }));
      for (let not in notis) {
        this.read.push(this.items.indexOf(notis[not]));
      }
      
    },
    notification_title(item) {
      return item.type == "App\\Notifications\\ReponseNotification"
        ? this.$t("new_offer")
        : this.$t("new_demand");
    },
    notification_body(item) {
      return item.type == "App\\Notifications\\ReponseNotification"
        ? this.$t("some_one_responded_to_your_demand") +
            item.data.demande.id +
            " , " +
            this.$t("wilaya") +
            " " +
            this.$store.state.wilayas.find(
              (itemf) => itemf.id == item.data.reponse.wilaya_id
            ).name
        : this.$t("new_demand") +
            this.$store.state.wilayas.find(
              (itemf) => itemf.id == item.data.demande.wilaya_id
            ).name;
    },
    getNotification(item) {
      {
        HTTP.get("api/notification/" + item.id).then((response) => {
          if (response.status == 200) {
            // var index = this.notifications.notifications.indexOf(item);
            // this.notifications.notifications.splice(index, 1);
            this.$emit("markNotificationAsRead");
          }
        });
        this.$router.replace({
          name: "demande",
          params: { id: item.data.demande.id },
        });
      }
    },
  },
  created() {
    if(this.$store.state.wilayas.length === 0)
          this.$store.dispatch("loadWilayas");
    this.getNotifications();
    },
    mounted(){
            if(this.items != null){
                this.getRead()
            }
    },
    updated(){  

    }
    
};
</script>
