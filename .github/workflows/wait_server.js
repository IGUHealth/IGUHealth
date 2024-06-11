async function checkServer() {
  const url = process.argv[2];
  let pollTotal = process.argv[3] ?? 40;
  let pollNumber = 0;

  let status = null;
  while (
    pollNumber < pollTotal &&
    (typeof status !== "number" || status >= 400)
  ) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await fetch(url);
      status = response.status;
      console.log(`Server status: ${status}`);
    } catch (e) {
      console.log(`WAITING FOR SERVER TO START... Attempt #${pollNumber}`);
    } finally {
      pollNumber++;
    }
  }
  if (typeof status !== "number" || status >= 400) {
    throw new Error("Server Failed to start");
  }
}

checkServer();
