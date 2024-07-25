import React from "react";

export default function TestButton () {
  // Send messages to plugin
  const handleTest = (e) => {
    console.log(e)
    parent.postMessage({ pluginMessage: { test: true } }, '*')
  }

  return (
    <>
      <section className="section">
        <div className="grid grid-col-1">
          <button onClick={handleTest}>Test</button>
        </div>
      </section>
    </>
  )
}