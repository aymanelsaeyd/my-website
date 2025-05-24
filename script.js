// FAQ Functionality
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('nav ul');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('nav') && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
});

// Close menu when clicking a link
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Navbar Scroll Control
let lastScrollTop = 0;
const header = document.querySelector('header');
const headerHeight = header.offsetHeight;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > headerHeight) {
        // عند التمرير لأسفل
        header.style.transform = 'translateY(-100%)';
    } else {
        // عند التمرير لأعلى
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Project Links
const projectLinks = {
    'youvi-link': '' // اتركه فارغاً ليتم تحديثه لاحقاً
};

// Update Project Link
function updateProjectLink(projectId, newLink) {
    const linkElement = document.getElementById(projectId);
    if (linkElement && newLink) {
        linkElement.href = newLink;
        projectLinks[projectId] = newLink;
    }
}

// Update copyright year
document.getElementById('year').textContent = new Date().getFullYear();

// Stats Animation
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCount = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target;
            }
        };

        updateCount();
    });
}

// Intersection Observer for Stats
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}

// Sample portfolio projects
const portfolioProjects = [
    {
        title: 'مونتاج فيديو إعلاني',
        category: 'تحرير فيديو',
        icon: 'fas fa-film'
    },
    {
        title: 'فيديو تسويقي لمنتج',
        category: 'تحرير فيديو',
        icon: 'fas fa-video'
    },
    {
        title: 'تصميم موقع شركة',
        category: 'تطوير ويب',
        icon: 'fas fa-laptop-code'
    },
    {
        title: 'تصميم شعار',
        category: 'تصميم جرافيك',
        icon: 'fas fa-palette'
    },
    {
        title: 'حملة تسويقية',
        category: 'تسويق رقمي',
        icon: 'fas fa-bullhorn'
    },
    {
        title: 'تصميم منيو مطعم فاخر',
        category: 'تصميم منيوهات',
        icon: 'fas fa-utensils'
    },
    {
        title: 'منيو كافيه عصري',
        category: 'تصميم منيوهات',
        icon: 'fas fa-coffee'
    }
];

// Populate portfolio section
const portfolioGrid = document.querySelector('.portfolio-grid');
portfolioProjects.forEach(project => {
    const projectElement = document.createElement('div');
    projectElement.className = 'portfolio-item';
    projectElement.innerHTML = `
        <div class="portfolio-icon">
            <i class="${project.icon}"></i>
        </div>
        <div class="portfolio-info">
            <h3>${project.title}</h3>
            <p>${project.category}</p>
        </div>
        <span class="portfolio-category">${project.category}</span>
    `;
    portfolioGrid.appendChild(projectElement);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
