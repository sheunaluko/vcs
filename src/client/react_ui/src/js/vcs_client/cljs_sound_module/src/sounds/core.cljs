;;Thu Sep  1 16:49:44 CDT 2016
(ns sounds.core
  (:require [cljs.reader :as reader]
            [sounds.midi-freq :as midi-freq]))

(def log println)

(def root 60) ;;defining 

(def alpha-to-midi-table
  { 
   :c 0
   :d 2
   :e 4
   :f 6
   :g 8
   :a 10 
   :b 12 
   } 
) 


(defn alpha-to-midi [alpha]
  "turns a#4 into midi number" 
  (if (= 2 (count alpha))
    (let [letter (first alpha)
          octave (second alpha)]
      (+ ( ( keyword letter) alpha-to-midi-table) (* 12 octave)))
    ;;if not two then we assume three
    (let [letter (first alpha)
          mod (cond 
                (= (second alpha) "#") 1
                (= (second alpha) "b") -1)
          octave (last alpha)]
      (+ mod ((keyword letter) alpha-to-midi-table) (* 12 octave)))))

(defn midi-to-freq [midi]
  ( (keyword (str midi)) midi-freq/midi-to-freq ))

(defn OSC [{:keys [type freq gain]}]
  (atom 
   {:type (or type "sine")
    :freq (cond
            freq (cond
                   (string? freq) (-> freq 
                                      alpha-to-midi
                                      midi-to-freq)
                   :default freq)
            :default 440)
    :gain (if gain
            gain 
            0.25)
    :default-dur 2000}))

(def a midi-freq/midi-to-freq)

(defn set-type [OSC type]
  (swap! OSC assoc :type type))

(defn set-freq [OSC freq]
  (swap! OSC assoc :freq freq))

(defn set-gain [OSC gain]
  (swap! OSC assoc :gain gain))

(def ctx (js/AudioContext.)) 

(defn js_osc [ type freq gainVal ]  
  (let [osc (.createOscillator ctx)
        gain (.createGain ctx) ]
    (aset osc "frequency" "value" freq)
    (aset osc "type" type)
    (.connect gain (aget ctx "destination"))
    (aset gain "gain" "value" gainVal)
    (.connect osc gain) 
    (.start osc)
    osc))


(defn play-OSC [OSC]
  (let [{:keys [type freq gain]} @OSC
        ;sound (.osc js/osc type freq gain)]
        sound (js_osc type freq gain)]        
    (swap! OSC assoc :instance sound)))

(defn stop-OSC [OSC]
  (if-let [instance (:instance @OSC)]
    (do
      (.stop instance)
      (swap! OSC dissoc :instance))
    (log "OSC was not playing!")))


(defn play-stop [OSC dur]
  (play-OSC OSC)
  (js/setTimeout #(stop-OSC OSC) dur ))

(defn play-freq
  [OSC freq dur]
  (set-freq OSC freq)
  (play-stop OSC dur))

(defn play-note 
  [OSC note dur]
  (play-freq OSC (-> note alpha-to-midi midi-to-freq) dur))

(defn _play-note  [note]
  (play-note (OSC {}) note 200))
  
(defn scale-to-midi [note] 
  "This function maps the scale off sets (scale number) to the midi offsets (chromatic)
   This returns the number to add to the root midi note" 
  (let [ arr [nil 0 2 4 5 7 9 11 12] ] 
    (nth arr note)))



(defn parse-note [note] 
  "This turns a note of the form b5.1 or #7.-2 into a midi (chromatic) offset " 
  (let [components (clojure.string/split note #"\.")
        value (first components)
        octave-shift (cond 
                       (> (count components) 1) (reader/read-string (str (last components)))
                       :default 0)
        modifier (cond 
                   (> (count value) 1) (first value)
                   :default nil)
        modifier-offset (cond 
                          (= \b modifier) -1 
                          (= \# modifier) 1  
                          :default 0)
        key (reader/read-string (or 
                                      (str (last value))
                                      (value)))
        ;;_ (log key)
        base-offset (scale-to-midi key)]
    (+ base-offset modifier-offset (* 12 octave-shift))))




(def scales 
  {
   :pentatonic (map str [1 2 3 5 6])
   :minor-pentatonic (map str [1 "b3" 4 5 "b7"])
   :minor (map str [1 2 "b3" 4 5 "b6" "b7"])
   :harmonic-minor (map str [1 2 "b3" 4 5 "b6" 7])
  }
)

(defn rand-scale [key]
  (let [scale (key scales)]
    (rand-nth scale)))

(defn interval [fxn int]
  (js/setInterval fxn int))

  

;; FIGURE OUT THE ISSUE OF PLAYING MULTI NOTES SIMULTANEOUSLY

(defn play-notes [OSC notes dur & {:keys [key]}]
  (let [base-note (cond 
                      key (alpha-to-midi key)
                      :default root)]
    (doseq [note notes]
      (let [midi (+ base-note (parse-note note) ) 
            freq (midi-to-freq midi)
            new-OSC (atom @OSC)]
        (play-freq new-OSC freq dur)))))

(defn play-notes-delay [osc notes dur delay & {:keys [key]}]
  (let [num-notes (count notes)
        delays (map #(* delay %) (range num-notes))]
    (dotimes [i num-notes]
      (js/setTimeout #(play-notes osc [(nth notes i)] dur :key key) (nth delays i)))))


(def feedback-key "e5") 
  
;; now we can make functions for providing feedback
(defn success []
  (play-notes (OSC {}) ["1" "3"] 200 :key feedback-key))


(defn fifth []
  (play-notes (OSC {}) ["1" "5"] 200 :key feedback-key))

(defn cadence []
  (play-notes-delay (OSC {}) ["1" "5.-1"] 100 100 :key feedback-key))

(defn continue []
  (play-notes (OSC {}) ["5.-1"] 100 :key feedback-key))

(defn error []
  (play-notes (OSC {}) ["1" "b3"] 200 :key feedback-key))

(defn ready-for-input []
  (play-notes-delay (OSC {}) ["1" "3"] 100 100 :key feedback-key))

(defn unrecognized []
  (play-notes (OSC {}) ["1" "b5"] 200 :key feedback-key))

(def ^:export  audio-feedback  ;; beautiful how this export allows you to get module access :) 
  (clj->js
  {
   :success success
   :continue continue
   :error   error
   :ready-for-input ready-for-input 
   :unrecognized unrecognized
   }
  ) 
)

;; We will have a function make melody 
;; you specify the number of notes you want, and the tick size (as well as max number of ticks between notes
;; an atom is returned such that it contains the setTimeout for each note that 
;; will be played 

;; when an timeout matures then it will drop the oldest interval from the atom (its own)

;; to stop the melody  you can map clearInterval through the atom 

(defn make-melody [num tick-size max-ticks scale key] 
  (let [melody (atom [])
        elapsed (atom 0) 
        delays (map #(* (inc %) tick-size) (range max-ticks))
        notes (cond
                (keyword? scale) (scale scales)
                :default scale)]
    (dotimes [i num]
      (let [next-delay (rand-nth delays)
            total-delay (+ next-delay @elapsed)]
        (swap! elapsed (fn [current] (+ current next-delay)))
        (print total-delay)
        (js/setTimeout #(play-notes (OSC {}) [(rand-nth notes)] 200 :key key) total-delay)))
    @elapsed))

(defn shift-range [max offset]
  (let [map-inc (fn [rge incr] (map #(+ % incr) rge))]
    (map-inc (range max) offset)))
        
(defn get-rand-key [octave-range]
  (let [first-part (rand-nth ["c" "d" "e" "f" "g" "a" "b" "c"])
        modifier   (rand-nth ["#" "b"])
        octave     (rand-nth (shift-range octave-range 3))]
    (str first-part modifier octave)))

(defn play-rand-pent [k]
  (play-notes (OSC {}) [(rand-nth (:pentatonic scales))] 200 :key k))

(defn play-rand-song [] 
  (let [key (get-rand-key 3)
        total-time (make-melody 20 300 2 :pentatonic key ) ;;this function starts the melody 
        osc (OSC {:freq key})]
    (play-stop osc total-time))) ;;this plays bass note
      
    
    
(defn play-rand-song-with [k] 
  (let [key (get-rand-key 3)
        total-time (make-melody 20 300 2 k key ) ;;this function starts the melody 
        osc (OSC {:freq key})]
    (play-stop osc total-time))) ;;this plays bass note



;; ------------------------- TIMER LOGIC  ---------------

;; timer is just a software clock ticking away.. after being configure it will tick at a
;; constant rate defined by (bpm/60)/divisor "TICKS" per second 
;; each time it ticks... it will call a handler function to process all the virtual notes
;; which are in memory

;; VIRTUAL NOTES (henceforth v-notes) 
;; lets say you want to play a note at the start of 2 measures from now ..
;; and have it repeat every measure after that for 10 measures
;; (send-to-master {
;;                  :class "measure"
;;                  :delay 2 
;;                  :interval 1
;;                  :life 10  ;; life will decrement every time the v-note is processed
;;                            ;; !! PROVIDED that delay is nil (else delay is decremented) 
;;                  :note "Ab.2"
;;                  :OSC (OSC "sine") ;; need to implement this arity 
;;                  }) 


;; classes
;; So.. basically there are N ticks in a measure where N is equal to divisor
;; each time that the the processor process a tick it will increment the master tick atom
;; (when (= @master-tick divisor)
;;   (reset! master-tick 1))
;; this code should be run @ the end of the processing cycle!

;; SO! in order to improve the performace of this code... as soon as all of the notes are
;; dispatched for a given tick.. the processing for the next tick should occur...
;; and it should return an object which JUST contains which notes should be PLAYED...
;; THEN, when the tick actually occurs this object is used to play the notes
;; kiiara gold 


(def master-tick (atom 1))

;; two ways to trigger notes
;; 1. @ next _specify_tick_class_here (repeat n times)
;; 2. @ 

(defn configure-beat [{:keys [bpm divisor]}]
  "This will call the 'trigger pending"
  )




    







  
  
