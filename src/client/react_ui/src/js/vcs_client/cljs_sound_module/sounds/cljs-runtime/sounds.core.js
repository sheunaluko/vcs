goog.provide('sounds.core');
goog.require('cljs.core');
goog.require('cljs.reader');
goog.require('sounds.midi_freq');
sounds.core.log = cljs.core.println;
sounds.core.root = (60);
sounds.core.alpha_to_midi_table = new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"c","c",-1763192079),(0),new cljs.core.Keyword(null,"d","d",1972142424),(2),new cljs.core.Keyword(null,"e","e",1381269198),(4),new cljs.core.Keyword(null,"f","f",-1597136552),(6),new cljs.core.Keyword(null,"g","g",1738089905),(8),new cljs.core.Keyword(null,"a","a",-2123407586),(10),new cljs.core.Keyword(null,"b","b",1482224470),(12)], null);
sounds.core.alpha_to_midi = (function sounds$core$alpha_to_midi(alpha){

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((2),cljs.core.count(alpha))){
var letter = cljs.core.first(alpha);
var octave = cljs.core.second(alpha);
return ((function (){var fexpr__6047 = cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(letter);
return (fexpr__6047.cljs$core$IFn$_invoke$arity$1 ? fexpr__6047.cljs$core$IFn$_invoke$arity$1(sounds.core.alpha_to_midi_table) : fexpr__6047.call(null,sounds.core.alpha_to_midi_table));
})() + ((12) * octave));
} else {
var letter = cljs.core.first(alpha);
var mod = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.second(alpha),"#"))?(1):((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.second(alpha),"b"))?(-1):null));
var octave = cljs.core.last(alpha);
return ((mod + (function (){var fexpr__6048 = cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(letter);
return (fexpr__6048.cljs$core$IFn$_invoke$arity$1 ? fexpr__6048.cljs$core$IFn$_invoke$arity$1(sounds.core.alpha_to_midi_table) : fexpr__6048.call(null,sounds.core.alpha_to_midi_table));
})()) + ((12) * octave));
}
});
sounds.core.midi_to_freq = (function sounds$core$midi_to_freq(midi){
var fexpr__6049 = cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(cljs.core.str.cljs$core$IFn$_invoke$arity$1(midi));
return (fexpr__6049.cljs$core$IFn$_invoke$arity$1 ? fexpr__6049.cljs$core$IFn$_invoke$arity$1(sounds.midi_freq.midi_to_freq) : fexpr__6049.call(null,sounds.midi_freq.midi_to_freq));
});
sounds.core.OSC = (function sounds$core$OSC(p__6050){
var map__6051 = p__6050;
var map__6051__$1 = (((((!((map__6051 == null))))?(((((map__6051.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__6051.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__6051):map__6051);
var type = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__6051__$1,new cljs.core.Keyword(null,"type","type",1174270348));
var freq = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__6051__$1,new cljs.core.Keyword(null,"freq","freq",-1855845278));
var gain = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__6051__$1,new cljs.core.Keyword(null,"gain","gain",1350925045));
return cljs.core.atom.cljs$core$IFn$_invoke$arity$1(new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),(function (){var or__4131__auto__ = type;
if(cljs.core.truth_(or__4131__auto__)){
return or__4131__auto__;
} else {
return "sine";
}
})(),new cljs.core.Keyword(null,"freq","freq",-1855845278),(cljs.core.truth_(freq)?((typeof freq === 'string')?sounds.core.midi_to_freq(sounds.core.alpha_to_midi(freq)):freq
):(440)
),new cljs.core.Keyword(null,"gain","gain",1350925045),(function (){var or__4131__auto__ = gain;
if(cljs.core.truth_(or__4131__auto__)){
return or__4131__auto__;
} else {
return 0.25;
}
})(),new cljs.core.Keyword(null,"default-dur","default-dur",640662375),(2000)], null));
});
sounds.core.a = sounds.midi_freq.midi_to_freq;
sounds.core.set_type = (function sounds$core$set_type(OSC,type){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(OSC,cljs.core.assoc,new cljs.core.Keyword(null,"type","type",1174270348),type);
});
sounds.core.set_freq = (function sounds$core$set_freq(OSC,freq){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(OSC,cljs.core.assoc,new cljs.core.Keyword(null,"freq","freq",-1855845278),freq);
});
sounds.core.set_gain = (function sounds$core$set_gain(OSC,gain){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(OSC,cljs.core.assoc,new cljs.core.Keyword(null,"gain","gain",1350925045),gain);
});
sounds.core.play_OSC = (function sounds$core$play_OSC(OSC){
var map__6053 = cljs.core.deref(OSC);
var map__6053__$1 = (((((!((map__6053 == null))))?(((((map__6053.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__6053.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__6053):map__6053);
var type = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__6053__$1,new cljs.core.Keyword(null,"type","type",1174270348));
var freq = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__6053__$1,new cljs.core.Keyword(null,"freq","freq",-1855845278));
var gain = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__6053__$1,new cljs.core.Keyword(null,"gain","gain",1350925045));
var sound = sounds.osc(type,freq,gain);
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(OSC,cljs.core.assoc,new cljs.core.Keyword(null,"instance","instance",-2121349050),sound);
});
sounds.core.stop_OSC = (function sounds$core$stop_OSC(OSC){
var temp__5718__auto__ = new cljs.core.Keyword(null,"instance","instance",-2121349050).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(OSC));
if(cljs.core.truth_(temp__5718__auto__)){
var instance = temp__5718__auto__;
instance.stop();

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(OSC,cljs.core.dissoc,new cljs.core.Keyword(null,"instance","instance",-2121349050));
} else {
return (sounds.core.log.cljs$core$IFn$_invoke$arity$1 ? sounds.core.log.cljs$core$IFn$_invoke$arity$1("OSC was not playing!") : sounds.core.log.call(null,"OSC was not playing!"));
}
});
sounds.core.play_stop = (function sounds$core$play_stop(OSC,dur){
sounds.core.play_OSC(OSC);

return setTimeout((function (){
return sounds.core.stop_OSC(OSC);
}),dur);
});
sounds.core.play_freq = (function sounds$core$play_freq(OSC,freq,dur){
sounds.core.set_freq(OSC,freq);

return sounds.core.play_stop(OSC,dur);
});
sounds.core.play_note = (function sounds$core$play_note(OSC,note,dur){
return sounds.core.play_freq(OSC,sounds.core.midi_to_freq(sounds.core.alpha_to_midi(note)),dur);
});
sounds.core._play_note = (function sounds$core$_play_note(note){
return sounds.core.play_note(sounds.core.OSC(cljs.core.PersistentArrayMap.EMPTY),note,(200));
});
sounds.core.scale_to_midi = (function sounds$core$scale_to_midi(note){

var arr = new cljs.core.PersistentVector(null, 9, 5, cljs.core.PersistentVector.EMPTY_NODE, [null,(0),(2),(4),(5),(7),(9),(11),(12)], null);
return cljs.core.nth.cljs$core$IFn$_invoke$arity$2(arr,note);
});
sounds.core.parse_note = (function sounds$core$parse_note(note){

var components = clojure.string.split.cljs$core$IFn$_invoke$arity$2(note,/\./);
var value = cljs.core.first(components);
var octave_shift = (((cljs.core.count(components) > (1)))?cljs.reader.read_string.cljs$core$IFn$_invoke$arity$1(cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.last(components))):(0)
);
var modifier = (((cljs.core.count(value) > (1)))?cljs.core.first(value):null
);
var modifier_offset = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("b",modifier))?(-1):((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("#",modifier))?(1):(0)
));
var key = cljs.reader.read_string.cljs$core$IFn$_invoke$arity$1((function (){var or__4131__auto__ = cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.last(value));
if(cljs.core.truth_(or__4131__auto__)){
return or__4131__auto__;
} else {
return (value.cljs$core$IFn$_invoke$arity$0 ? value.cljs$core$IFn$_invoke$arity$0() : value.call(null));
}
})());
var base_offset = sounds.core.scale_to_midi(key);
return ((base_offset + modifier_offset) + ((12) * octave_shift));
});
sounds.core.scales = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"pentatonic","pentatonic",1003535103),cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [(1),(2),(3),(5),(6)], null)),new cljs.core.Keyword(null,"minor-pentatonic","minor-pentatonic",2096817591),cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [(1),"b3",(4),(5),"b7"], null)),new cljs.core.Keyword(null,"minor","minor",-608536071),cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [(1),(2),"b3",(4),(5),"b6","b7"], null)),new cljs.core.Keyword(null,"harmonic-minor","harmonic-minor",-1692225039),cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [(1),(2),"b3",(4),(5),"b6",(7)], null))], null);
sounds.core.rand_scale = (function sounds$core$rand_scale(key){
var scale = (key.cljs$core$IFn$_invoke$arity$1 ? key.cljs$core$IFn$_invoke$arity$1(sounds.core.scales) : key.call(null,sounds.core.scales));
return cljs.core.rand_nth(scale);
});
sounds.core.interval = (function sounds$core$interval(fxn,int$){
return setInterval(fxn,int$);
});
sounds.core.play_notes = (function sounds$core$play_notes(var_args){
var args__4736__auto__ = [];
var len__4730__auto___6080 = arguments.length;
var i__4731__auto___6081 = (0);
while(true){
if((i__4731__auto___6081 < len__4730__auto___6080)){
args__4736__auto__.push((arguments[i__4731__auto___6081]));

var G__6082 = (i__4731__auto___6081 + (1));
i__4731__auto___6081 = G__6082;
continue;
} else {
}
break;
}

var argseq__4737__auto__ = ((((3) < args__4736__auto__.length))?(new cljs.core.IndexedSeq(args__4736__auto__.slice((3)),(0),null)):null);
return sounds.core.play_notes.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),argseq__4737__auto__);
});

sounds.core.play_notes.cljs$core$IFn$_invoke$arity$variadic = (function (OSC,notes,dur,p__6059){
var map__6060 = p__6059;
var map__6060__$1 = (((((!((map__6060 == null))))?(((((map__6060.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__6060.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__6060):map__6060);
var key = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__6060__$1,new cljs.core.Keyword(null,"key","key",-1516042587));
var base_note = (cljs.core.truth_(key)?sounds.core.alpha_to_midi(key):sounds.core.root
);
var seq__6062 = cljs.core.seq(notes);
var chunk__6063 = null;
var count__6064 = (0);
var i__6065 = (0);
while(true){
if((i__6065 < count__6064)){
var note = chunk__6063.cljs$core$IIndexed$_nth$arity$2(null,i__6065);
var midi_6083 = (base_note + sounds.core.parse_note(note));
var freq_6084 = sounds.core.midi_to_freq(midi_6083);
var new_OSC_6085 = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(OSC));
sounds.core.play_freq(new_OSC_6085,freq_6084,dur);


var G__6086 = seq__6062;
var G__6087 = chunk__6063;
var G__6088 = count__6064;
var G__6089 = (i__6065 + (1));
seq__6062 = G__6086;
chunk__6063 = G__6087;
count__6064 = G__6088;
i__6065 = G__6089;
continue;
} else {
var temp__5720__auto__ = cljs.core.seq(seq__6062);
if(temp__5720__auto__){
var seq__6062__$1 = temp__5720__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__6062__$1)){
var c__4550__auto__ = cljs.core.chunk_first(seq__6062__$1);
var G__6090 = cljs.core.chunk_rest(seq__6062__$1);
var G__6091 = c__4550__auto__;
var G__6092 = cljs.core.count(c__4550__auto__);
var G__6093 = (0);
seq__6062 = G__6090;
chunk__6063 = G__6091;
count__6064 = G__6092;
i__6065 = G__6093;
continue;
} else {
var note = cljs.core.first(seq__6062__$1);
var midi_6094 = (base_note + sounds.core.parse_note(note));
var freq_6095 = sounds.core.midi_to_freq(midi_6094);
var new_OSC_6096 = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(OSC));
sounds.core.play_freq(new_OSC_6096,freq_6095,dur);


var G__6097 = cljs.core.next(seq__6062__$1);
var G__6098 = null;
var G__6099 = (0);
var G__6100 = (0);
seq__6062 = G__6097;
chunk__6063 = G__6098;
count__6064 = G__6099;
i__6065 = G__6100;
continue;
}
} else {
return null;
}
}
break;
}
});

sounds.core.play_notes.cljs$lang$maxFixedArity = (3);

/** @this {Function} */
sounds.core.play_notes.cljs$lang$applyTo = (function (seq6055){
var G__6056 = cljs.core.first(seq6055);
var seq6055__$1 = cljs.core.next(seq6055);
var G__6057 = cljs.core.first(seq6055__$1);
var seq6055__$2 = cljs.core.next(seq6055__$1);
var G__6058 = cljs.core.first(seq6055__$2);
var seq6055__$3 = cljs.core.next(seq6055__$2);
var self__4717__auto__ = this;
return self__4717__auto__.cljs$core$IFn$_invoke$arity$variadic(G__6056,G__6057,G__6058,seq6055__$3);
});

sounds.core.play_notes_delay = (function sounds$core$play_notes_delay(var_args){
var args__4736__auto__ = [];
var len__4730__auto___6101 = arguments.length;
var i__4731__auto___6102 = (0);
while(true){
if((i__4731__auto___6102 < len__4730__auto___6101)){
args__4736__auto__.push((arguments[i__4731__auto___6102]));

var G__6103 = (i__4731__auto___6102 + (1));
i__4731__auto___6102 = G__6103;
continue;
} else {
}
break;
}

var argseq__4737__auto__ = ((((4) < args__4736__auto__.length))?(new cljs.core.IndexedSeq(args__4736__auto__.slice((4)),(0),null)):null);
return sounds.core.play_notes_delay.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),argseq__4737__auto__);
});

sounds.core.play_notes_delay.cljs$core$IFn$_invoke$arity$variadic = (function (osc,notes,dur,delay,p__6072){
var map__6073 = p__6072;
var map__6073__$1 = (((((!((map__6073 == null))))?(((((map__6073.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__6073.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__6073):map__6073);
var key = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__6073__$1,new cljs.core.Keyword(null,"key","key",-1516042587));
var num_notes = cljs.core.count(notes);
var delays = cljs.core.map.cljs$core$IFn$_invoke$arity$2(((function (num_notes,map__6073,map__6073__$1,key){
return (function (p1__6066_SHARP_){
return (delay * p1__6066_SHARP_);
});})(num_notes,map__6073,map__6073__$1,key))
,cljs.core.range.cljs$core$IFn$_invoke$arity$1(num_notes));
var n__4607__auto__ = num_notes;
var i = (0);
while(true){
if((i < n__4607__auto__)){
setTimeout(((function (i,n__4607__auto__,num_notes,delays,map__6073,map__6073__$1,key){
return (function (){
return sounds.core.play_notes.cljs$core$IFn$_invoke$arity$variadic(osc,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.nth.cljs$core$IFn$_invoke$arity$2(notes,i)], null),dur,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"key","key",-1516042587),key], 0));
});})(i,n__4607__auto__,num_notes,delays,map__6073,map__6073__$1,key))
,cljs.core.nth.cljs$core$IFn$_invoke$arity$2(delays,i));

var G__6104 = (i + (1));
i = G__6104;
continue;
} else {
return null;
}
break;
}
});

sounds.core.play_notes_delay.cljs$lang$maxFixedArity = (4);

/** @this {Function} */
sounds.core.play_notes_delay.cljs$lang$applyTo = (function (seq6067){
var G__6068 = cljs.core.first(seq6067);
var seq6067__$1 = cljs.core.next(seq6067);
var G__6069 = cljs.core.first(seq6067__$1);
var seq6067__$2 = cljs.core.next(seq6067__$1);
var G__6070 = cljs.core.first(seq6067__$2);
var seq6067__$3 = cljs.core.next(seq6067__$2);
var G__6071 = cljs.core.first(seq6067__$3);
var seq6067__$4 = cljs.core.next(seq6067__$3);
var self__4717__auto__ = this;
return self__4717__auto__.cljs$core$IFn$_invoke$arity$variadic(G__6068,G__6069,G__6070,G__6071,seq6067__$4);
});

sounds.core.feedback_key = "e5";
sounds.core.success = (function sounds$core$success(){
return sounds.core.play_notes.cljs$core$IFn$_invoke$arity$variadic(sounds.core.OSC(cljs.core.PersistentArrayMap.EMPTY),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["1","3"], null),(200),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"key","key",-1516042587),sounds.core.feedback_key], 0));
});
sounds.core.fifth = (function sounds$core$fifth(){
return sounds.core.play_notes.cljs$core$IFn$_invoke$arity$variadic(sounds.core.OSC(cljs.core.PersistentArrayMap.EMPTY),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["1","5"], null),(200),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"key","key",-1516042587),sounds.core.feedback_key], 0));
});
sounds.core.cadence = (function sounds$core$cadence(){
return sounds.core.play_notes_delay.cljs$core$IFn$_invoke$arity$variadic(sounds.core.OSC(cljs.core.PersistentArrayMap.EMPTY),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["1","5.-1"], null),(100),(100),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"key","key",-1516042587),sounds.core.feedback_key], 0));
});
sounds.core.continue$ = (function sounds$core$continue(){
return sounds.core.play_notes.cljs$core$IFn$_invoke$arity$variadic(sounds.core.OSC(cljs.core.PersistentArrayMap.EMPTY),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["5.-1"], null),(100),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"key","key",-1516042587),sounds.core.feedback_key], 0));
});
sounds.core.error = (function sounds$core$error(){
return sounds.core.play_notes.cljs$core$IFn$_invoke$arity$variadic(sounds.core.OSC(cljs.core.PersistentArrayMap.EMPTY),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["1","b3"], null),(200),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"key","key",-1516042587),sounds.core.feedback_key], 0));
});
sounds.core.ready_for_input = (function sounds$core$ready_for_input(){
return sounds.core.play_notes_delay.cljs$core$IFn$_invoke$arity$variadic(sounds.core.OSC(cljs.core.PersistentArrayMap.EMPTY),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["1","3"], null),(100),(100),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"key","key",-1516042587),sounds.core.feedback_key], 0));
});
sounds.core.unrecognized = (function sounds$core$unrecognized(){
return sounds.core.play_notes.cljs$core$IFn$_invoke$arity$variadic(sounds.core.OSC(cljs.core.PersistentArrayMap.EMPTY),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["1","b5"], null),(200),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"key","key",-1516042587),sounds.core.feedback_key], 0));
});
sounds.core.audio_feedback = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"success","success",1890645906),sounds.core.success,new cljs.core.Keyword(null,"continue","continue",-207346553),sounds.core.continue$,new cljs.core.Keyword(null,"error","error",-978969032),sounds.core.error,new cljs.core.Keyword(null,"ready-for-input","ready-for-input",1830756619),sounds.core.ready_for_input,new cljs.core.Keyword(null,"unrecognized","unrecognized",301694737),sounds.core.unrecognized], null);
sounds.core.make_melody = (function sounds$core$make_melody(num,tick_size,max_ticks,scale,key){
var melody = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentVector.EMPTY);
var elapsed = cljs.core.atom.cljs$core$IFn$_invoke$arity$1((0));
var delays = cljs.core.map.cljs$core$IFn$_invoke$arity$2(((function (melody,elapsed){
return (function (p1__6075_SHARP_){
return ((p1__6075_SHARP_ + (1)) * tick_size);
});})(melody,elapsed))
,cljs.core.range.cljs$core$IFn$_invoke$arity$1(max_ticks));
var notes = (((scale instanceof cljs.core.Keyword))?scale.cljs$core$IFn$_invoke$arity$1(sounds.core.scales):scale
);
var n__4607__auto___6105 = num;
var i_6106 = (0);
while(true){
if((i_6106 < n__4607__auto___6105)){
var next_delay_6107 = cljs.core.rand_nth(delays);
var total_delay_6108 = (next_delay_6107 + cljs.core.deref(elapsed));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(elapsed,((function (i_6106,next_delay_6107,total_delay_6108,n__4607__auto___6105,melody,elapsed,delays,notes){
return (function (current){
return (current + next_delay_6107);
});})(i_6106,next_delay_6107,total_delay_6108,n__4607__auto___6105,melody,elapsed,delays,notes))
);

cljs.core.print.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([total_delay_6108], 0));

setTimeout(((function (i_6106,next_delay_6107,total_delay_6108,n__4607__auto___6105,melody,elapsed,delays,notes){
return (function (){
return sounds.core.play_notes.cljs$core$IFn$_invoke$arity$variadic(sounds.core.OSC(cljs.core.PersistentArrayMap.EMPTY),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.rand_nth(notes)], null),(200),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"key","key",-1516042587),key], 0));
});})(i_6106,next_delay_6107,total_delay_6108,n__4607__auto___6105,melody,elapsed,delays,notes))
,total_delay_6108);

var G__6109 = (i_6106 + (1));
i_6106 = G__6109;
continue;
} else {
}
break;
}

return cljs.core.deref(elapsed);
});
sounds.core.shift_range = (function sounds$core$shift_range(max,offset){
var map_inc = (function (rge,incr){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__6076_SHARP_){
return (p1__6076_SHARP_ + incr);
}),rge);
});
return map_inc(cljs.core.range.cljs$core$IFn$_invoke$arity$1(max),offset);
});
sounds.core.get_rand_key = (function sounds$core$get_rand_key(octave_range){
var first_part = cljs.core.rand_nth(new cljs.core.PersistentVector(null, 8, 5, cljs.core.PersistentVector.EMPTY_NODE, ["c","d","e","f","g","a","b","c"], null));
var modifier = cljs.core.rand_nth(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["#","b"], null));
var octave = cljs.core.rand_nth(sounds.core.shift_range(octave_range,(3)));
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(first_part),cljs.core.str.cljs$core$IFn$_invoke$arity$1(modifier),cljs.core.str.cljs$core$IFn$_invoke$arity$1(octave)].join('');
});
sounds.core.play_rand_pent = (function sounds$core$play_rand_pent(k){
return sounds.core.play_notes.cljs$core$IFn$_invoke$arity$variadic(sounds.core.OSC(cljs.core.PersistentArrayMap.EMPTY),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.rand_nth(new cljs.core.Keyword(null,"pentatonic","pentatonic",1003535103).cljs$core$IFn$_invoke$arity$1(sounds.core.scales))], null),(200),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"key","key",-1516042587),k], 0));
});
sounds.core.play_rand_song = (function sounds$core$play_rand_song(){
var key = sounds.core.get_rand_key((3));
var total_time = sounds.core.make_melody((20),(300),(2),new cljs.core.Keyword(null,"pentatonic","pentatonic",1003535103),key);
var osc = sounds.core.OSC(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"freq","freq",-1855845278),key], null));
return sounds.core.play_stop(osc,total_time);
});
sounds.core.play_rand_song_with = (function sounds$core$play_rand_song_with(k){
var key = sounds.core.get_rand_key((3));
var total_time = sounds.core.make_melody((20),(300),(2),k,key);
var osc = sounds.core.OSC(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"freq","freq",-1855845278),key], null));
return sounds.core.play_stop(osc,total_time);
});
sounds.core.master_tick = cljs.core.atom.cljs$core$IFn$_invoke$arity$1((1));
sounds.core.configure_beat = (function sounds$core$configure_beat(p__6077){
var map__6078 = p__6077;
var map__6078__$1 = (((((!((map__6078 == null))))?(((((map__6078.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__6078.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__6078):map__6078);
var bpm = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__6078__$1,new cljs.core.Keyword(null,"bpm","bpm",-1042376389));
var divisor = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__6078__$1,new cljs.core.Keyword(null,"divisor","divisor",-25029120));
return "This will call the 'trigger pending";
});

//# sourceMappingURL=sounds.core.js.map
