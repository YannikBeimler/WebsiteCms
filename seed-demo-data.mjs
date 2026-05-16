import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, doc, setDoc, collection } from "firebase/firestore";
import { getAuth, connectAuthEmulator, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Emulator Setup
const app = initializeApp({ projectId: "demo-website-cms", apiKey: "demo-key" });
const db = getFirestore(app);
connectFirestoreEmulator(db, "localhost", 8080);
const auth = getAuth(app);
connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });

async function getOrCreateUser(email, password, role) {
    let uid;
    try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        uid = cred.user.uid;
        console.log(`Created new user: ${email}`);
    } catch(e) {
        if (e.code === 'auth/email-already-in-use') {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            uid = cred.user.uid;
            console.log(`User ${email} already exists, signed in.`);
        } else {
            throw e;
        }
    }
    
    // Save user profile in Firestore
    await setDoc(doc(db, "users", uid), {
        uid: uid,
        email: email,
        displayName: email.split('@')[0].toUpperCase(),
        role: role
    });
    return uid;
}

async function seed() {
    console.log("Seeding Complete Demo Data...");

    try {
        // --- SITES ---
        console.log("Creating Sites...");
        
        // Site 1: TechCorp (localhost)
        const site1Ref = doc(collection(db, "sites"));
        const site1Id = site1Ref.id;
        await setDoc(site1Ref, {
            id: site1Id,
            url: "localhost",
            name: "TechCorp Corporate",
            layoutOptions: {
                primaryColor: "#004080",
                accentColor: "#ff9900",
                fontFamily: "Roboto, sans-serif",
                fontAlignment: "left"
            }
        });

        // Site 2: Creative Portfolio (127.0.0.1)
        const site2Ref = doc(collection(db, "sites"));
        const site2Id = site2Ref.id;
        await setDoc(site2Ref, {
            id: site2Id,
            url: "127.0.0.1",
            name: "Creative Portfolio",
            layoutOptions: {
                primaryColor: "#212121",
                accentColor: "#e91e63",
                fontFamily: "Georgia, serif",
                fontAlignment: "center"
            }
        });

        // --- USERS ---
        console.log("Creating Users...");
        
        // 1. Global Admin (Can edit anything)
        await getOrCreateUser("admin@demo.local", "password123", {
            isAdmin: true,
            siteGroups: []
        });

        // 2. Editor for TechCorp (Can only edit localhost)
        await getOrCreateUser("editor_tech@demo.local", "password123", {
            isAdmin: false,
            siteGroups: [site1Id]
        });

        // 3. Editor for Creative Portfolio (Can only edit 127.0.0.1)
        await getOrCreateUser("editor_creative@demo.local", "password123", {
            isAdmin: false,
            siteGroups: [site2Id]
        });

        // --- PAGES: TechCorp (localhost) ---
        console.log("Creating Pages for TechCorp...");

        // TechCorp: Internal (Hidden from nav)
        const tHidden = doc(collection(db, "sites", site1Id, "pages"));

        // TechCorp: Home
        const tHome = doc(collection(db, "sites", site1Id, "pages"));
        await setDoc(tHome, {
            id: tHome.id, parentPageId: "",
            name: "Startseite",
            content: `# Willkommen bei TechCorp\n\nWir entwickeln die Software von morgen.\n\nDies ist die Startseite. Schauen Sie sich unsere Produkte an.\n\n[Zum internen Handbuch](/page/${tHidden.id})`,
            showInNavigation: true, showOnParent: false, sortNumber: 0,
            layoutOptions: { fontAlignment: "center" } // Overrides site layout
        });

        // TechCorp: Products
        const tProd = doc(collection(db, "sites", site1Id, "pages"));
        await setDoc(tProd, {
            id: tProd.id, parentPageId: "",
            name: "Produkte",
            content: "# Unsere Produktlinien\n\nHier finden Sie eine Übersicht aller Angebote.",
            showInNavigation: true, showOnParent: false, sortNumber: 1,
            layoutOptions: {}
        });

        // TechCorp: Products -> Software (Child)
        const tProdSoft = doc(collection(db, "sites", site1Id, "pages"));
        await setDoc(tProdSoft, {
            id: tProdSoft.id, parentPageId: tProd.id,
            name: "Software-Lösungen",
            content: "### Software\nWir bieten maßgeschneiderte Cloud-Lösungen und KI-Integrationen an.",
            showInNavigation: false, showOnParent: true, sortNumber: 0, // Rendered on Products page
            layoutOptions: {}
        });

        // TechCorp: Products -> Hardware (Child)
        const tProdHard = doc(collection(db, "sites", site1Id, "pages"));
        await setDoc(tProdHard, {
            id: tProdHard.id, parentPageId: tProd.id,
            name: "Hardware-Systeme",
            content: "### Hardware\nHochleistungsserver für Ihr Rechenzentrum.",
            showInNavigation: false, showOnParent: true, sortNumber: 1, // Rendered on Products page
            layoutOptions: {}
        });

        await setDoc(tHidden, {
            id: tHidden.id, parentPageId: "",
            name: "Internes Handbuch",
            content: "# Internes Handbuch\n\nHier finden Sie interne Dokumentationen und Richtlinien für Mitarbeiter. Diese Seite taucht nicht in der Navigation auf.",
            showInNavigation: false, showOnParent: false, sortNumber: 2,
            layoutOptions: {}
        });


        // --- PAGES: Creative Portfolio (127.0.0.1) ---
        console.log("Creating Pages for Creative Portfolio...");

        const cHome = doc(collection(db, "sites", site2Id, "pages"));
        await setDoc(cHome, {
            id: cHome.id, parentPageId: "",
            name: "Home",
            imageUrl: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80",
            content: "# John Doe - Art Director\n\nWelcome to my creative space. I design visual experiences.",
            showInNavigation: true, showOnParent: false, sortNumber: 0,
            layoutOptions: {}
        });

        const cGallery = doc(collection(db, "sites", site2Id, "pages"));
        await setDoc(cGallery, {
            id: cGallery.id, parentPageId: "",
            name: "Gallery",
            content: "## Selected Works\n\nHere are some of my recent projects. (In a real app, you would add image components here).",
            showInNavigation: true, showOnParent: false, sortNumber: 1,
            layoutOptions: {}
        });

        console.log("✅ Complete Demo Data Seeding Finished!");
        console.log("-----------------------------------------");
        console.log("SITE 1: TechCorp");
        console.log("URL: http://localhost:4200");
        console.log("Admin: admin@demo.local (pw: password123)");
        console.log("Editor: editor_tech@demo.local (pw: password123)");
        console.log("-----------------------------------------");
        console.log("SITE 2: Creative Portfolio");
        console.log("URL: http://127.0.0.1:4200");
        console.log("Admin: admin@demo.local (pw: password123)");
        console.log("Editor: editor_creative@demo.local (pw: password123)");
        console.log("-----------------------------------------");
        
        process.exit(0);

    } catch (error) {
        console.error("❌ Error seeding data: ", error);
        process.exit(1);
    }
}

seed();
