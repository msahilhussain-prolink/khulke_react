# **Khul Ke**

Khul Ke is a conversation platform designed to give users a 360 degree approach to discuss topics of their interests with complete freedom.

**khule_react** is a web repository built using ReactJS.

## 🚀 **Production Website**

**[https://www.khulke.com](https://www.khulke.com)**

## 🎯 **Features**

Here're some of the project's best features :

- Townhall

  1. Share your thoughts with friends
  2. Connect with like-minded people
  3. Grow your network

- Roundtable

  1.  Conduct a conversation
  2.  Host meetings classes lectures and more
  3.  Explore and contribute to a variety of hot topics

- Yapp

  1.  Express yourself with images files text and more
  2.  Converse using auido and video calls
  3.  Talk to your friends followers and other users

- Profile
  1.  Sign up with your phone number or e-mail ID
  2.  Customize your profile
  3.  Build a community

## ⚙️ **SetUp**

### **Prerequisites**

Before you begin, ensure you have met the following requirements:

1. Laptop/Desktop with minimum 4core CPU, 16gb RaM and 128gb ssd with ubuntu/mac/windows
2. Google Chrome or firefox latest version is recommended for frontend debugging
3. You can download Visual Studio Code from the **[official website](https://code.visualstudio.com/download)** by selecting the right platform.
4. **[Jira](https://www.atlassian.com/software/jira)** and **[Bitbucket](https://bitbucket.org/)** repository access
5. Node installed on your computer. You can download Node at **[nodejs.org](https://nodejs.org/)**. Create React App requires a Node version of at least 14.0.0 version or above.
6. A package manager called npm. It is automatically included in your installation of Node.
7. Install Git Cli.

### **Installation :**

1. In the repository, select the Clone button.
2. Copy the clone command.
3. From a terminal window, change into the local directory where you want to clone your repository.

```
cd <path_to_your_home_directory>
```

4. Paste the command you copied from Bitbucket

```
git clone https://bitbucket.org/loktantram-admin/khulke_react.git
```

If the clone was successful, a new sub-directory appears on your local drive with the same name as the repository that you cloned.  
5. Change directory to sub-directory of cloned repository.

```
cd khulke_react
```

6. Install NPM packages:

```
npm i --legacy-peer-deps
```

**or**

```
npm install --legacy-peer-deps
```

7. Create Env folder inside **src** folder and add EnvCreds.json and firebaseCreds.json files.
8. Create Env folder inside **express_server** and add EnvCreds.json
9. Paste firebaseCreds.json in **public** folder

**Note : EnvCreds.json and firebaseCreds.json files will be provided to you by your peer developers.**

**Sample EnvCreds.json**

```go
{
  "REACT_APP_BASE_URL": "https://dev.useronboarding.khulke.com",
  "REACT_APP_USER_ONBOARDING_URL": "https://dev.useronboarding.khulke.com",
  "REACT_APP_BASE_URL_FOR_ROUNDTABLE": "https://dev.round-table.khulke.com/round-table",
  "REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1": "https://dev.round-table.khulke.com/round-table/v1",
  "POST_API_BASE_URL": "https://dev.node.khulke.com",
  "PANELIST_CHAT_API": "https://dev.upload.khulke.com",
  "REACT_APP_DEVICE_TYPE": "android",
  "REACT_APP_VAPID_ID": "*************************************",
  "AGORA_APP_ID": "********************************",
  "REACT_APP_BASE_URL_CLOUDFRONT": "https://khulkedev-public-cdn.s3.ap-south-1.amazonaws.com",
  "RECORDING_USERNAME": "********",
  "RECORDING_PASSWORD": "************",
  "gtmIdString": "*********",
  "STATIC_TOKEN": "**********************************",
  "MAINTAINANCE_URL": "https://ghc7seyv16.execute-api.ap-south-1.amazonaws.com/beta/server/maintenance",
  "MAINTAINANCE_KEY": "*************************************",
}
```

**Sample firebaseCreds.json**

```go
{
  "apiKey": "*******************************",
  "authDomain": "gutrgoo-adee1.firebaseapp.com",
  "databaseURL": "https://gutrgoo-adee1-default-rtdb.firebaseio.com",
  "projectId": "**********",
  "storageBucket": "gutrgoo-adee1.appspot.com",
  "messagingSenderId": "************",
  "appId": "*********************************",
  "measurementId": "***********"
}
```

### **Available Scripts**

In the project directory, you can run:

1. Runs the app in the development mode.

   Open **[http://localhost:3000](http://localhost:3000)** to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console.

```
npm start
```

2. Launches the test runner in the interactive watch mode.

```
npm test
```

3. Builds the app for production to the `build` folder.
   It correctly bundles React in production mode and optimizes the build for the best performance.

   The build is minified and the filenames include the hashes. Your app is ready to be deployed!

```
npm run build
```

4. **Note: this is a one-way operation. Once you `eject`, you can’t go back!**

   If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

   Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

   You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

```
npm run eject
```

## **💻 Contributors**

Thanks to the following people who have contributed to this project:

1. **[Govind Sharma](gobind@loktantram.com) ( Project Lead )**
2. **[Shivani Mulik](shivani.kon@loktantram.com)**
3. **[Kamal Jyotwal](kamal.kon@loktantram.com)**
4. **[Sandy Modi](sandy.ref@loktantram.com)**
5. **[Indal Kumar](indal.kon@loktantram.com)**
6. Abhishek Iyengar

## **🛠️ Built with**

Technologies used in the project:

1. HTML5
2. CSS3
3. Javascript
4. ReactJS (17.0.2)

Khulke uses certain third party libraries:

1. For Yapp, we use **[CometChat](https://cometchat-docs.developerhub.io/docs/home)**
2. For RoundTable, we use **[Agora](https://www.agora.io/en/blog/building-a-video-chat-app-using-react-hooks-and-agora/)**
3. For marketing purpose, we use **[MoEngage](https://developers.moengage.com/hc/en-us/categories/360006308092-Web-SDK)**
4. For UI, we use **[MUI](https://mui.com/)**
5. For animation, we use **[LottieFile](https://lottiefiles.com/)**

## **⚠️ License**

Copyright (c) 2015-present **[Loktantram](https://loktantram.com/)**, **[Khulke Team](https://khulke.com/)** and Contributors.

## **☕ Support**

For any issues you face with installation and integration contact us at **[Web Team](f5b99e1f.loktantram.com@in.teams.ms)** MS Teams Channel and for licenses and product features contact at **[Product Team](product@loktantram.com)**. You can also send feedback on above email ids.
