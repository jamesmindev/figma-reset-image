import React from "react";

export default function resetImage () {
  
  const handleButtonClick = (e, val) => {
    e.preventDefault()
    parent.postMessage({ pluginMessage: { handleImage: true, action: val, } }, '*')
  }

  return (
    <>
      <div>
        <div className="section grid grid-col-1" style={{padding: "10px"}}>
          {/* Reset Image */}
          <button onClick={(e) => handleButtonClick(e, "Reset image")} className="btn btn--primary">Reset Image</button>
          <div className="grid grid-col-2">
            <button onClick={(e) => handleButtonClick(e, "Reset image size")} className="btn">Reset Size</button>
            <button onClick={(e) => handleButtonClick(e, "Reset image effects")} className="btn">Reset Effects</button>
            {/* Reset Image Effects */}
          </div>
        </div>

        <div className="divider"></div>

        {/* <div  className="section" style={{padding: "8px"}}>
          <button onClick={(e) => handleButtonClick(e, "Log original size")} className="btn">Get Original Size in px</button>
          <button onClick={(e) => handleButtonClick(e, "Calculate percentage")} className="btn">Get Current Size in % </button>
        </div> */}
      </div>
    </>
  )
}