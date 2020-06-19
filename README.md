# Peek-A-Boo
## - A Video Conferencing App.

This is Video Conference Calling app built using React Native and [ConnectyCube](https://connectycube.com) Open Source Apis.

Project contains the following features implemented:

- User authorization
- Video calls up to 4 users
- Mute/unmute microphone
- Mute/unmute video
- Switch camera
- Snack bars to notify users about changes

## Screenshots

<kbd><img alt="Video chat code sample, Login Screen" src="https://developers.connectycube.com/docs/_images/code_samples/reactnative/reactnative_codesample_video_login.PNG" width="200" /></kbd> <kbd><img alt="Video chat, select users" src="https://developers.connectycube.com/docs/_images/code_samples/reactnative/reactnative_codesample_video_select_users.PNG" width="200" /></kbd> <kbd><img alt="Video chat Screen" src="https://developers.connectycube.com/docs/_images/code_samples/reactnative/reactnative_codesample_video_video.PNG" width="200" /></kbd>

## Quick start and develop

Quick start [React Native](https://facebook.github.io/react-native/docs/getting-started.html) app.

Prepare environment for React Native and:

1. Clone the project;
2. Install node_modules: `npm install`;
3. Run `npm run ios` or `npm run android`.
4. Build `npm build ios` or `npm run android release`.

## Running on a device

The above command will automatically run your app on the iOS Simulator by default. If you want to run the app on an actual physical iOS device, please follow the instructions [here](https://facebook.github.io/react-native/docs/running-on-device).

## Build your own VideoChat app

To make the sample works for your own app, please do the following:

1.  Register new account and application at `https://admin.connectycube.com` and then put Application credentials from 'Overview' page into `src/config.js` file:

    ```javascript
    export const credentials = {
      appId: 0,
      authKey: "",
      authSecret: ""
    };
    ```

2.  At `https://admin.connectycube.com`, create from 2 to 4 users in 'Users' module and put them into `src/config.js` file:

    ```javascript
    export const users = [
      {
        id: 1,
        name: "User1",
        login: "videouser1",
        password: "videouser1",
        color: "#34ad86"
      },
      {
        id: 2,
        name: "User2",
        login: "videouser2",
        password: "videouser2",
        color: "#077988"
      },
      {
        id: 3,
        name: "User3",
        login: "videouser3",
        password: "videouser3",
        color: "#13aaae"
      },
      {
        id: 4,
        name: "User4",
        login: "videouser4",
        password: "videouser4",
        color: "#056a96"
      }
    ];
    ```

3. Install node modules - `npm install`
4. Run `npm run ios` or `npm run android`.
5. Build `npm build ios` or `npm build android`.

Created with the help of ConnectyCube React Native app code samples.

# Author: [Pavan Aditya M S](https://pavanaditya.com)