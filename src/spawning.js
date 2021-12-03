import React, { useState, useEffect } from 'react';

const Example = () => {
    const useEventSource = (url) => {
        const [data, updateData] = useState(null);
    
        useEffect(() => {
            const source = new EventSource(url);
    
            source.onmessage = function logEvents(event) {      
                updateData(JSON.parse(event.data));     
            }
        }, [])
    
        return data;
    }
    const data = useEventSource('https://app.gatitolabs.cl/hub/api/users/dremiam@gmail.com/server/progress');
    if (!data) {
        return <div />;
    }
    return (
        <div>The current temperature in my living room is {data.temperature} as of {data.updatedAt}</div>
    );
};

export default Example;