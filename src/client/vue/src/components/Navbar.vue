<template>
    <nav>            
        <v-toolbar app class="grey lighten-2 " > 

            <v-toolbar-side-icon  color="" @click="drawer = !drawer"></v-toolbar-side-icon>


            <v-toolbar-title class="text-uppercase">
                <span class="font-weight-light">Voice Control</span>
                <span> System   </span>
            </v-toolbar-title>


            <v-spacer /> 

            <v-progress-circular class="ml-2"
              :rotate="90"
              :value="value"
              color="blue">
            </v-progress-circular>



         </v-toolbar>

        <v-navigation-drawer v-model="drawer" app dark >
            <v-list>
                <v-list-tile v-for="link in nav_links" :key="link.text" router :to="link.route">
                    <v-list-tile-action>
                        <v-icon left class="white--text">{{link.icon}}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title class="white--text" >
                            {{link.text}}
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>


    </nav>

</template>


<script>

window.ui_state_audio_value = 30 

export default {
    name : 'Nav' , 
    data() { 
        return {
            drawer : false ,
            value  : window.ui_state_audio_value,  
            nav_links : [ 
                { icon : 'dashboard' , text: "Dashboard" , route: '/'},
                { icon : 'folder' ,    text: "Projects" ,  route: '/projects'},
                { icon : 'person' , text: "Team" , route: '/team'},
]
        }
    }
}
</script>
