(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // plugin-src/handleTest.tsx
  function handleTest(msg, currentSelection) {
    return __async(this, null, function* () {
      if (msg.test) {
        console.log("Testing...");
        console.log(currentSelection[0]);
      }
    });
  }

  // plugin-src/handleImage.tsx
  var currentImageHash = "";
  var originalImageWidth;
  var originalImageHeight;
  function handleImage(msg, currentSelection) {
    return __async(this, null, function* () {
      let figmaNotify_startHandleImage = figma.notify("Processing image...", { timeout: 3e4 });
      const filteredSelection = currentSelection.filter((selection) => {
        if (selection.fills.length > 0 && selection.fills[0].type === "IMAGE") {
          return selection;
        }
      });
      if (filteredSelection.length == 0) {
        figmaNotify_startHandleImage.cancel();
        figma.notify("Invalid element selected.", {
          error: true,
          timeout: 2e3
        });
        return;
      }
      setTimeout(() => __async(this, null, function* () {
        try {
          if (msg.action == "Reset image") {
            yield handleOriginalImageSize(filteredSelection, "reset");
            resetImageEffects(filteredSelection);
          } else if (msg.action === "Reset image size") {
            yield handleOriginalImageSize(filteredSelection, "reset");
          } else if (msg.action === "Reset image effects") {
            resetImageEffects(filteredSelection);
          } else {
            throw new Error("Unknown action");
          }
          figmaNotify_startHandleImage.cancel();
          figma.notify("\u2705 Success!", { timeout: 2e3 });
        } catch (err) {
          figmaNotify_startHandleImage.cancel();
          figma.notify("An error occurred.", { error: true, timeout: 2e3 });
        }
      }), 50);
    });
  }
  function handleOriginalImageSize(currentSelection, action) {
    return __async(this, null, function* () {
      const fontSize = 64;
      return new Promise((resolve, reject) => {
        try {
          currentSelection.forEach((selection) => __async(this, null, function* () {
            if (currentImageHash !== selection.fills[0].imageHash) {
              currentImageHash = selection.fills[0].imageHash;
              const originalImageFile = figma.getImageByHash(currentImageHash);
              yield originalImageFile.getBytesAsync();
              const originalImageSize = yield originalImageFile.getSizeAsync();
              originalImageWidth = originalImageSize.width;
              originalImageHeight = originalImageSize.height;
            }
            if (action === "log") {
              const textLayer = figma.createText();
              textLayer.x = selection.x;
              textLayer.y = selection.y + selection.height;
              textLayer.characters = originalImageWidth + "x" + originalImageHeight;
              textLayer.fontSize = fontSize;
            } else if (action === "reset") {
              const newFills = [...selection.fills];
              const newImageFill = JSON.parse(JSON.stringify(newFills[0]));
              newImageFill.scaleMode = "FILL";
              newImageFill.scalingFactor = 0.5;
              newFills[0] = newImageFill;
              selection.fills = newFills;
              selection.resize(originalImageWidth, originalImageHeight);
            } else if (action === "calc") {
              let resultString;
              const scalePercentageWidth = selection.width / originalImageWidth * 100;
              const scalePercentageHeight = selection.height / originalImageHeight * 100;
              if (scalePercentageWidth.toFixed(0) === scalePercentageHeight.toFixed(0)) {
                resultString = `${scalePercentageWidth.toFixed(0)}%`;
              } else {
                resultString = `${scalePercentageWidth.toFixed(0)}% ${scalePercentageHeight.toFixed(0)}%`;
              }
              const textLayer = figma.createText();
              textLayer.x = selection.x;
              textLayer.y = selection.y + selection.height;
              textLayer.characters = resultString;
              textLayer.fontSize = fontSize;
            } else {
              throw new Error("Unknown action.");
            }
            resolve({ success: true });
          }));
        } catch (err) {
          reject({ success: false });
        }
      });
    });
  }
  function resetImageEffects(currentSelection) {
    currentSelection.forEach((selection) => {
      const newFills = [...selection.fills];
      const newImageFill = JSON.parse(JSON.stringify(newFills[0]));
      newImageFill.blendMode = "NORMAL";
      newImageFill.filters = {
        contrast: 0,
        exposure: 0,
        highlights: 0,
        saturation: 0,
        shadows: 0,
        temperature: 0,
        tint: 0
      };
      newImageFill.opacity = 1;
      newImageFill.rotation = 0;
      newImageFill.visible = true;
      newFills[0] = newImageFill;
      selection.fills = newFills;
    });
  }

  // plugin-src/code.ts
  figma.loadFontAsync({ family: "Inter", style: "Regular" });
  figma.showUI(__html__, { width: 200, height: 84, themeColors: true });
  figma.ui.onmessage = (msg) => {
    const currentSelection = figma.currentPage.selection;
    if (msg.handleImage)
      handleImage(msg, currentSelection);
    if (msg.undo)
      figma.triggerUndo();
    handleTest(msg, currentSelection);
  };
})();
