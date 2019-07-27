<template>
    <div id="review_logs" class="white--text ">

	<span class="display-3 font-italic font-weight-thin">Log Reviewer</span> <br> 

	<template v-if="state.status == 'selecting'">
	    <span class="display-1 font-italic font-weight-thin">Select Log: </span>	    
	    
	    <v-container grid-list-lg fluid class="mx-0">
		<v-layout row wrap  >
		    <v-flex xs12 sm6 md4 lg3 v-for="item in state.logs" :key="item.name">
			<v-hover>
			    <v-card
				slot-scope="{ hover }"
					    :class="`text-xs-center ${hover ? 'blue' : 'grey' } white--text elevation-${hover ? 12 : 2}`">
				<v-card-text>
				    <div class="subheading font-weight-bold">{{item.name}} </div>
				</v-card-text>
			    </v-card>
			</v-hover>
		    </v-flex>
		</v-layout>
	    </v-container>
	</template>
	<template v-else>
	    <span class="display-1 font-weight-thin">Reviewing: {{state.current}}  </span>	    
	    
	    <v-container grid-list-lg fluid class="mx-0">
		<v-layout row wrap  >
		    <v-flex xs12 sm6 md4 lg3 v-for="item in state.entries[state.current]" :key="item.t">
			<v-hover>
			    <v-card
				slot-scope="{ hover }"
				:class="`text-xs-center ${hover ? 'blue' : 'grey' } white--text elevation-${hover ? 12 : 2}`">
				<v-card-text>
				    <div class="subheading font-weight-bold">{{item.t}}</div>
				    <div class=""> {{item.text}}</div>
				</v-card-text>
			    </v-card>
			</v-hover>
		    </v-flex>
		</v-layout>
	    </v-container>
	</template>

    </div>
</template>


<script>
 
 export default {
     data () {
	 
	 return {
	     state: {
		 entries : {}  ,
		 logs    : [ ] , 
		 status  : "selecting" ,
		 current : ""
	     }
	 }
     } ,

     mounted () {

     }

 }
</script>
