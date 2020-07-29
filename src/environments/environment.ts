// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: "AIzaSyA320XeyhkYwbnoTY8JS96AGYskARdmerU",
    authDomain: "ludocaredev.firebaseapp.com",
    databaseURL: "https://ludocaredev.firebaseio.com",
    projectId: "ludocaredev",
    storageBucket: "ludocaredev.appspot.com",
    messagingSenderId: "963387545552",
    appId: "1:963387545552:web:8e2155592bc078a9ba4bd5",
    measurementId: "G-BCQWPJBVFR"
  },
  sessionMinute: 600, //600 = 10 min
  tassoLudopatia : 70,
  user: "admin",
  password: "Nesea01" 
};
