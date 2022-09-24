<template>
    <div>
    <file-pond
      name="file"
      ref="pond"
      :label-idle="$t('put_images_here')"
      v-bind:allow-multiple="true"
      v-bind:server="server"
    />
    </div>
</template>

<script>
// Import Vue FilePond && css
import vueFilePond from "vue-filepond";

// // Import plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

// Import styles
import 'filepond/dist/filepond.min.css';
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import axios from 'axios';
axios.defaults.withCredentials = true;

// Create component
const FilePond = vueFilePond(
        FilePondPluginFileValidateType,
        FilePondPluginImagePreview
    );



export default {
  props: ['myFiles'],

  data: function () {
    return {
      initFiles: [], 
      server: {
          process: (fieldName, file, metadata, load, error, progress, abort) => {
              const formData = new FormData();
              const thisReference = this;
              formData.append(fieldName, file, file.name);
              const request = new XMLHttpRequest();
              // request.open('POST', 'http://auto_parts.local:8080/api/upload');
              request.open('POST', 'http://safyauto.com'+'/api/upload');
              request.withCredentials = true;
              request.setRequestHeader("Accept", "application/json");
              // Should call the progress method to update the progress to 100% before calling load
              // Setting computable to false switches the loading indicator to infinite mode
              request.upload.onprogress = (e) => {
                  progress(e.lengthComputable, e.loaded, e.total);
              };

              // Should call the load method when done and pass the returned server file id
              // this server file id is then used later on when reverting or restoring a file
              // so your server knows which file to return without exposing that info to the client
              request.onload = function () {
                  if (request.status >= 200 && request.status < 300) {
                      thisReference.$emit('filePondItemUploaded', request.responseText);
                      // console.log(request.responseText)
                      load(request.responseText);
                  } else {
                      // Can call the error method if something is wrong, should exit after
                      error('oh no');
                  }
              };
              request.send(formData);
              // Should expose an abort method so the request can be cancelled
              return {
                  abort: () => {
                      // This function is entered if the user has tapped the cancel button
                      request.abort();

                      // Let FilePond know the request has been cancelled
                      abort();
                  },
              };
          },
          revert: (uniqueFileId, load, error) => {
              const thisReference = this
              thisReference.$emit('filePondItemDeleted', uniqueFileId);
              // Can call the error method if something is wrong, should exit after
              error('oh my goodness');
              // Should call the load method when done, no parameters required
              load();
          },
    },


    };
  },
  created(){
    if(this.myFiles){
      this.initFiles = [{
        source: this.myFiles,
      }]
    }
  },
  methods: {
    
  },
  components: {
    FilePond,
  },
};
</script>
