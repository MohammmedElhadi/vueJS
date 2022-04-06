<template>
  <v-card class="mx-auto" width="800">
    <v-card-title>
      {{ $t("notifications") }}
      <v-spacer></v-spacer>
    </v-card-title>
    <v-divider></v-divider>
    <v-virtual-scroll :items="items" :item-height="50" height="300">
      <template v-slot:default="{ item }">
        <v-list-item @click="getNotification(item)">
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
              >{{
                item.type == "App\\Notifications\\ReponseNotification"
                  ? $t("offer_demand") +
                    item.data.demande.id +
                    " , " +
                    $t("wilaya") +
                    " " +
                    $store.state.wilayas.find(
                      (itemf) => itemf.id == item.data.reponse.wilaya_id
                    ).name
                  : $t("conserne_demand_from") +
                    $store.state.wilayas.find(
                      (itemf) => itemf.id == item.data.demande.wilaya_id
                    ).name
              }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </v-card>
</template>
<script>
import { HTTP } from "../http-constants";
export default {
  props: ["notifications"],
  created() {},
  computed: {
    items() {
      return this.notifications.notifications;
    },
  },
  methods: {
    getNotification(item) {
      {
        HTTP.get("api/notification/" + item.id).then((response) => {
          if(response.status == 200){
            var index = this.notifications.notifications.indexOf(item);
            this.notifications.notifications.splice(index, 1);
            this.$emit('markNotificationAsRead')

          }
        });
        this.$router.replace({
          name: "demande",
          params: { id: item.data.demande.id },
        });
      }
    },
  },
};
</script>
