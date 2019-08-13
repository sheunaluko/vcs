For the simpler client, serve the current /client directory using python like so: 

```
python -m SimpleHTTPServer #python2
python -m http.server      #python3 
```

For the compiled and interactive client which uses the vuetify framework, 
please see: https://github.com/sheunaluko/vcs/tree/master/src/client/vue

Also note that for development purposes you way connect to VCS core using a node repl by running:

```
cd vcs/src/nodejs/; 
node vcs_repl.js localhost:VCS_PORT_HERE 
```
