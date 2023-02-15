import https from "https";

const url = "https://perfect-cow-14.telebit.io/api/v1/";
https.globalAgent.options.https.get(url, response => {
  console.log(response);
});
