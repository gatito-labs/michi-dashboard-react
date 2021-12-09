import React, { useState, useEffect } from "react";
import Button from '@material-ui/core/Button';
import { Card, CardContent, CardHeader } from '@material-ui/core';
import { fetchEventSource } from '@microsoft/fetch-event-source';

const RoboticsEnvSelector=()=>{
    const[server_status , setServerStatus]=useState(false);
    const[started, setStarted] = useState(false);
    const[clicked, setClicked] = useState(false);
    const[clicked_stop, setClickedStop] = useState(false);
    const[progress_data, setProgressData] = useState('');
    const ctrl = new AbortController();

    const fetchData = async () => {
        const url = 'https://app.gatitolabs.cl/hub/api/users/dremiam@gmail.com';
        try {
            const response = await fetch(url, {
                method:'GET',
                'headers': {'Authorization': 'token 198662d000ea4178b65484b170d14aaf'}
            });
            const json = await response.json();
            //console.log(json.servers[''].ready);

            setServerStatus(json.server ? json.servers[''].ready : false);
        } catch (error) {
            console.log("error", error);
        }
    };

    useEffect(() => {
        console.log("use effect");
        if (progress_data !== ''){
          var json = JSON.parse(progress_data);
          setServerStatus(json.ready ? json.ready : false);
        }
        else {
          fetchData();
        }
    },[progress_data, clicked_stop, clicked]);
 
    const stopServer=()=>{
        setClickedStop(true);
        fetch('https://app.gatitolabs.cl/hub/api/users/dremiam@gmail.com/server', {
            // content-type header should not be specified!
            method: 'DELETE',
            'headers':{'Authorization': 'token 198662d000ea4178b65484b170d14aaf'}
          })
            .then(response => console.log(response))
            .then(success => {
              // Do something with the successful response
              setClickedStop(false);
              ctrl.abort();
              setProgressData('');
            })
            .catch(error => console.log(error)
          );
    }

    const startServer=()=>{
        setClicked(true);
        fetch('https://app.gatitolabs.cl/hub/api/users/dremiam@gmail.com/server', {
            // content-type header should not be specified!
            method: 'POST',
            'headers':{'Authorization': 'token 198662d000ea4178b65484b170d14aaf'}
          })
            .then(response => {
              console.log(response);
              fetchEventSource('https://app.gatitolabs.cl/hub/api/users/dremiam@gmail.com/server/progress', {
                method: 'GET',
                headers: {
                  'Authorization': 'token 198662d000ea4178b65484b170d14aaf',
                },
                signal: ctrl.signal,
                onmessage(msg) {
                  //setServerStatus(json.ready);
                  //setSpawningStatus(json.progress);
                  //console.log(msg.data);
                  //var evt = JSON.parse(msg.data);
                  console.log(msg.data);
                  setProgressData(msg.data);
          
                }
              });
            }
            )
            .then(success => {
              // Do something with the successful response
              setClicked(false);

            })
            .catch(error => {
              console.log(error);
              setClicked(false);
            });
    }
    return (
        <Card>
          <CardHeader title="Ambientes"/>
          <CardContent>
          <h2>{progress_data? JSON.parse(progress_data).progress: ''}</h2>
          <h2>{server_status?  "ready":"not ready"}</h2>
          <h2>{server_status? "server ready": started? "waiting for server" : "server is not running"}</h2>
            <Button variant="contained" onClick={stopServer} disabled={!server_status}>Stop</Button>
            <Button variant="contained" onClick={startServer} disabled={server_status || started}>Start</Button>
          <>{clicked? <div>loading...</div> : <div></div>}</>
          <>{clicked_stop ? <div>deteniendo...</div> : <div></div>}</>
        </CardContent>
        </Card>
    );
};
 
 
export default RoboticsEnvSelector;
