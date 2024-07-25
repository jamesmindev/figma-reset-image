import { handleTest } from "./handleTest";
import { handleImage } from "./handleImage";

figma.loadFontAsync({ family: "Inter", style: "Regular" })

figma.showUI(__html__, { width: 200, height: 84, themeColors: true });

// Respond to UI messages
figma.ui.onmessage = (msg) => {  
  const currentSelection = figma.currentPage.selection

  if (msg.handleImage) handleImage(msg, currentSelection)
  if (msg.undo) figma.triggerUndo()

  handleTest(msg, currentSelection)
};
