async function handleTest (msg, currentSelection) {

  if (msg.test) {
    console.log("Testing...")
    console.log(currentSelection[0])
  }
}

export { handleTest }


