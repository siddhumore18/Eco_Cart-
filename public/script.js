// // Sidebar toggle
// function toggleSidebar() {
//   const sidebar = document.getElementById("sidebar");
//   const mainContent = document.getElementById("main-content");
//   const toggleIcon = document.querySelector(".sidebar-toggle i");

//   sidebar.classList.toggle("collapsed");
//   mainContent.classList.toggle("expanded");

//   toggleIcon.classList.toggle("fa-chevron-left");
//   toggleIcon.classList.toggle("fa-chevron-right");
// }

// // Eco info scorer
// function getEcoInfo(product) {
//   const title = (product.title || "").toLowerCase();
//   const desc = (product.description || "").toLowerCase();

//   let score = 0;
//   const badges = [];

//   if (title.includes("recyclable") || desc.includes("recyclable")) {
//     badges.push("♻️ Recyclable");
//     score += 1;
//   }
//   if (title.includes("sustainable") || desc.includes("sustainable")) {
//     badges.push("🌱 Sustainable Material");
//     score += 1;
//   }
//   if (title.includes("plastic-free") || desc.includes("plastic-free") || title.includes("zero plastic")) {
//     badges.push("🚫 Plastic-Free");
//     score += 1;
//   }
//   if (title.includes("bamboo") || title.includes("organic") || title.includes("eco") || title.includes("biodegradable")) {
//     badges.push("🍃 Eco Material");
//     score += 1;
//   }
//   if (title.includes("ethical") || desc.includes("ethical")) {
//     badges.push("🤝 Ethical Brand");
//     score += 1;
//   }

//   return {
//     score: Math.min(score, 5),
//     badges
//   }
// }

// // Currency conversion
// function convertUSDToINR(usd) {
//   const rate = 83;
//   return `₹${(usd * rate).toFixed(0)}`;
// }

// // Wishlist utils
// function getWishlist() {
//   return JSON.parse(localStorage.getItem("wishlist")) || [];
// }

// function checkIfWishlisted(product) {
//   const wishlist = getWishlist();
//   return wishlist.some(p => p.title === product.title);
// }

// function toggleWishlist(product, btnId) {
//   let wishlist = getWishlist();
//   const index = wishlist.findIndex(p => p.title === product.title);
//   const btn = document.getElementById(btnId);

//   if (index > -1) {
//     wishlist.splice(index, 1);
//     btn.classList.remove("btn-danger");
//     btn.classList.add("btn-outline-danger");
//     btn.innerText = "🤍 Add to Wishlist";
//   } else {
//     wishlist.push(product);
//     btn.classList.remove("btn-outline-danger");
//     btn.classList.add("btn-danger");
//     btn.innerText = "❤️ Wishlisted";
//   }

//   localStorage.setItem("wishlist", JSON.stringify(wishlist));
// }

// // Create product card with aligned buttons + wishlist state
// function createProductCard(product) {
//   const ecoInfo = getEcoInfo(product);
//   const rawPrice = parseFloat(product.price?.replace(/[^0-9.]/g, "")) || 0;
//   const convertedPrice = rawPrice ? convertUSDToINR(rawPrice) : "N/A";
//   const safeLink = product.link?.startsWith("http") ? product.link : "#";

//   const badgeHtml = ecoInfo.badges.map(b =>
//     `<span class="badge bg-success bg-opacity-10 text-success m-1">${b}</span>`).join("");

//   const ratingBlocks =
//     `<i style="color:green" class="fa-solid fa-leaf"></i>`.repeat(ecoInfo.score) +
//     `<i style="color:#ccc" class="fa-solid fa-leaf"></i>`.repeat(5 - ecoInfo.score);

//  // Helper function to create safe IDs
// function createSafeId(text) {
//   return 'btn-' + Array.from(text || '')
//     .map(char => char.charCodeAt(0).toString(36))
//     .join('')
//     .slice(0, 10);
// }

// // In your createProductCard function:
// const isWishlisted = checkIfWishlisted(product);
// const wishBtnId = createSafeId(product.id + product.title);  // Using both ID and title for uniqueness
//   const div = document.createElement("div");
//   div.classList.add("product-card");

//   div.innerHTML = `
//     <img src="${product.thumbnail || 'https://via.placeholder.com/200'}" alt="${product.title}" style="width:100%; height:200px; object-fit:cover; border-radius:8px;">
//     <h4 class="mt-2">${product.title}</h4>
//     <p><strong>Price:</strong> ${convertedPrice}</p>
//     <p><strong>Eco Score:</strong> ${ecoInfo.score} / 5</p>
//     <div style="font-size: 1.1rem">${ratingBlocks}</div>
//     <div class="mt-2">${badgeHtml}</div>
//     <div class="d-flex gap-2 mt-3">
//       <a href="${safeLink}" target="_blank" class="btn btn-sm btn-outline-success">View Product</a>
//       <button id="${wishBtnId}" class="btn btn-sm ${isWishlisted ? 'btn-outline-danger' : 'btn-outline-danger'}"
//         onclick='toggleWishlist(${JSON.stringify(product)}, "${wishBtnId}")'>
//         ${isWishlisted ? "❤️ Wishlisted" : "🤍 Add to Wishlist"}
//       </button>
//     </div>
//   `;

//   return div;
// }

// // Load homepage products
// fetch("/api/products")
//   .then(res => res.json())
//   .then(data => {
//     const ecoContainer = document.getElementById("eco-products");
//     const otherContainer = document.getElementById("other-products");

//     const ecoIds = new Set(data.ecoFriendly.map(p => p.title));
//     const others = data.all.filter(p => !ecoIds.has(p.title));

//     data.ecoFriendly.forEach(product => {
//       ecoContainer.appendChild(createProductCard(product));
//     });

//     others.forEach(product => {
//       otherContainer.appendChild(createProductCard(product));
//     });
//   })
//   .catch(error => {
//     console.error("Failed to fetch product data:", error);
//   });

// // Real-time search
// const searchInput = document.getElementById("search-input");
// const searchBtn = document.getElementById("search-btn");
// const searchResults = document.getElementById("search-results");

// function handleSearch() {
//   const query = searchInput.value.trim();
//   if (!query) return;

//   fetch(`/api/search?q=${encodeURIComponent(query)}`)
//     .then(res => res.json())
//     .then(products => {
//       const container = document.getElementById("search-injected");
//       container.innerHTML = "";

//       if (!Array.isArray(products) || products.length === 0) {
//         container.innerHTML = "<p>No matching product found.</p>";
//         return;
//       }

//       products.forEach(product => {
//         container.appendChild(createProductCard(product));
//       });

//       window.scrollTo({ top: container.offsetTop - 80, behavior: "smooth" });
//     })
//     .catch(err => {
//       console.error("Search fetch error:", err);
//     });
// }

// searchBtn.addEventListener("click", handleSearch);
// searchInput.addEventListener("keypress", e => {
//   if (e.key === "Enter") handleSearch();
// });


// // Sidebar toggle
// function toggleSidebar() {
//   const sidebar = document.getElementById("sidebar");
//   const mainContent = document.getElementById("main-content");
//   const toggleIcon = document.querySelector(".sidebar-toggle i");

//   sidebar.classList.toggle("collapsed");
//   mainContent.classList.toggle("expanded");

//   toggleIcon.classList.toggle("fa-chevron-left");
//   toggleIcon.classList.toggle("fa-chevron-right");
// }

// // Eco info scorer
// function getEcoInfo(product) {
//   const title = (product.title || "").toLowerCase();
//   const desc = (product.description || "").toLowerCase();

//   let score = 2;
//   const badges = [];

//   if (title.includes("recyclable") || desc.includes("recyclable")) {
//     badges.push("♻️ Recyclable");
//     score += 1;
//   }
//   if (title.includes("sustainable") || desc.includes("sustainable")) {
//     badges.push("🌱 Sustainable Material");
//     score += 1;
//   }
//   if (title.includes("plastic-free") || desc.includes("plastic-free") || title.includes("zero plastic")) {
//     badges.push("🚫 Plastic-Free");
//     score += 1;
//   }
//   if (title.includes("bamboo") || title.includes("organic") || title.includes("eco") || title.includes("biodegradable")) {
//     badges.push("🍃 Eco Material");
//     score += 1;
//   }
//   if (title.includes("ethical") || desc.includes("ethical")) {
//     badges.push("🤝 Ethical Brand");
//     score += 1;
//   }

//   return {
//     score: Math.min(score, 5),
//     badges
//   };
// }

// // Currency conversion
// function convertUSDToINR(usd) {
//   const rate = 83;
//   return `₹${(usd * rate).toFixed(0)}`;
// }

// // Wishlist utils
// function getWishlist() {
//   return JSON.parse(localStorage.getItem("wishlist")) || [];
// }

// function checkIfWishlisted(product) {
//   const wishlist = getWishlist();
//   return wishlist.some(p => p.id === product.id);
// }

// function toggleWishlist(product, btnId) {
//   let wishlist = getWishlist();
//   const productObj = typeof product === 'string' ? JSON.parse(product) : product;
//   const index = wishlist.findIndex(p => p.id === productObj.id);
//   const btn = document.getElementById(btnId);

//   if (index > -1) {
//     wishlist.splice(index, 1);
//     btn.classList.remove("btn-danger");
//     btn.classList.add("btn-outline-danger");
//     btn.innerHTML = "<i class='far fa-heart'></i> Add to Wishlist";
//   } else {
//     wishlist.push(productObj);
//     btn.classList.remove("btn-outline-danger");
//     btn.classList.add("btn-danger");
//     btn.innerHTML = "<i class='fas fa-heart'></i> Wishlisted";
//   }

//   localStorage.setItem("wishlist", JSON.stringify(wishlist));
// }

// // Create product modal with details and suggestions
// function showProductModal(product, allProducts) {
//   const productObj = typeof product === 'string' ? JSON.parse(product) : product;
//   const allProductsObj = typeof allProducts === 'string' ? JSON.parse(allProducts) : allProducts;
//   const ecoInfo = getEcoInfo(productObj);
//   const rawPrice = parseFloat(productObj.price?.replace(/[^0-9.]/g, "")) || 0;
//   const convertedPrice = rawPrice ? convertUSDToINR(rawPrice) : "N/A";

//   // Find related products (same category or similar tags)
//   const relatedProducts = allProductsObj.filter(p => 
//     p.id !== productObj.id && 
//     (p.category === productObj.category || 
//      (p.badges || []).some(b => (productObj.badges || []).includes(b)))
//     .slice(0, 4)); // Limit to 4 suggestions

//   const modalContent = `
//     <div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
//       <div class="modal-dialog modal-lg">
//         <div class="modal-content">
//           <div class="modal-header">
//             <h5 class="modal-title" id="productModalLabel">${escapeHtml(productObj.title || "Product")}</h5>
//             <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//           </div>
//           <div class="modal-body">
//             <div class="row">
//               <div class="col-md-6">
//                 <img src="${escapeHtml(productObj.thumbnail || 'https://via.placeholder.com/400')}" 
//                      alt="${escapeHtml(productObj.title || "Product")}" 
//                      class="img-fluid rounded" style="max-height: 400px; object-fit: contain;">
//               </div>
//               <div class="col-md-6">
//                 <h4>${escapeHtml(productObj.title || "Product")}</h4>
//                 <p class="text-muted">${escapeHtml(productObj.description || 'No description available')}</p>
//                 <p><strong>Price:</strong> ${escapeHtml(convertedPrice)}</p>
//                 <p><strong>Category:</strong> ${escapeHtml(productObj.category || 'N/A')}</p>
//                 <p><strong>Eco Score:</strong> ${ecoInfo.score}/5</p>
//                 <div class="mb-3">
//                   ${ecoInfo.badges.map(b => 
//                     `<span class="badge bg-success bg-opacity-10 text-success m-1">${escapeHtml(b)}</span>`
//                   ).join('')}
//                 </div>
//                 <a href="${escapeHtml(productObj.link || '#')}" target="_blank" class="btn btn-success">
//                   Buy Now <i class="fas fa-external-link-alt ms-1"></i>
//                 </a>
//               </div>
//             </div>

//             ${relatedProducts.length > 0 ? `
//             <div class="mt-4">
//               <h5>You may also like</h5>
//               <div class="row">
//                 ${relatedProducts.map(related => `
//                   <div class="col-md-3 col-6">
//                     <div class="card h-100" style="cursor:pointer" onclick="window.showProductModal(${escapeHtml(JSON.stringify(related))}, ${escapeHtml(JSON.stringify(allProductsObj))})">
//                       <img src="${escapeHtml(related.thumbnail || 'https://via.placeholder.com/150')}" 
//                            class="card-img-top" 
//                            alt="${escapeHtml(related.title || "Product")}" style="height: 120px; object-fit: cover;">
//                       <div class="card-body">
//                         <h6 class="card-title">${escapeHtml(related.title || "Product")}</h6>
//                         <p class="card-text text-success">${escapeHtml(convertUSDToINR(parseFloat(related.price?.replace(/[^0-9.]/g, "") || 0)))}</p>
//                       </div>
//                     </div>
//                   </div>
//                 `).join('')}
//               </div>
//             </div>
//             ` : ''}
//           </div>
//           <div class="modal-footer">
//             <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   `;

//   // Create or update modal
//   let modal = document.getElementById('productModal');
//   if (modal) {
//     modal.remove();
//   }

//   document.body.insertAdjacentHTML('beforeend', modalContent);
//   const productModal = new bootstrap.Modal(document.getElementById('productModal'));
//   productModal.show();
// }

// // Helper function to escape HTML
// function escapeHtml(unsafe) {
//   if (typeof unsafe !== 'string') return unsafe;
//   return unsafe
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&#039;");
// }

// // Create a unique ID for buttons that works with Unicode
// function createSafeId(text) {
//   return 'id-' + Array.from(text || '')
//     .map(char => char.charCodeAt(0).toString(16))
//     .join('')
//     .slice(0, 20);
// }

// // Sort products by eco score (highest first)
// function sortProductsByRating(products) {
//   return products.slice().sort((a, b) => {
//     const aScore = getEcoInfo(a).score;
//     const bScore = getEcoInfo(b).score;
//     return bScore - aScore; // Descending order
//   });
// }

// // Create product card with aligned buttons + wishlist state
// function createProductCard(product, allProducts) {
//   const ecoInfo = getEcoInfo(product);
//   const rawPrice = parseFloat(product.price?.replace(/[^0-9.]/g, "")) || 0;
//   const convertedPrice = rawPrice ? convertUSDToINR(rawPrice) : "N/A";

//   const badgeHtml = ecoInfo.badges.map(b =>
//     `<span class="badge bg-success bg-opacity-10 text-success m-1">${escapeHtml(b)}</span>`).join("");

//   const ratingBlocks =
//     `<i style="color:green" class="fa-solid fa-leaf"></i>`.repeat(ecoInfo.score) +
//     `<i style="color:#ccc" class="fa-solid fa-leaf"></i>`.repeat(5 - ecoInfo.score);

//   const isWishlisted = checkIfWishlisted(product);
//   const wishBtnId = createSafeId(product.id + product.title);

//   const div = document.createElement("div");
//   div.classList.add("product-card", "col-md-4", "mb-4");

//   div.innerHTML = `
//     <div class="card h-100">
//       <img src="${escapeHtml(product.thumbnail || 'https://via.placeholder.com/300')}" 
//            class="card-img-top" 
//            alt="${escapeHtml(product.title)}"
//            style="height: 200px; object-fit: cover;">
//       <div class="card-body">
//         <h5 class="card-title">${escapeHtml(product.title)}</h5>
//         <p class="card-text"><strong>Price:</strong> ${escapeHtml(convertedPrice)}</p>
//         <p class="card-text"><strong>Eco Score:</strong> ${ecoInfo.score} / 5</p>
//         <div style="font-size: 1.1rem">${ratingBlocks}</div>
//         <div class="mt-2">${badgeHtml}</div>
//       </div>
//       <div class="card-footer bg-transparent">
//         <div class="d-flex gap-2">
//           <button class="btn btn-outline-success flex-grow-1" 
//                   onclick="window.showProductModal('${escapeHtml(JSON.stringify(product))}', '${escapeHtml(JSON.stringify(allProducts))}')">
//             <i class="fas fa-eye"></i> View
//           </button>
//           <button id="${wishBtnId}" 
//                   class="btn ${isWishlisted ? 'btn-danger' : 'btn-outline-danger'}"
//                   onclick="window.toggleWishlist('${escapeHtml(JSON.stringify(product))}', '${wishBtnId}')">
//             <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
//           </button>
//         </div>
//       </div>
//     </div>
//   `;

//   return div;
// }




// ---------------------------------------------------------------------------------------------------------------------
// 
// Sidebar toggle
// function toggleSidebar() {
//   const sidebar = document.getElementById("sidebar");
//   const mainContent = document.getElementById("main-content");
//   const toggleIcon = document.querySelector(".sidebar-toggle i");

//   sidebar.classList.toggle("collapsed");
//   mainContent.classList.toggle("expanded");

//   toggleIcon.classList.toggle("fa-chevron-left");
//   toggleIcon.classList.toggle("fa-chevron-right");
// }

// // Eco info scorer// Improved Eco info scorer
// function getEcoInfo(product) {
//   const title = (product.title || "").toLowerCase();
//   const desc = (product.description || "").toLowerCase();
//   const tags = (product.tags || []).map(t => t.toLowerCase());

//   let score = 1; // Base score (average product)
//   const badges = [];

//   // More precise scoring with different weights
//   if (title.includes("recyclable") || desc.includes("recyclable") || tags.includes("recyclable")) {
//     badges.push("♻️ Recyclable");
//     score += 1;
//   }
//   if (title.includes("sustainable") || desc.includes("sustainable") || tags.includes("sustainable")) {
//     badges.push("🌱 Sustainable Material");
//     score += 2; // Higher weight for sustainability
//   }
//   if (title.includes("plastic-free") || desc.includes("plastic-free") || title.includes("zero plastic") || tags.includes("plastic-free")) {
//     badges.push("🚫 Plastic-Free");
//     score += 1.5;
//   }
//   if (title.includes("bamboo") || tags.includes("bamboo")) {
//     badges.push("🎋 Bamboo Material");
//     score += 2;
//   }
//   if (title.includes("organic") || tags.includes("organic")) {
//     badges.push("🌿 Organic");
//     score += 1;
//   }
//   if (title.includes("biodegradable") || tags.includes("biodegradable")) {
//     badges.push("🔁 Biodegradable");
//     score += 1.5;
//   }
//   if (title.includes("eco") || tags.includes("eco-friendly")) {
//     badges.push("🍃 Eco-Friendly");
//     score += 1;
//   }
//   if (title.includes("ethical") || desc.includes("ethical") || tags.includes("ethical")) {
//     badges.push("🤝 Ethical Brand");
//     score += 2; // Higher weight for ethical production
//   }
//   if (title.includes("carbon neutral") || tags.includes("carbon-neutral")) {
//     badges.push("🌍 Carbon Neutral");
//     score += 2.5; // Highest weight for carbon neutral
//   }

//   // Cap the score between 1-5
//   return {
//     score: Math.max(1, Math.min(Math.round(score), 5)), // Ensures 1-5 range
//     badges
//   };
// }
// // Currency conversion
// function convertUSDToINR(usd) {
//   const rate = 83;
//   return `₹${(usd * rate).toFixed(0)}`;
// }

// // Wishlist utils
// function getWishlist() {
//   return JSON.parse(localStorage.getItem("wishlist")) || [];
// }

// function checkIfWishlisted(product) {
//   const wishlist = getWishlist();
//   return wishlist.some(p => p.title === product.title);
// }

// function toggleWishlist(product, btnElement) {
//   let wishlist = getWishlist();
//   const index = wishlist.findIndex(p => p.title === product.title);
//   const isNowWishlisted = index === -1;

//   if (isNowWishlisted) {
//     wishlist.push(product);
//   } else {
//     wishlist.splice(index, 1);
//   }

//   localStorage.setItem("wishlist", JSON.stringify(wishlist));

//   // ✅ Update all matching buttons live
//   document.querySelectorAll(".wishlist-toggle").forEach(btn => {
//     if (btn.dataset.title === product.title) {
//       btn.innerText = isNowWishlisted ? "❤️" : "🤍";
//       btn.classList.toggle("btn-danger", isNowWishlisted);
//       btn.classList.toggle("btn-outline-danger", !isNowWishlisted);
//     }
//   });
// }




// // Create product card with aligned buttons + wishlist state
// function createProductCard(product) {
//   const ecoInfo = getEcoInfo(product);
//   const rawPrice = parseFloat(product.price?.replace(/[^0-9.]/g, "")) || 0;
//   const convertedPrice = rawPrice ? convertUSDToINR(rawPrice) : "N/A";
//   const safeLink = product.link?.startsWith("http") ? product.link : "#";

//   const badgeHtml = ecoInfo.badges.map(b =>
//     `<span class="bg-green-100 text-green-900 px-2 py-0.5 rounded-full">${b}</span>`).join("");

//   const ratingBlocks =
//     `<i style="color:green" class="fa-solid fa-leaf"></i>`.repeat(ecoInfo.score) +
//     `<i style="color:#ccc" class="fa-solid fa-leaf"></i>`.repeat(5 - ecoInfo.score);

//   // Helper function to create safe IDs
//   function createSafeId(text) {
//     return 'btn-' + Array.from(text || '')
//       .map(char => char.charCodeAt(0).toString(36))
//       .join('')
//       .slice(0, 10);
//   }

//   const isWishlisted = checkIfWishlisted(product);
//   const wishBtnId = createSafeId(product.id + product.title);
//   // console.log(product);
//   const div = document.createElement("div");
//   div.classList.add("product-card");

//   div.innerHTML = `
// <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 w-full max-w-xs mx-auto">
//   <!-- Product Image (Background removed) -->
//   <div class="relative flex justify-center items-center h-40 overflow-hidden">
//     <img 
//       src="${product.thumbnail || 'https://via.placeholder.com/250'}" 
//       alt="${product.title}" 
//       class="max-h-full max-w-full object-contain"
//       style="background: transparent;"
//       onerror="this.src='https://via.placeholder.com/250?text=No+Image'"
//     >
//   </div>

//   <!-- Product Info -->
//   <div class="p-3 space-y-2">
//     <!-- Title -->
//     <h4 class="text-base font-semibold text-gray-900 line-clamp-2 leading-tight min-h-[2.5rem]">${product.title}</h4>
    
//     <!-- Price & Eco Score -->
//     <div class="flex justify-between items-center mt-1">
//       <p class="text-lg font-bold text-gray-900">${convertedPrice}</p>
//       <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ecoInfo.score > 4 ? 'bg-emerald-100 text-emerald-800' :
//       ecoInfo.score > 3 ? 'bg-green-100 text-green-800' :
//         ecoInfo.score > 2 ? 'bg-amber-100 text-amber-800' :
//           'bg-rose-100 text-rose-800'
//     }">
//         Eco ${ecoInfo.score}/5
//       </span>
//     </div>

//     <!-- Rating -->
//     <div class="flex items-center space-x-0.5 text-amber-400 text-lg mt-1">
//       ${ratingBlocks}
//     </div>

//     <!-- Badges -->
//     <div class="flex flex-wrap gap-1 mt-1">
//       ${badgeHtml}
//     </div>

//     <!-- Buttons -->
//     <div class="flex gap-2 mt-3">
//       <button 
//         onclick='openProductModal(${JSON.stringify(product)})'
//         class="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
//       >
//         View Details
//       </button>
      
//      <button 
//   data-title="${product.title}"
//   class="wishlist-toggle"
//   onclick='toggleWishlist(${JSON.stringify(product)}, this)'
// >
//   ${isWishlisted ? "❤️" : "🤍"}
// </button>

//     </div>
//   </div>
// </div>
//   `;

//   return div;
// }

// function openProductModal(product) {
//   document.getElementById("productModal").classList.remove("hidden");

//   document.getElementById("modal-product-img").src = product.thumbnail || "https://via.placeholder.com/200";
//   document.getElementById("modal-product-title").textContent = product.title;
//   document.getElementById("modal-product-price").textContent = product.price || "N/A";
//   document.getElementById("modal-product-link").href = product.link;

//   // Inject badges
//   const badgeContainer = document.getElementById("modal-product-badges");
//   badgeContainer.innerHTML = "";
//   const eco = getEcoInfo(product);
//   eco.badges.forEach(b => {
//     badgeContainer.innerHTML += `<span class="bg-green-100 text-green-800 px-3 py-1 rounded-full">${b}</span>`;
//   });

//   // Related products (mock example, real logic can be from category/tag)
//   const related = window.allProducts.filter(p => p !== product).slice(0, 5);
//   const relContainer = document.getElementById("modal-related-products");
//   relContainer.innerHTML = "";
//   related.forEach(p => {
//     relContainer.innerHTML += `
//  <div class="relative bg-gradient-to-br from-white/70 to-gray-100 backdrop-blur-md rounded-xl shadow-xl w-48 flex-shrink-0 overflow-hidden transition-all duration-300 hover:scale-[1.03]">
//   <img src="${p.thumbnail}" alt="${p.title}" class="w-full h-32 object-cover" />

//   <div class="p-4 space-y-2">
//     <p class="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
//       ${p.title.slice(0, 40)}${p.title.length > 40 ? '...' : ''}
//     </p>

//     <button 
//       onclick='openProductModal(${JSON.stringify(product)})' 
//       class="inline-block w-full text-xs font-medium text-center bg-green-100 text-green-700 rounded-md px-4 py-2 hover:bg-green-600 hover:text-white transition duration-200"
//     >
//       View Product
//     </button>
//   </div>
// </div>

// `;
//   });
// }



// {/* <div class="group relative bg-white rounded-2xl shadow-lg overflow-hidden w-44 flex-shrink-0 transition-transform duration-300 hover:scale-105">
//   <img src="${p.thumbnail}" alt="${p.title}" class="w-full h-28 object-cover rounded-t-2xl" />
  
//   <div class="p-3 flex flex-col justify-between h-full">
//     <p class="text-sm font-semibold text-gray-800 group-hover:text-green-600 transition-colors duration-200">
//       ${p.title.slice(0, 40)}${p.title.length > 40 ? '...' : ''}
//     </p>

//     <button 
//       onclick='openProductModal(${JSON.stringify(product)})' 
//       class="mt-3 text-xs px-3 py-1.5 rounded-full border border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-200 ease-in-out"
//     >
//       View Product
//     </button>
//   </div>
// </div> */}


// function closeModal() {
//   document.getElementById("productModal").classList.add("hidden");
// }


// // Load homepage products - SORTED BY ECO SCORE (DESCENDING)
// fetch("/api/products")
//   .then(res => res.json())
//   .then(data => {
//     window.allProducts = [...data.ecoFriendly, ...data.all]; // Store all products

//     const ecoContainer = document.getElementById("eco-products");
//     const otherContainer = document.getElementById("other-products");

//     // Sort products by eco score (highest first)
//     const sortedEcoFriendly = [...data.ecoFriendly].sort((a, b) => {
//       return getEcoInfo(b).score - getEcoInfo(a).score;
//     });

//     const sortedOthers = [...data.all.filter(p =>
//       !data.ecoFriendly.some(eco => eco.title === p.title))
//     ].sort((a, b) => {
//       return getEcoInfo(b).score - getEcoInfo(a).score;
//     });

//     // Clear containers
//     ecoContainer.innerHTML = "";
//     otherContainer.innerHTML = "";

//     // Add sorted products
//     sortedEcoFriendly.forEach(product => {
//       ecoContainer.appendChild(createProductCard(product));
//     });

//     sortedOthers.forEach(product => {
//       otherContainer.appendChild(createProductCard(product));
//     });
//   })
//   .catch(error => {
//     console.error("Failed to fetch product data:", error);
//   });
// // Real-time search
// // Real-time search
// // Keep these as globals
// let searchInput = document.querySelector(".search-input");
// let searchBtn = document.querySelector(".search-btn");
// const searchResults = document.getElementById("search-results");

// // Keep the original function
// function handleSearch() {
//   const query = searchInput.value.trim();
//   if (!query) return;

//   fetch(`/api/search?q=${encodeURIComponent(query)}`)
//     .then(res => res.json())
//     .then(products => {
//       const container = document.getElementById("search-injected");
//       container.innerHTML = "";

//       if (!Array.isArray(products) || products.length === 0) {
//         container.innerHTML = "<p>No matching product found.</p>";
//         return;
//       }

//       products.forEach(product => {
//         container.appendChild(createProductCard(product));
//       });

//       window.scrollTo({ top: container.offsetTop - 80, behavior: "smooth" });
//     })
//     .catch(err => {
//       console.error("Search fetch error:", err);
//     });
// }

// // Setup all inputs and buttons with class
// document.addEventListener("DOMContentLoaded", () => {
//   const inputs = document.querySelectorAll(".search-input");
//   const buttons = document.querySelectorAll(".search-btn");

//   inputs.forEach(input => {
//     input.addEventListener("input", () => {
//       inputs.forEach(i => { if (i !== input) i.value = input.value; });
//       searchInput = input;
//     });

//     input.addEventListener("keypress", e => {
//       if (e.key === "Enter") {
//         searchInput = input;
//         handleSearch();
//       }
//     });
//   });

//   buttons.forEach(btn => {
//     btn.addEventListener("click", () => {
//       const closestInput = btn.closest("div").querySelector(".search-input");
//       if (closestInput) searchInput = closestInput;
//       searchBtn = btn;
//       handleSearch();
//     });
//   });
// });



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

// Eco Info of products
// Improved Eco info scorer
function getEcoInfo(product) {
  const title = (product.title || "").toLowerCase();
  const desc = (product.description || "").toLowerCase();
  const tags = (product.tags || []).map(t => t.toLowerCase());
  let score = 1;
  const badges = [];
  if (title.includes("recyclable") || desc.includes("recyclable") || tags.includes("recyclable")) { badges.push("♻️ Recyclable"); score += 1; }
  if (title.includes("sustainable") || desc.includes("sustainable") || tags.includes("sustainable")) { badges.push("🌱 Sustainable Material"); score += 2; }
  if (title.includes("plastic-free") || desc.includes("plastic-free") || title.includes("zero plastic") || tags.includes("plastic-free")) { badges.push("🚫 Plastic-Free"); score += 1.5; }
  if (title.includes("bamboo") || tags.includes("bamboo")) { badges.push("🎋 Bamboo Material"); score += 2; }
  if (title.includes("organic") || tags.includes("organic")) { badges.push("🌿 Organic"); score += 1; }
  if (title.includes("biodegradable") || tags.includes("biodegradable")) { badges.push("🔁 Biodegradable"); score += 1.5; }
  if (title.includes("eco") || tags.includes("eco-friendly")) { badges.push("🍃 Eco-Friendly"); score += 1; }
  if (title.includes("ethical") || desc.includes("ethical") || tags.includes("ethical")) { badges.push("🤝 Ethical Brand"); score += 2; }
  if (title.includes("carbon neutral") || tags.includes("carbon-neutral")) { badges.push("🌍 Carbon Neutral"); score += 2.5; }

  return { score: Math.max(1, Math.min(Math.round(score), 5)), badges };
}

function convertUSDToINR(usd) {
  return `₹${(usd * 73).toFixed(0)}`;
}

function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function checkIfWishlisted(product) {
  return getWishlist().some(p => p.title === product.title);
}

function toggleWishlist(product, btnElement) {
  let wishlist = getWishlist();
  const index = wishlist.findIndex(p => p.title === product.title);
  const isNowWishlisted = index === -1;

  isNowWishlisted ? wishlist.push(product) : wishlist.splice(index, 1);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  document.querySelectorAll(".wishlist-toggle").forEach(btn => {
    if (btn.dataset.title === product.title) {
      btn.innerText = isNowWishlisted ? "❤️" : "🤍";
    }
  });
}

function createProductCard(product) {
  const ecoInfo = getEcoInfo(product);
  const price = convertUSDToINR(parseFloat(product.price?.replace(/[^0-9.]/g, "")) || 0);
  const badges = ecoInfo.badges.map(b => `<span class="bg-green-100 text-green-900 px-2 py-0.5 rounded-full">${b}</span>`).join("");
  const rating = `<i style="color:green" class="fa-solid fa-leaf"></i>`.repeat(ecoInfo.score) + `<i style="color:#ccc" class="fa-solid fa-leaf"></i>`.repeat(5 - ecoInfo.score);
  const isWishlisted = checkIfWishlisted(product);

  const div = document.createElement("div");
  div.className = "product-card";
  div.innerHTML = `
    <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 w-full max-w-xs mx-auto">
      <div class="relative flex justify-center items-center h-40 overflow-hidden">
        <img src="${product.thumbnail || 'https://via.placeholder.com/250'}" alt="${product.title}" class="max-h-full max-w-full object-contain" onerror="this.src='https://via.placeholder.com/250?text=No+Image'">
      </div>
      <div class="p-3 space-y-2">
        <h4 class="text-base font-semibold text-gray-900 line-clamp-2 leading-tight min-h-[2.5rem]">${product.title}</h4>
        <div class="flex justify-between items-center mt-1">
          <p class="text-lg font-bold text-gray-900">${price}</p>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ecoInfo.score > 4 ? 'bg-emerald-100 text-emerald-800' : ecoInfo.score > 3 ? 'bg-green-100 text-green-800' : ecoInfo.score > 2 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}">
            Eco ${ecoInfo.score}/5
          </span>
        </div>
        <div class="flex items-center space-x-0.5 text-amber-400 text-lg mt-1">${rating}</div>
        <div class="flex flex-wrap gap-1 mt-1">${badges}</div>
        <div class="flex gap-2 mt-3">
          <button onclick='openProductModal(${JSON.stringify(product)})' class="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md">View Details</button>
          <button data-title="${product.title}" class="wishlist-toggle" onclick='toggleWishlist(${JSON.stringify(product)}, this)'>${isWishlisted ? "❤️" : "🤍"}</button>
        </div>
      </div>
    </div>
  `;
  return div;
}

function openProductModal(product) {
  document.getElementById("productModal").classList.remove("hidden");
  document.getElementById("modal-product-img").src = product.thumbnail || "https://via.placeholder.com/200";
  document.getElementById("modal-product-title").textContent = product.title;
  document.getElementById("modal-product-price").textContent = product.price || "N/A";
  document.getElementById("modal-product-link").href = product.link;
  const badgeContainer = document.getElementById("modal-product-badges");
  badgeContainer.innerHTML = getEcoInfo(product).badges.map(b => `<span class="bg-green-100 text-green-800 px-3 py-1 rounded-full">${b}</span>`).join("");
  const related = window.allProducts.filter(p => p !== product).slice(0, 5);
  const relContainer = document.getElementById("modal-related-products");
  relContainer.innerHTML = related.map(p => `
    <div class="relative bg-gradient-to-br from-white/70 to-gray-100 backdrop-blur-md rounded-xl shadow-xl w-48 flex-shrink-0 overflow-hidden transition-all duration-300 hover:scale-[1.03]">
      <img src="${p.thumbnail}" alt="${p.title}" class="w-full h-32 object-cover" />
      <div class="p-4 space-y-2">
        <p class="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">${p.title.slice(0, 40)}${p.title.length > 40 ? '...' : ''}</p>
        <button onclick='openProductModal(${JSON.stringify(p)})' class="inline-block w-full text-xs font-medium text-center bg-green-100 text-green-700 rounded-md px-4 py-2 hover:bg-green-600 hover:text-white transition duration-200">View Product</button>
      </div>
    </div>
  `).join("");
}

function closeModal() {
  document.getElementById("productModal").classList.add("hidden");
}

let ecoIndex = 0;
const ecoContainer = document.getElementById("eco-products");
const otherContainer = document.getElementById("other-products");
const showMoreBtn = document.getElementById("show-more-btn") || (() => {
  const btn = document.createElement("button");
  btn.id = "show-more-btn";
  btn.textContent = "Show More";
  btn.className = "block mx-auto mt-4 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full";
  ecoContainer.parentNode.insertBefore(btn, ecoContainer.nextSibling);
  return btn;
})();
let ecoProducts = [];

function renderEcoProductsBatch(batchSize = 6) {
  const nextBatch = ecoProducts.slice(ecoIndex, ecoIndex + batchSize);
  nextBatch.forEach(product => ecoContainer.appendChild(createProductCard(product)));
  ecoIndex += batchSize;
  if (ecoIndex >= ecoProducts.length) {
    showMoreBtn.classList.add("hidden");
  }
}

fetch("/api/products")
  .then(res => res.json())
  .then(data => {
    window.allProducts = [...data.ecoFriendly, ...data.all];
    ecoProducts = [...data.ecoFriendly].sort((a, b) => getEcoInfo(b).score - getEcoInfo(a).score);
    renderEcoProductsBatch();
    const sortedOthers = [...data.all.filter(p => !data.ecoFriendly.some(eco => eco.title === p.title))].sort((a, b) => getEcoInfo(b).score - getEcoInfo(a).score);
    otherContainer.innerHTML = "";
    sortedOthers.forEach(product => otherContainer.appendChild(createProductCard(product)));
  })
  .catch(err => console.error("Failed to fetch products:", err));

showMoreBtn?.addEventListener("click", () => {
  renderEcoProductsBatch();
});

// Real-time search
let searchInput = document.querySelector(".search-input");
let searchBtn = document.querySelector(".search-btn");
function handleSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  fetch(`/api/search?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(products => {
      const container = document.getElementById("search-injected");
      container.innerHTML = "";
      if (!Array.isArray(products) || products.length === 0) {
        container.innerHTML = "<p>No matching product found.</p>";
        return;
      }
      products.forEach(product => {
        container.appendChild(createProductCard(product));
      });
      window.scrollTo({ top: container.offsetTop - 80, behavior: "smooth" });
    })
    .catch(err => console.error("Search fetch error:", err));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".search-input").forEach(input => {
    input.addEventListener("input", () => {
      document.querySelectorAll(".search-input").forEach(i => { if (i !== input) i.value = input.value; });
      searchInput = input;
    });
    input.addEventListener("keypress", e => {
      if (e.key === "Enter") {
        searchInput = input;
        handleSearch();
      }
    });
  });

  document.querySelectorAll(".search-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = btn.closest("div").querySelector(".search-input");
      if (input) searchInput = input;
      searchBtn = btn;
      handleSearch();
    });
  });
});
