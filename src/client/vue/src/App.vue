<template>
  <v-app class="grey darken-2">
    <Navbar />
    <v-content class="mx-4 mb-4 mt-4">
      <Swapper id="swapper"></Swapper> 
    </v-content>
    <v-footer app 
      height=1
      color="blue"
    ></v-footer>
  </v-app>
</template>

<script>

import Navbar from '@/components/Navbar'
import Swapper from '@/views/Swapper'

window.components = { 
  Navbar, 
}

export default {
  name: 'App',
  components: { Navbar , Swapper} , 
  data () {
    return {
      //
    }
  }
}
</script>

