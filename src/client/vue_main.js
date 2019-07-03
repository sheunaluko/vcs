
Vue.component('card' , { 
    props: [ 'title' , 'text' ], 
    template : '<div> <h1> {{title}} </h1> <span> {{ text }} </span> </div>'
})


var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})


var app2 = new Vue({
  el: '#app-2',
  data: {
      message: 'You loaded this page on ' + new Date().toLocaleString(), 
      seen  : false 
      
  },
 methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }    
})

var app4 = new Vue({
  el: '#app-4',
  data: {
      todos: [
	  { text: 'Learn JavaScript' },
	  { text: 'Learn Vue' },
	  { text: 'Build something awesome' }
      ],
      cards: [
	  { title : "First" , text : "im a card" } 
      ]
  },
    methods : { 
	foo : function () { 
	    console.log("!")
	    this.cards.push( {title : "blah" , text : "!!" } ) 
	}
    }
    
    
})
