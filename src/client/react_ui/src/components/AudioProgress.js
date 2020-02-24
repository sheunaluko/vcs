import React, { useState } from 'react';
import {subscribe} from "../js/vcs_hub"

import {
    ProgressBar, 
} from "@blueprintjs/core"; 

export function AudioProgress() {  

    /* 
        Will get the audio RMS from the vcs HUB 
    */

   const [level, setLevel] = useState(0); 

    let on_update = function({data}) { 
        setLevel(data*10)
    }

    subscribe({id : "audio.rms" , cb : on_update})

    return ( 

        <ProgressBar className="bp3-intent-primary" value={level}> </ProgressBar> 
    )

}

