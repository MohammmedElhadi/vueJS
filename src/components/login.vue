<template>
  <div>
    <v-dialog v-model="dialog" 
      max-width="800px"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
      
      >
      
      <template v-slot:activator="{ on, attrs }">
        <v-btn text class="my-2" block v-bind="attrs" right v-on="on" outlined>
          {{$t('login')}}
        </v-btn>
      </template>
      <v-card>
        <v-form ref="form" class="mx-2" lazy-validation>
          <v-card-title>{{$t('login')}}
             <v-spacer />
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row class="justify-center">
              <v-col cols="10">
                <!-- phone -->
                <v-text-field
                  prepend-icon="mdi-phone"
                  :label="$t('tel')"
                  hide-details="auto"
                  :rules="phoneRules"
                  v-model="user.phone"
                ></v-text-field>
              </v-col>
              <v-col cols="10">
                <v-text-field
                  ref="ssss"
                  :rules="passRules"
                  type="password"
                  :label="$t('password')"
                  prepend-icon="mdi-lock"
                  hide-details="auto"
                  v-model="user.password"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="justify-center">
            <v-progress-circular
                 v-if="loading"
                 class="mx-10"
                indeterminate
                color="success"
              ></v-progress-circular>
            <v-btn v-else color="success mx-10" @click.prevent="login">
              {{$t('login')}}
            </v-btn>

            <v-spacer />
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { HTTP } from "../http-constants";

export default {

  name: "login",
  data: () => ({
    loading : false,
    phoneRules: [
      (v) => !!v || "",
      (v) => 9 <= v.length && v.length<= 10 || "",
      (v) => /^\d+$/.test(v) || "",
    ],
    // passRules: [(v) => !!v || "password is required"],
    passRules: [(v) => !!v || ""],
    user: {
      phone: "",
      password: "",
    },
    dialog: false,
  }),
  computed: {},
  methods: {
    login() {
      if (this.$refs.form.validate()) {
        this.loading= true
        HTTP.get("/sanctum/csrf-cookie").then(() => {
          console.log("sanctum/csrf-cookie");
          HTTP.post("api/login", this.user)
            .then((response) => {
              if (response.status == 200) {
                this.$store.dispatch("auth/login");
                this.dialog = false;
                this.$emit("RefreshUser");
               setTimeout(() => {
                  this.$router.go()
               }, 2000);
              }
            })
            .catch((error) => {
              this.loading= false
              let message = error.response.data.message;
              this.$toasted.error(this.$t(message)
               ,
                {
                  theme: "bubble",
                  position: "top-center",
                  duration: 3000,
                  keepOnHover: true,
                }
              );
            })
            .finally(()=>{
                this.loading= false;
            });
        });

      }
      
    },
  },
};
</script>

<style scoped>
</style>
