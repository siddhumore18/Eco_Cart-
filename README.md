EcoCart 🌿 – Setup Guide & Common Fixes
Welcome to EcoCart! This project helps users discover and compare eco-friendly products using AI-powered ratings and intuitive UI.

📦 Prerequisites
Make sure you have the following installed:

Node.js (LTS)

Git

A code editor like VS Code

🚀 Getting Started
1. Clone the repository
bash
Copy
Edit
git clone https://github.com/your-username/EcoCart.git
cd EcoCart
2. Install dependencies
bash
Copy
Edit
npm install
npm install @google/generative-ai     
3. Create a .env file
Create a .env file in the root directory:

bash
Copy
Edit
touch .env
Paste the following inside .env (replace with your actual keys):

env
Copy
Edit
SERP_API_KEY=your_serpapi_key_here
GEMINI_API_KEY=your_gemini_api_key_here
⚠️ Never commit .env to GitHub!
It contains your private API keys.




the replase your apis keys 

and run in terminal 
#node server.js
