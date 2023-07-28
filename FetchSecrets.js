const AWS = require("aws-sdk");
const fs = require("fs");

AWS.config.update({
  accessKeyId: "",
  secretAccessKey: "",
  region: "ap-south-1",
});

const region = "ap-south-1";
const client = new AWS.SecretsManager({ region });

//change this to change env file fetching secrets without using docker [stage,perf,beta,dev]
const defaultEnv = "dev";

// Don't forget to change this for different environment REACT_ENV is passed from the docker file
// Change value from Dockerfile for dev,stage,beta
const env_sec_id = `react-${process.env.REACT_ENV || defaultEnv}-env`;
const firebase_sec_id = `react-${process.env.REACT_ENV || defaultEnv}-firebase`;

// will fetch env data from aws secret manager
function fetchEnvironmentVariables() {
  client.getSecretValue({ SecretId: env_sec_id }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      //parsing the fetched data into JSON
      const secretsJSON = data.SecretString;
      fs.writeFile(
        "./src/Env/EnvCreds.json",
        secretsJSON,
        { flag: "w+" },
        (err) => {
          console.log(err);
        }
      );

      //this is to write envcreds file inside express server so that we can perform anonymous api calls
      fs.writeFile(
        "./express-server/EnvFiles/EnvCreds.json",
        secretsJSON,
        { flag: "w+" },
        (err) => {
          console.log(err);
        }
      );
    }
  });
}

function fetchFirebaseCreds() {
  client.getSecretValue({ SecretId: firebase_sec_id }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      //parsing the fetched data into JSON
      const secretsJSON = data.SecretString;
      fs.writeFile(
        "./src/Env/firebaseCreds.json",
        secretsJSON,
        { flag: "w+" },
        (err) => {
          console.log(err);
        }
      );

      //this is to write firebasecreds.json in public folder so that we can register serviceworker
      fs.writeFile(
        "./public/firebaseCreds.json",
        secretsJSON,
        { flag: "w+" },
        (err) => {
          console.log(err);
        }
      );
    }
  });
}

// check if env file exists or not
fetchEnvironmentVariables();
fetchFirebaseCreds();
