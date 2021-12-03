import React, { useRef, useState } from 'react'
import IframeResizer from 'iframe-resizer-react'

const IframeEnv = () => {
  const iframeRef = useRef(null)

  return (
      <IframeResizer
        forwardRef={iframeRef}
        heightCalculationMethod="bodyOffset"
        inPageLinks
        log
        src="https://gatitolabs.cl"
        style={{ width: '1px', minWidth: '100%'}}
      />

  )
}
export default IframeEnv;