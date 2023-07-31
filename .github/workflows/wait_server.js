async function checkServer() {
  const url = process.argv[2];
  let status = null;
  while (typeof status !== "number" || status >= 400) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await fetch(url);
      status = response.status;
      console.log(`Server status: ${status}`);
    } catch (e) {
      console.log("WAITING FOR SERVER TO START...");
    }
  }
}

checkServer();
