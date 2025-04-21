document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileCloseButton = document.getElementById('mobile-close-button');
    const desktopToggleButton = document.getElementById('desktop-toggle-button');
    const sidebar = document.getElementById('sidebar');
    const toggleIcon = document.getElementById('toggle-icon');
    const mainContent = document.getElementById('main-content');

    // Track sidebar state
    let isSidebarCollapsed = false;
    let isMobile = window.innerWidth < 1024;

    // Initialize sidebar based on screen size
    function initSidebar() {
      isMobile = window.innerWidth < 1024;

      if (isMobile) {
        // Mobile - start with sidebar hidden
        sidebar.classList.add('-translate-x-full');
        sidebar.classList.remove('sidebar-collapsed', 'sidebar-expanded');
        mainContent.classList.remove('content-collapsed', 'content-expanded');
      } else {
        // Desktop - start with sidebar expanded
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('sidebar-expanded');
        mainContent.classList.add('content-expanded');
        // Reset icon
        toggleIcon.classList.remove('fa-chevron-right');
        toggleIcon.classList.add('fa-chevron-left');
      }
    }

    // Toggle sidebar function
    function toggleSidebar() {
      if (!isMobile) {
        // Desktop behavior
        isSidebarCollapsed = !isSidebarCollapsed;

        if (isSidebarCollapsed) {
          // Collapse sidebar
          sidebar.classList.remove('sidebar-expanded');
          sidebar.classList.add('sidebar-collapsed');
          mainContent.classList.remove('content-expanded');
          mainContent.classList.add('content-collapsed');

          // Hide text elements
          document.querySelectorAll('.sidebar-text').forEach(el => {
            el.classList.add('hidden');
          });

          // Hide section titles and search
          document.querySelectorAll('.sidebar-section, .sidebar-search').forEach(el => {
            el.classList.add('hidden');
          });

          // Rotate icon
          toggleIcon.classList.remove('fa-chevron-left');
          toggleIcon.classList.add('fa-chevron-right');
        } else {
          // Expand sidebar
          sidebar.classList.remove('sidebar-collapsed');
          sidebar.classList.add('sidebar-expanded');
          mainContent.classList.remove('content-collapsed');
          mainContent.classList.add('content-expanded');

          // Show text elements
          document.querySelectorAll('.sidebar-text').forEach(el => {
            el.classList.remove('hidden');
          });

          // Show section titles and search
          document.querySelectorAll('.sidebar-section, .sidebar-search').forEach(el => {
            el.classList.remove('hidden');
          });

          // Rotate icon
          toggleIcon.classList.remove('fa-chevron-right');
          toggleIcon.classList.add('fa-chevron-left');
        }
      } else {
        // Mobile behavior - simple show/hide
        sidebar.classList.toggle('-translate-x-full');
      }
    }

    // Event listeners
    mobileMenuButton.addEventListener('click', toggleSidebar);
    mobileCloseButton.addEventListener('click', toggleSidebar);
    desktopToggleButton.addEventListener('click', toggleSidebar);

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function (e) {
      if (isMobile &&
        !sidebar.contains(e.target) &&
        !mobileMenuButton.contains(e.target) &&
        !mobileCloseButton.contains(e.target) &&
        !sidebar.classList.contains('-translate-x-full')) {
        sidebar.classList.add('-translate-x-full');
      }
    });

    // Handle window resize
    function handleResize() {
      const wasMobile = isMobile;
      isMobile = window.innerWidth < 1024;

      if (wasMobile !== isMobile) {
        // Screen size category changed (mobile ↔ desktop)
        initSidebar();
      }
    }

    // Initial setup
    initSidebar();

    // Event listeners
    window.addEventListener('resize', handleResize);
  });