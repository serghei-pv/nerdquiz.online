self.addEventListener("install", serviceWorker);

function serviceWorker() {
  console.log("Hello world from the Service Worker");
}
