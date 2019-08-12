
More documentation and/or video demonstration is coming!

VCS (Voice Control System) allows you to use your voice to control your computer in arbitrary ways (by writing your own voice
commands)... interacting both with information from the web or with programs running locally on your computer.
Javascript and python are the built into VCS and can be readily started with. Other languages are possible as well. 

To get started, follow the instructions below. 

```
git clone https://github.io/sheunaluko/vcs.git  #clone repo
cd vcs; npm install                             #install node dependencies
node src/nodejs/main.js --no-db                 #launch VCS core server (a) 
``` 

In order to begin speaking with VCS, you need to serve the VCS front end which actually connects 
your microphone using the web browser. The current speech backend is google web speech api. In a new terminal, run:

```
cd vcs/src/client 
python -m SimpleHTTPServer 8000
```

Open google chrome browser to the url, "localhost:8000" and accept the microphone access. Now, try asking **"ARE YOU THERE?"**, or **"HOW ARE YOU?"**

That should get you up and running, and the full world of javascript voice commands is now at your disposal. If you prefer
programming in python however, you can follow the instructions below to enable python voice command writing 

---

Install the python environment using a virtualenv (ensure that python3.7 and virtualenv are installed first) as follows: 

``` 
cd src/python/ 
virtualenv --python=python3.7 . 
source bin/activate #(b) 
pip install -r requirements.txt 
``` 

After VCS server is already running (a) and you are within the activated python virtual environment (b), you can connect the python modules by running the following: 

```
python csi_adapter.py
```

Now, you are all set to write python commands voice commands too! Both javascript and python commands can call eachother. 

Contact: oluwa@stanford.edu or alukosheun@gmail.com
