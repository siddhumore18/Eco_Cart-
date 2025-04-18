// Google CSE script (optional – not needed if using SerpAPI only)
window.onload = function () {
    const gcse = document.createElement("script");
    gcse.type = "text/javascript";
    gcse.async = true;
    gcse.src = "https://cse.google.com/cse.js?cx=" + encodeURIComponent("YOUR_SEARCH_ENGINE_ID");
    document.head.appendChild(gcse);
  };
  
  // Navigation highlight
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
      this.classList.add("active");
    });
  });
  
  // Sidebar toggle
  function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("main-content");
    const toggleIcon = document.querySelector(".sidebar-toggle i");
  
    sidebar.classList.toggle("collapsed");
    mainContent.classList.toggle("expanded");
  
    toggleIcon.classList.toggle("fa-chevron-left");
    toggleIcon.classList.toggle("fa-chevron-right");
  }
  
  // Helper: Eco rating
  function getEcoInfo(product) {
    const title = (product.title || "").toLowerCase();
    const desc = (product.description || "").toLowerCase(); // Optional, some results have it
  
    let score = 0;
    const badges = [];
  
    if (title.includes("recyclable") || desc.includes("recyclable")) {
      badges.push("♻️ Recyclable");
      score += 3;
    }
  
    if (title.includes("sustainable") || desc.includes("sustainable")) {
      badges.push("🌱 Sustainable Material");
      score += 3;
    }
  
    if (title.includes("plastic-free") || desc.includes("plastic-free") || title.includes("zero plastic")) {
      badges.push("🚫 Plastic-Free");
      score += 2;
    }
  
    if (title.includes("bamboo") || title.includes("organic") || title.includes("eco") || title.includes("biodegradable")) {
      badges.push("🍃 Eco Material");
      score += 2;
    }
  
    return {
      score: Math.min(score, 50),
      badges
    };
  }
  
  
  // Convert USD to INR
  function convertUSDToINR(usd) {
    const exchangeRate = 83;
    return `₹${(usd * exchangeRate).toFixed(0)}`;
  }
  
  // Render a product card
  function createProductCard(product) {
    const ecoInfo = getEcoInfo(product);
    const rawPrice = parseFloat(product.price?.replace(/[^0-9.]/g, "")) || 0;
    const convertedPrice = rawPrice ? convertUSDToINR(rawPrice) : "N/A";
    const safeLink = product.link?.startsWith("http") ? product.link : "#";
  
    const div = document.createElement("div");
    div.classList.add("product-card");
  
    // Badge HTML
    const badgeHtml = ecoInfo.badges.map(badge => `<span class="badge bg-success bg-opacity-10 text-success m-1">${badge}</span>`).join(" ");
  
    // Visual bar rating (10 blocks)
    const ratingBlocks = 
    `<i style="color:green" class="fa-solid fa-leaf"></i>`.repeat(ecoInfo.score) +
    `<i style="color:#ccc" class="fa-solid fa-leaf"></i>`.repeat(5 - ecoInfo.score); // was 10
    
    div.innerHTML = `
      <img src="${product.thumbnail || product.image || 'https://via.placeholder.com/200'}" alt="${product.title}" style="width:100%; height:200px; object-fit:cover; border-radius:8px;">
      <h4 class="mt-2">${product.title}</h4>
      <p><strong>Price:</strong> ${convertedPrice}</p>
      <p><strong>Eco Rating:</strong> ${ecoInfo.score} / 10</p>
      <div style="font-size: 1rem">${ratingBlocks}</div>
      <div class="mt-2">${badgeHtml}</div>
      <a href="${safeLink}" target="_blank" class="btn btn-sm btn-outline-success mt-3">
        ${safeLink === "#" ? "Unavailable" : "View Product"}
      </a>
    `;
  
    return div;
  }
  
  
  
  // Fetch initial 30-40 products and render in containers
  fetch("/api/products")
    .then(res => res.json())
    .then(data => {
      const ecoContainer = document.getElementById("eco-products");
      const otherContainer = document.getElementById("other-products");
  
      const ecoIds = new Set(data.ecoFriendly.map(p => p.title));
      const others = data.all.filter(p => !ecoIds.has(p.title));
  
      data.ecoFriendly.forEach(product => {
        ecoContainer.appendChild(createProductCard(product, true));
      });
  
      others.forEach(product => {
        otherContainer.appendChild(createProductCard(product, false));
      });
    })
    .catch(error => {
      console.error("Failed to fetch product data:", error);
    });
  
  
  // ✅ Real-time search functionality
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const searchResults = document.getElementById("search-results");
  
  // Fetch search results from /api/search?q=...
  function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;
  
    console.log("Searching for:", query);
  
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(products => {
        console.log("Search Results:", products);
        const container = document.getElementById("search-injected");
        container.innerHTML = ""; // Clear previous
  
        if (!Array.isArray(products) || products.length === 0) {
          container.innerHTML = "<p>No matching product found.</p>";
          return;
        }
  
        products.forEach(product => {
          container.appendChild(createProductCard(product));
        });
  
        window.scrollTo({ top: container.offsetTop - 80, behavior: "smooth" });
      })
      .catch(err => {
        console.error("Search fetch error:", err);
      });
  }
  

  
  searchBtn.addEventListener("click", handleSearch);
  searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") handleSearch();
  });
  