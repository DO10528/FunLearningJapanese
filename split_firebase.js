const fs = require('fs');
const path = require('path');

const dir = '.';

function getHtmlFiles(base, result) {
  result = result || [];
  const files = fs.readdirSync(base);
  files.forEach(file => {
    const newbase = path.join(base, file);
    if(fs.statSync(newbase).isDirectory()) {
      if(file !== '.git' && file !== 'assets' && file !== 'css' && file !== 'js' && file !== 'data' && file !== 'node_modules') {
         result = getHtmlFiles(newbase, result);
      }
    } else {
      if(file.endsWith('.html')) result.push(newbase);
    }
  });
  return result;
}

const htmlFiles = getHtmlFiles(dir);

let firebaseJs = `import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDF18...", 
    authDomain: "japanese-fun-learning.firebaseapp.com",
    projectId: "japanese-fun-learning",
    storageBucket: "japanese-fun-learning.firebasestorage.app",
    messagingSenderId: "548074697960",
    appId: "1:548074697960:web:4f207ed1f0f4ea583a6963",
    measurementId: "G-4JXY1T51SV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
`;

fs.writeFileSync(path.join('js', 'firebase-config.js'), firebaseJs, 'utf8');

// Also create auth.js for common auth operations if needed
// Or let's just create firestore.rules

let firestoreRules = `rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /{document=**} {
      allow read, write: if false; // Default deny
    }
  }
}
`;
fs.writeFileSync('firestore.rules', firestoreRules, 'utf8');

let firebaseJson = `{
  "firestore": {
    "rules": "firestore.rules"
  },
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
`;
fs.writeFileSync('firebase.json', firebaseJson, 'utf8');

console.log('Firebase config, rules, and json created.');
