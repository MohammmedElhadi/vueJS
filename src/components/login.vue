<template>
  <div>
    <v-dialog v-model="dialog" max-width="800px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn text class="my-2" block v-bind="attrs" right v-on="on" outlined>
          {{$t('login')}}
        </v-btn>
      </template>
      <v-card>
        <v-form ref="form" class="mx-2" lazy-validation>
          <v-card-title>{{$t('login')}}</v-card-title>
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
            <v-btn color="success mx-10" @click.prevent="login">
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
    phoneRules: [
      (v) => !!v || "",
      (v) => /^\d+$/.test(v) || "",
      // (v) => !!v || "Phone is required",
      // (v) => /^\d+$/.test(v) || "Phone must be a number",
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
        HTTP.get("/sanctum/csrf-cookie").then(() => {
          console.log("sanctum/csrf-cookie");
          HTTP.post("api/login", this.user)
            .then((response) => {
              if (response.status == 200) {
                this.$store.dispatch("auth/login");
                this.dialog = false;
                this.$emit("RefreshUser");
                this.$toasted.info("Bienvenue ", {
                  theme: "bubble",
                  position: "top-center",
                  duration: 5000,
                  keepOnHover: true,
                });
                
                this.$router.go()
              }
            })
            .catch(() => {
              this.$toasted.info(
                "Le numéro de tel ou le mot de pass sont eronné ",
                {
                  theme: "bubble",
                  position: "top-center",
                  duration: 5000,
                  block: true,
                  keepOnHover: true,
                }
              );
            })
            .finally();
        });
      }
      
    },
  },
};
</script>

<style scoped>
</style>
