<template>
  <v-card class="mx-auto" width="800">
    <v-card-title >
      {{$t('notifications')}}
      <v-spacer></v-spacer>
    </v-card-title>
    <v-divider></v-divider>
    <v-virtual-scroll :items="notifications" :item-height="50" height="300">
      <template v-slot:default="{ item }">
        <v-list-item>
          <v-list-item-avatar>
                            <v-avatar
                                color="purple whiten-3"
                                size="56"
                                class="white--text"
                            >
                                T
                            </v-avatar>
                        </v-list-item-avatar>

          <v-list-item-content @click="()=>{
                $router.replace({ name: 'demande', params: { id: item.demande.id }} );
              }">
            <v-list-item-title
              >Demande {{ item.demande.id }} qui conserne
              {{ item.demande.types[0].nom_fr }}</v-list-item-title
            >
          </v-list-item-content>

          <v-list-item-action >
            <v-btn depressed fab text small>
                <v-icon small color="orange darken-4" right>
                  mdi-open-in-new
                </v-icon>
              
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </v-card>
</template>
<script>
export default {
  props: ["notifications"],

  created() {},
  computed: {
    items() {
      return this.notifications;
    },
  },
};
</script>
