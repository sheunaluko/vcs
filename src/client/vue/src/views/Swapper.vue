<template>
  <div id="swapper2">
    <component :is="routedComponent"></component>
  </div>
</template>

<script>
 
 /* eslint-disable */ 
 
 import javascript_echo from "../components/vcs_ui/javascript_echo";
 import review_logs     from "../components/vcs_ui/review_logs";
 
 import home from "./Home"
 


 var swapper_interfaces = {
     home, javascript_echo , review_logs

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
