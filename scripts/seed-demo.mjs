import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAmg6VIEsYEtvZWE21-oDbsXs3YM-F2A2g",
  authDomain: "blynk-11e7c.firebaseapp.com",
  projectId: "blynk-11e7c",
  storageBucket: "blynk-11e7c.firebasestorage.app",
  messagingSenderId: "648096808910",
  appId: "1:648096808910:web:1d12b51d84d202ba34359f",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const DEMO_EMAIL = "demo@blynk.app";
const DEMO_PASSWORD = "Password123!";
const DEMO_USERNAME = "demo";
const DEMO_NAME = "Alex Rivera";
const DEMO_BIO = "Senior Full-Stack Engineer & Designer. Building minimal, human-centered web software.";

async function seed() {
  console.log("Seeding recruiter demo account...");

  let user;
  try {
    const cred = await createUserWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASSWORD);
    user = cred.user;
    console.log(`Created new auth user: ${user.uid} (${DEMO_EMAIL})`);
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      console.log("Demo user already exists in Auth, signing in...");
      const cred = await signInWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASSWORD);
      user = cred.user;
      console.log(`Signed in existing user: ${user.uid}`);
    } else {
      console.error("Auth error:", err.code, err.message);
      if (err.code === "auth/operation-not-allowed") {
        console.error("\n>>> ACTION REQUIRED: Go to Firebase Console -> Authentication -> Sign-in method -> Enable 'Email/Password' <<<\n");
      }
      process.exit(1);
    }
  }

  const userId = user.uid;

  // 1. Claim username (if not already claimed)
  const unameDoc = await getDoc(doc(db, "usernames", DEMO_USERNAME));
  if (!unameDoc.exists()) {
    console.log(`Claiming username /${DEMO_USERNAME}...`);
    await setDoc(doc(db, "usernames", DEMO_USERNAME), { userId });
  } else {
    console.log(`Username /${DEMO_USERNAME} already claimed.`);
  }

  // 2. Set user profile
  console.log("Creating user profile document...");
  await setDoc(doc(db, "users", userId), {
    userId,
    username: DEMO_USERNAME,
    displayName: DEMO_NAME,
    bio: DEMO_BIO,
    profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    createdAt: Date.now(),
    published: true,
  });

  // 3. Set default theme (Sage Minimal)
  console.log("Configuring Sage Minimal theme...");
  await setDoc(doc(db, "themes", userId), {
    userId,
    presetId: "sage-minimal",
    background: {
      type: "color",
      color: "#EAEFE9",
      color2: "#DDE5DC",
      gradientAngle: 180,
      imageUrl: "",
      overlay: 0.2,
    },
    font: {
      family: "Space Grotesk",
      bodyFamily: "Inter",
      color: "#1F2922",
      mutedColor: "#5A6B5F",
      size: "md",
    },
    button: {
      shape: "soft",
      fill: "solid",
      bgColor: "#1F2922",
      textColor: "#EAEFE9",
      borderColor: "#1F2922",
      spacing: "normal",
      iconStyle: "auto",
    },
    layout: "stack",
    animation: "fade",
    avatarShape: "circle",
  });

  // 4. Create sample links
  console.log("Populating portfolio links...");
  const sampleLinks = [
    { title: "Selected Works & Case Studies", url: "https://github.com", order: 0, isActive: true },
    { title: "Open Source Projects (GitHub)", url: "https://github.com", order: 1, isActive: true },
    { title: "Read My Technical Essays", url: "https://medium.com", order: 2, isActive: true },
    { title: "Connect on LinkedIn", url: "https://linkedin.com", order: 3, isActive: true },
    { title: "Book an Advisory Call", url: "https://cal.com", order: 4, isActive: true },
  ];

  for (const link of sampleLinks) {
    const linkRef = doc(collection(db, "users", userId, "links"));
    await setDoc(linkRef, link);
  }

  console.log("\n Successfully seeded demo account!");
  console.log("-----------------------------------------");
  console.log(`Public URL:     https://<your-vercel-domain>/${DEMO_USERNAME}`);
  console.log(`Login Email:    ${DEMO_EMAIL}`);
  console.log(`Login Password: ${DEMO_PASSWORD}`);
  console.log("-----------------------------------------\n");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
