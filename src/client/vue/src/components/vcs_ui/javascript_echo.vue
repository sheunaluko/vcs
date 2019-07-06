<template>
  <div id="javascript_echo" class="white--text ">

    <span class="display-3 font-italic font-weight-thin">ECHO COMMAND</span>  

    <v-container grid-list-lg fluid class="mx-0"> 
      <v-layout row wrap  >
        <v-flex xs12 sm6 md4 lg3 v-for="item in state.items" :key="item.time">
          <v-hover> 
            <v-card 
                    slot-scope="{ hover }"
                    :class="`text-xs-center ${hover ? 'blue' : 'grey' } white--text elevation-${hover ? 12 : 2}`"
              > 
              <v-card-text>
                <div class="subheading font-weight-bold">{{item.time}}</div>
                <div class=""> {{item.text}}</div>
              </v-card-text>
            </v-card> 
          </v-hover>
        </v-flex>
      </v-layout>
    </v-container>
    
  
  
  </div>
</template> 


<script> 
  export default {
    data () {
      return { 
        state: { 
          items : [
          ]
        }
      }
    } , 

    mounted () { 
      
    }

  }
</script>