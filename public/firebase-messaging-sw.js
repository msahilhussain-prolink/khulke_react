// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-database.js");

// Initialize the Firebase app in the service worker by passing the generated config
//!DEV

fetch("/firebaseCreds.json")
  .then((res) => res.json())
  .then((data) => {
    try {
      const firebaseConfig = data;
      firebase.initializeApp(firebaseConfig);
    } catch (e) {
      console.log("ERROR", e);
    }
    // Retrieve firebase messaging
    if (firebase.messaging.isSupported()) {
      const messaging = firebase.messaging();
      messaging.onBackgroundMessage(function (payload) {
        console.log("Received background message ", payload);

        const notificationTitle = payload.notification.title;
        const notificationOptions = {
          body: payload.notification.body,
        };

        self.registration.showNotification(
          notificationTitle,
          notificationOptions
        );
      });
    }
  })
  .catch((e) => {
    console.log("could not register firebase ", e);
  });
