import * as React from "react";
import Iframe from 'react-iframe'

//const IframeEnv = props => (
//    <Iframe url="https://app.gatitolabs.cl/user/dremiam@gmail.com/"
//         width="100%"
//         height="100%"
//         zIndex="100"
//         id="myId"
//         display="initial"
//         position="relative"
//         frameborder="0"
//         // eslint-disable-next-line react/style-prop-object
//         style="overflow:hidden;height:100%;width:100%"
//     />
// );

const IframeEnv = props => (
    <iframe title="test" src="https://app.gatitolabs.cl/user/dremiam@gmail.com/" frameborder="0" height="100%" width="100%"></iframe>
);

export default IframeEnv;
