;;Wed Apr 26 22:07:23 PDT 2017
;;@copyright Sattvic-Alma Technologies
;;@author Oluwaseun Aluko

;;COPIED TO VCS ON | Tue Feb 18 09:56:44 PST 2020

(ns salma.associative-memory
  (:require-macros [cljs.core.async.macros :refer [go go-loop]])
  (:require [salma.client-utils :as util]
            [clojure.string :as string]
            [cljs.core.async :refer [put! chan <! >! timeout close!]]
            [salma.client-http :as http]
            [salma.salma-web-speech :as speech]
            [salma.core-command :as commands]
            [salma.dynamic-parameters :as params]
            [salma.salma-logger :as logger]))


(def m-log (logger/make-logger "associative_memory" )) ;; configure logger for this file

(def verbose true)
;;happy coding ~>
(defn log [& stuff]
  (if verbose 
    (apply m-log stuff)
    nil))

(def node-store (atom {}))

(defn get-node [id]
  (id @node-store))

(defn get-node-outs [id]
  (:outs (get-node id)))

(defn new-node []
  {:outs #{} }) 

(defn add-node [id]
  (let [node (new-node)]
    (swap! node-store assoc id node)))



(defn node-exists? [id]
  (if (get-node id)
    true
    false))

(defn ensure-node [id]
  (when (not (node-exists? id))
    (add-node id))) 

(defn ensure-nodes [ids]
  (doseq [id ids]
    (ensure-node id)))

(defn add-node-relation [id relation]
  (swap! node-store update-in [id :outs] conj relation))

(defn get-rel-type [id]
  (if (= "<-" (clojure.string/join (take 2 (name id)))) 
    :backward
    :forward ))

(defn reverse-relation-type [id]
  (let [n (name id)]
    (if (= \< (first n))
      (keyword (clojure.string/join (drop 2 n)))
      (keyword (str "<-" n)))))

(def rr reverse-relation-type)

(def reverse-relation-info identity)

(defn new-relation [source type target info & {:keys [reverse]}]
  (if reverse 
    (new-relation target (reverse-relation-type type) source (reverse-relation-info info)) 
    {:source source 
     :target target
     :type   type
     :info   info }))

(defn new-relations [source type target info]
  [(new-relation source type target info) 
   (new-relation source type target info :reverse true)])


(defn add-relation 
  ([source type target]
   (add-relation source type target nil))
  ([source type target info]
   ;;make sure nodes exists and create them if they do not
   (ensure-nodes [source target])
   (cond (= type :special-type) nil
         :default (let [[source-rel target-rel] (new-relations source type target info)]
                    (add-node-relation source source-rel)
                    (add-node-relation target target-rel)))))


(def rel add-relation)




(defn filter-outputs [id f]
  (filter f (get-node-outs id)))

(defn get-outs-of-type [id type]
  (filter-outputs id #(= type (:type %))))

(defn has-outs-of-type? [id type] 
  (not (empty?  (get-outs-of-type id type))))

;; functions for working with PATHS 

(def test-path [{:source :dog1, :target :dog2, :type :kind-of, :info nil}  
                {:source :dog2, :target :dog3, :type :kind-of, :info nil}  
                {:source :dog3, :target :dog4, :type :kind-of, :info nil}  
                {:source :dog4, :target :dog5, :type :kind-of, :info nil}])

(def other [{:source :dog1, :target :cat, :type :kind-of, :info nil} ])

(defn _test [n]
  (into [] (take n test-path)))

(defn path-to-key [path]
  (conj  (into [] (flatten (for [ {:keys [source target type ]} path]
                             [source type]))) (:target (last path))))

(def searches (atom {}))

(defn clear-searches []
  (reset! searches {}))



(def tmp-matches (atom #{}))

(defn clear-matches []
  (reset! tmp-matches []))

(defn reset-search [] 
  (clear-searches)
  (clear-matches)) 

;; ------------------------------------------------
;; RELATIONS - dont forget you can specify optional 
;; 4th parameter "info"

(rel :dog :kind-of :animal)
(rel :dog :does-action :bark)
(rel :cat :kind-of :animal)
(rel :animal :kind-of :organism)
(rel :organism :kind-of :living-thing)
(rel :living-thing :kind-of :thing)
(rel :dog :kind-of :mammal)
(rel :mammal :kind-of :organism)
(rel :dog :<-kind-of :poodle)


(defn KIND-OF [path]
  (= #{:kind-of} (into #{} (map :type path))))


;; ---------------------------------------------------------------------------------------------->
;; a node is a keyword :node-id 
;; a path is an array of maps which looks => [{:source :dog1, :target :dog2, :type :kind-of, :info nil}...] 
;; match-result is the output of the match? fxn 
;; reason is either (strings) T_SIG or NO_OUTS reflecting if there were no outputs or the termination condition 
;; was satisfied 
;; ---------------------------------------------------------------------------------------------->

(defn _register-search [path]
  (let [path-key (path-to-key path)]
    (log path-key)
    (swap! searches assoc-in path-key {})))

(defn _report-match [{:keys [node path]}]
 (let [path-key (path-to-key path)]
    (log "FOUND_MATCH::" path-key)
    (swap! tmp-matches conj [node path])))

(defn _should-stop? [node path & {:keys [match-result]}]
  (= 10 (count path)))

(defn length-stopper [num]
  (fn [node path & {:keys [match-result]}]
    (= num (count path))))

(defn _match? [node path] 
  (= 4 (count path)))

(defn _get-next-nodes [node path]
  ;filter them for stuff 
  (get-outs-of-type node :kind-of))


(defn _terminate-search [node path & {:keys [match-result reason]}]
  (let [path-key (path-to-key path)]
    (log "TERMINATING::" path-key "::" reason)
    (swap! searches assoc-in path-key reason)))



;; ---------------------------------------------------------------------------------------------->
;; ---------------------------------------------------------------------------------------------->


;;allows recursive calling of process-node
(def node-jump (atom nil))

(defn schedule-node-jump [{:keys [node path out match? should-stop? get-next-nodes report-match terminate-search] :as args}]
  (let [new-path (conj path out)
        next-node (:target out) ]
    ;;process the next node 
    (@node-jump (merge args {:path new-path :node next-node} ))))

(defn schedule-node-jumps [{:keys [node path outs match? should-stop? get-next-nodes report-match terminate-search] :as args}]
  ;;basically we gotta call process node again (after updating the path)
  ;;separated it out so that I can potentially do interesting things with threading
  (doseq [out outs]
    (schedule-node-jump (merge args {:out out} ))))

(defn process-node [{:keys [node path match? should-stop? get-next-nodes report-match terminate-search register-search] :as args}]
  ;;first we will register that we are searching this node (for keeping track of progresss, etc 
  (register-search path)
  ;;now go on 
  (let [result (match? node path)]
    ;;so we found a path that has satisfied our criteria - we report it 
    (when result 
      (report-match {:node node :path path}))
    ;;now we need to determine if we should continue or not 
    (if (not (should-stop? node path :match-result result))
      ;;yes we should - lets schedule the jumps to the next nodes
      (let [outs (get-next-nodes node path)]
        (if (not-empty outs)
          (schedule-node-jumps (merge args {:outs outs} ))
          ;;no outs left 
          (terminate-search node path :match-result result :reason "NO_OUTS")))
      ;;no we are done 
      (terminate-search node path :match-result result :reason "T_SIG"))))

(reset! node-jump process-node)

;;FIND TREES http://clojure.com/blog/2012/05/08/reducers-a-library-and-model-for-collection-processing.html



(defn test-search [] 
  (process-node {:node :poodle
                 :path [] 
                 :match? _match? 
                 :should-stop? (length-stopper 10)
                 :get-next-nodes _get-next-nodes
                 :report-match _report-match 
                 :terminate-search _terminate-search 
                 :register-search _register-search}))


;; so I would like to explore the possibility of using this framework to 
;; implement general problem solver 

;; Thu Nov  2 20:51:49 PDT 2017
;; going to implement a searcher 

(defn kind-of-search [a b]
  (reset-search)
  (process-node {:node a
                 :path [] 
                 :match? (fn [node path]
                           ;;its a match if b is the target at the end of the path
                           (= b (:target (last path))))
                 :should-stop? (length-stopper 10)
                 :get-next-nodes   (fn [node path] 
                                     (get-outs-of-type node :kind-of))
                 :report-match _report-match 
                 :terminate-search _terminate-search 
                 :register-search _register-search})
  (if (not-empty @tmp-matches)
    true
    false))

(defn attribute-search [a b]
  (reset-search) 
  ;;note that the logic is mainly implemented by the match and get-next-node 
  ;;fxns. A thing has an attribute if either it directly has that attribute 
  ;;or is a kind of another thing which has it. To account for both we allow
  ;;output relations of both kind-of and is
  (process-node {:node a
                 :path [] 
                 :match? (fn [node path]
                           ;;its a match if b is the target at the end of the path
                           (= b (:target (last path))))
                 :should-stop? (length-stopper 10)
                 :get-next-nodes   (fn [node path] 
                                     (clojure.set/union 
                                      (get-outs-of-type node :kind-of)
                                      (get-outs-of-type node :is)))
                 :report-match _report-match 
                 :terminate-search _terminate-search 
                 :register-search _register-search})
  (if (not-empty @tmp-matches)
    true
    false))



(defn clean [x] 
  (name x))

(defn describe-rel [{:keys [source target type info]}]
  (let [ [_source _target] (map clean [source target]) ] 
    (case type 
      :kind-of (str _source " is a kind of " _target)
      :<-kind-of (str _source " includes the subtype of " _target)
      :is      (str _source " is " _target)
      :does-action  (str _source " does the action " _target ) 
      nil)))




(defn describe-node [k]
  (if-let [node (k @node-store)]
    ;;got it
    (clojure.string/join ". " 
                         (remove nil? 
                                 (for [rel (:outs node)]
                                   (describe-rel rel))))
    ;;nope 
    (str "Sorry I dont know about " (name k))))
                     
                   
;; when input is received it must be matched against known input types 
(defn to-node-name [x] 
  (keyword (clojure.string/join "-" 
               (clojure.string/split x " "))))


(def speak speech/speak)

;; THIS IS INTERSTING -- but having the regular expression like this is a bit of a nightmare 
;; and with enough regex it would be inconvenient to debug (the order they are processed in matters)
;; should have a *smarter* way of determining the INTENT behind the request and translating it into 
;; the proper graph query .... maybe can use natural language processing 
(def match-lib [ 
                [[#"([^ ]*) is a kind of (.*)"
                  #"a (.*) is a kind of (.*)"
                  #"a (.*) is a (.*)"          ]      ;; THE ORDER MATTERS HERE!!! lol              
                 (fn [[_ a b]]
                   (rel (to-node-name a) :kind-of (to-node-name b))
                   (speak "OK"))]
                [[#"([^ ]*) is (.*)"
                  #"a (.*) is (.*)"]
                 (fn [[_ a b]]
                   (rel (to-node-name a) :is (to-node-name b))
                   (speak "OK"))]
                [#"tell me about (.*)"
                 (fn [[_ x]]
                   (speak (describe-node (to-node-name x))))]
                [#"is a (.*) a kind of (.*)"
                 (fn [[_ a b]]
                   (if (kind-of-search (to-node-name a) (to-node-name b))
                     (speak "YES")
                     (speak "NO")))]
                [[#"does (.*) have the attribute (.*)"
                  #"does (.*) have the characteristic (.*)"
                  #"is a (.*) (.*)"
                  #"is (.*) (.*)"]
                 (fn [[_ a b]]
                   (if (attribute-search (to-node-name a) (to-node-name b))
                     (speak "YES")
                     (speak "NO")))]
                [#"(why)"
                 (fn [_]
                   (let [match-info (second (first @tmp-matches))]
                     (speak (clojure.string/join " and " 
                                                 (remove nil? 
                                                         (for [rel match-info]
                                                           (describe-rel rel)))))))]
                ])


(defn get-re-result [re text]
  ;;try each re in the vector and give nil if none work 
  (if (vector? re)
    (loop [current (first re)
           remaining (rest re)]
      (if current
        (if-let [result (re-matches current text)]
          (do
            (log "for RE: " current " | got result | :: " result)
            result)
          (recur (first remaining) (rest remaining)))
        ;;no re
        nil))
    ;;not a vec 
    (re-matches re text)))
 

(defn run-match [text]
  ;;we do a loop to find the first match 
  (loop [[re fx] (first match-lib)
         remaining (rest match-lib)]
    (if re
      (if-let [result (get-re-result re text)]
        ;;got a match! -- so we run its function with the result 
        (do (log "found match")
            (log result)
            (fx result))
        ;;no match
        (recur (first remaining) (rest remaining)))
      ;;no re
      (js.speak "Sorry I did not understand"))))
 
(defn process-input [text]
  (run-match text))









