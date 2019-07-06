<template>
  <div id="swapper2">
    <component :is="routedComponent"></component>
  </div>
</template>

<script>
import javascript_echo from "../components/vcs_ui/javascript_echo";
import home from "./Home"


var swapper_interfaces = {
    javascript_echo , home  

};

if ( ! window.vcs ) { 
  window.vcs = { swapper_interfaces }
} else { 
  window.vcs.swapper_interfaces = swapper_interfaces 
}


export default {
  data() {
    return { current: "home" };
  },
  computed: {
    routedComponent() {
      return window.vcs.swapper_interfaces[this.current];
    }
  }
};
</script>