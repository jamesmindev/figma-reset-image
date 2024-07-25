let currentImageHash = "";
let originalImageWidth, originalImageHeight;

export async function handleImage (msg, currentSelection) {
  // Figma - notifications
  // This doesn't work properly because of getBytesAsync() function
  // setTimeout is used below to show this notification.
  let figmaNotify_startHandleImage = figma.notify("Processing image...", { timeout: 30000 });

  // Filter the currentSelection to have element with image fill as the first fill.
  const filteredSelection = currentSelection.filter(selection => {
    if (selection.fills.length > 0 && selection.fills[0].type === "IMAGE") {
      return selection
    }
  })

  // Check if filteredSelection has any element
  if (filteredSelection.length == 0) {
    figmaNotify_startHandleImage.cancel()
    figma.notify("Invalid element selected.", {
      error: true,
      timeout: 2000
    })
    return;
  }

  setTimeout(async () => {
    try {
      if (msg.action == "Reset image") {
        await handleOriginalImageSize(filteredSelection, "reset");
        resetImageEffects(filteredSelection);
      }
      else if (msg.action === "Reset image size") {
        await handleOriginalImageSize(filteredSelection, "reset");
      } 
      else if (msg.action === "Reset image effects") {
        resetImageEffects(filteredSelection);
      }
      // else if (msg.action === "Log original size") {
      //   await handleOriginalImageSize(filteredSelection, "log");
      // }      
      // else if (msg.action === "Calculate percentage") {
      //   await handleOriginalImageSize(filteredSelection, "calc")
      // } 
      else {
        throw new Error("Unknown action")
      }

      // Figma notification
      figmaNotify_startHandleImage.cancel()
      figma.notify("✅ Success!", { timeout: 2000 })

    } catch(err) {
      // Figma notification
      figmaNotify_startHandleImage.cancel()
      figma.notify("An error occurred.", { error: true, timeout: 2000 })
    }
  }, 50)

}

// action: reset, log, calc
async function handleOriginalImageSize(currentSelection, action) {
  const fontSize = 64;

  // for reset, set scaleMode to "FILL"
  return new Promise((resolve, reject) => {
    try {
      currentSelection.forEach(async selection => {
        // Check for different images
        if (currentImageHash !== selection.fills[0].imageHash) {
          currentImageHash = selection.fills[0].imageHash;
          const originalImageFile = figma.getImageByHash(currentImageHash)
    
          await originalImageFile.getBytesAsync()
          const originalImageSize = await originalImageFile.getSizeAsync()
          originalImageWidth = originalImageSize.width
          originalImageHeight = originalImageSize.height
        }
  
        if (action === "log") {
          const textLayer = figma.createText()
          textLayer.x = selection.x;
          textLayer.y = selection.y + selection.height;
          textLayer.characters = originalImageWidth + "x" + originalImageHeight
          textLayer.fontSize = fontSize;
        }
        
        else if (action === "reset") {
          // Set the image scaleMode to FILL
          // Need to make clones of fills to make changes to it.
          const newFills = [...selection.fills];
          const newImageFill = JSON.parse(JSON.stringify(newFills[0]))
          newImageFill.scaleMode = "FILL";
          newImageFill.scalingFactor = 0.5;
          newFills[0] = newImageFill;
          selection.fills = newFills;

          // Resize the image
          selection.resize(originalImageWidth, originalImageHeight)
        }
  
        else if (action === "calc") {
          // const originalImageArea = originalImageWidth * originalImageHeight
          // const currentSelectionArea = selection.width * selection.height;
          let resultString
  
          // calculate percentage
          const scalePercentageWidth = (selection.width / originalImageWidth * 100)
          const scalePercentageHeight = (selection.height / originalImageHeight * 100)
  
          if (scalePercentageWidth.toFixed(0) === scalePercentageHeight.toFixed(0)) {
            resultString = `${scalePercentageWidth.toFixed(0)}%`
          } else {
            resultString = `${scalePercentageWidth.toFixed(0)}% ${scalePercentageHeight.toFixed(0)}%`
          }
        
          const textLayer = figma.createText()
          textLayer.x = selection.x;
          textLayer.y = selection.y + selection.height;
          textLayer.characters = resultString
          textLayer.fontSize = fontSize;
        }

        else {
          throw new Error("Unknown action.")
        }

        resolve({ success: true })
      })
    } catch (err) {
      reject({ success: false })
    }
  })
}

// reset ImageEffects
function resetImageEffects (currentSelection) {
  currentSelection.forEach(selection => {
    // Make clones of fills to make changes to it.
    const newFills = [...selection.fills];
    const newImageFill = JSON.parse(JSON.stringify(newFills[0]))

    // Reset the properties
    newImageFill.blendMode = "NORMAL";
    newImageFill.filters = {
      contrast: 0,
      exposure: 0,
      highlights: 0,
      saturation: 0,
      shadows: 0,
      temperature: 0,
      tint: 0
    }
    newImageFill.opacity = 1;
    newImageFill.rotation = 0;
    newImageFill.visible = true;

    newFills[0] = newImageFill;
    selection.fills = newFills;
  })
}