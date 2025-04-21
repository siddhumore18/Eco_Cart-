// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAtT6yy_MVe5BUouOGALQtykPFpBRn6Kjs",
    authDomain: "eco-cart2.firebaseapp.com",
    projectId: "eco-cart2",
    storageBucket: "eco-cart2.firebasestorage.app",
    messagingSenderId: "346686441375",
    appId: "1:346686441375:web:a310f6b3c450f28ecc9faa",
    measurementId: "G-ZR943R24MF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const googleLoginBtn = document.getElementById('googleLoginBtn');

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        // Show loading state
        const loginSpinner = loginButton.querySelector('.animate-spin');
        const loginText = loginButton.querySelector('span');
        loginText.classList.add('opacity-0');
        loginSpinner.classList.remove('hidden');
        loginButton.disabled = true;

        try {
            // Sign in with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Update user data in Firestore
            await updateUserLoginData(user);
            
            // Redirect to account page to display user data
            window.location.href = 'Account.html';
        } catch (error) {
            console.error('Login error:', error);
            // Show error message
            const errorMessage = error.code === 'auth/wrong-password' ? 
                'Invalid password' : 
                error.code === 'auth/user-not-found' ? 
                'No account found with this email' : 
                'An error occurred during login';
            
            document.getElementById('passwordError').textContent = errorMessage;
            document.getElementById('passwordError').classList.remove('hidden');
        } finally {
            // Reset loading state
            loginText.classList.remove('opacity-0');
            loginSpinner.classList.add('hidden');
            loginButton.disabled = false;
        }
    });

    // Handle Google login
    googleLoginBtn.addEventListener('click', async function() {
        const googleSpinner = this.querySelector('.animate-spin');
        const googleText = this.querySelector('span');
        googleText.classList.add('opacity-0');
        googleSpinner.classList.remove('hidden');
        this.disabled = true;

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // Update user data in Firestore
            await updateUserLoginData(user);
            
            // Redirect to account page to display user data
            window.location.href = 'Account.html';
        } catch (error) {
            console.error('Google login error:', error);
            document.getElementById('passwordError').textContent = 'Google login failed. Please try again.';
            document.getElementById('passwordError').classList.remove('hidden');
        } finally {
            googleText.classList.remove('opacity-0');
            googleSpinner.classList.add('hidden');
            this.disabled = false;
        }
    });

    // Function to update user login data in Firestore
    async function updateUserLoginData(user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            // Update existing user document with current data
            const userData = userDoc.data();
            await setDoc(userRef, {
                name: user.displayName || userData.name || '',
                email: user.email,
                lastLogin: serverTimestamp(),
                status: 'active',
                phone: userData.phone || '',
                address: userData.address || '',
                city: userData.city || '',
                state: userData.state || '',
                postalCode: userData.postalCode || '',
                preferences: {
                    emailNotifications: userData.preferences?.emailNotifications ?? true,
                    smsNotifications: userData.preferences?.smsNotifications ?? true
                },
                profileImage: userData.profileImage || '',
                updatedAt: serverTimestamp()
            }, { merge: true });
        } else {
            // Create new user document with default values
            await setDoc(userRef, {
                name: user.displayName || '',
                email: user.email,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                status: 'active',
                phone: '',
                address: '',
                city: '',
                state: '',
                postalCode: '',
                preferences: {
                    emailNotifications: true,
                    smsNotifications: true
                },
                profileImage: '',
                updatedAt: serverTimestamp()
            });
        }
    }
});  