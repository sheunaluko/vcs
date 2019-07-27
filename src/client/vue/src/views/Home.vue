<template>
  <div id="home" class="home white--text ">

    <span class="display-3 font-italic font-weight-thin">Go Big,</span> 
    <span class='display-3 font-italic font-weight-thin'> Don't Go Home</span>

    <v-container grid-list-lg fluid class="mx-0"> 
      <v-layout row wrap  >
        <v-flex xs12 sm6 md4 lg3 v-for="item in items" :key="item.title">
          <v-hover> 
            <v-card 
                    slot-scope="{ hover }"
                    :class="`text-xs-center ${hover ? 'blue' : 'grey' } white--text elevation-${hover ? 12 : 2}`"
              > 
              <v-card-text>
                <div class="subheading font-weight-bold">{{item.title}}</div>
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
        items : [
        ]
      }
    } , 

    mounted () { 
      for (var i =0 ; i < 100 ; i ++ ) { 
        //this.items.push( { title : "Thing "+ i , text : "This is text " + i })
      }
    }

  }
</script>
