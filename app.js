// 1. Importamos las herramientas de Firebase usando enlaces web (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. La configuración de tu proyecto
const firebaseConfig = {
  apiKey: "AIzaSyDBg0n4lFbO42s1sax3ve4_jKDpQGkdQCo",
  authDomain: "mi-portafolio-aad90.firebaseapp.com",
  projectId: "mi-portafolio-aad90",
  storageBucket: "mi-portafolio-aad90.firebasestorage.app",
  messagingSenderId: "207584593414",
  appId: "1:207584593414:web:eecfe3e8531d4872626587",
  measurementId: "G-YRFNL9X3SK"
};

// 3. Encendemos Firebase y conectamos la base de datos
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("¡Firebase conectado con éxito!");

/**
 * ==========================================
 * Arquitectura JS - SOLID Principles
 * ==========================================
 */

// 1. CLASES (Las herramientas)

class UIAnimator {
    constructor(selector) { this.elements = document.querySelectorAll(selector); }
    init() { throw new Error("El método init() debe implementarse en la subclase."); }
}

class TextSequenceAnimator extends UIAnimator {
    constructor(selector, delayIncrement = 250) { super(selector); this.delayIncrement = delayIncrement; }
    init() {
        if (!this.elements.length) return;
        window.addEventListener('load', () => {
            this.elements.forEach((element, index) => { setTimeout(() => { element.classList.add('visible'); }, index * this.delayIncrement); });
        });
    }
}

class MouseParallax {
    constructor(containerId, targetId, intensity = 20) { this.container = document.getElementById(containerId); this.target = document.getElementById(targetId); this.intensity = intensity; }
    init() {
        if (!this.container || !this.target) return;
        this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.container.addEventListener('mouseleave', () => this.handleMouseLeave());
    }
    handleMouseMove(e) {
        const rect = this.container.getBoundingClientRect();
        const moveX = (((e.clientX - rect.left) - (rect.width / 2)) / (rect.width / 2)) * -this.intensity;
        const moveY = (((e.clientY - rect.top) - (rect.height / 2)) / (rect.height / 2)) * -this.intensity;
        requestAnimationFrame(() => { this.target.style.transform = `translate(${moveX}px, ${moveY}px)`; this.target.style.transition = 'none'; });
    }
    handleMouseLeave() { requestAnimationFrame(() => { this.target.style.transform = 'translate(0px, 0px)'; this.target.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'; }); }
}

class ScrollObserver extends UIAnimator {
    constructor(selector, options = {}) { super(selector); this.options = { root: null, threshold: 0.05, ...options }; }
    init() {
        if (!this.elements.length) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('active'); observer.unobserve(entry.target); } });
        }, this.options);
        this.elements.forEach(el => observer.observe(el));
    }
}

class AccordionController extends UIAnimator {
    constructor(selector) { super(selector); }
    init() {
        if (!this.elements.length) return;
        this.elements.forEach(item => {
            item.querySelector('.accordion-header').addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                this.elements.forEach(el => el.classList.remove('open'));
                if (!isOpen) item.classList.add('open');
            });
        });
    }
}

class PortfolioFilter {
    constructor(buttonsSelector, itemsSelector) { this.buttons = document.querySelectorAll(buttonsSelector); this.items = document.querySelectorAll(itemsSelector); }
    init() {
        if (!this.buttons.length || !this.items.length) return;
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.buttons.forEach(btn => btn.classList.remove('active')); e.target.classList.add('active');
                this.animateFilter(e.target.getAttribute('data-filter'));
            });
        });
    }
    animateFilter(filterValue) {
        this.items.forEach(item => {
            item.style.opacity = '0'; item.style.transform = 'scale(0.95) translateY(10px)';
            setTimeout(() => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block'; setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1) translateY(0)'; }, 50);
                } else { item.style.display = 'none'; }
            }, 450); 
        });
    }
}

class MobileMenu extends UIAnimator {
    constructor(btnSelector, menuSelector) { super(btnSelector); this.btn = document.querySelector(btnSelector); this.menu = document.querySelector(menuSelector); this.links = document.querySelectorAll(`${menuSelector} a`); }
    init() {
        if (!this.btn || !this.menu) return;
        this.btn.addEventListener('click', (e) => { e.stopPropagation(); this.toggleMenu(); });
        document.addEventListener('click', (e) => { if (this.menu.classList.contains('open') && !this.menu.contains(e.target) && !this.btn.contains(e.target)) this.closeMenu(); });
        this.links.forEach(link => link.addEventListener('click', () => this.closeMenu()));
    }
    toggleMenu() { this.btn.classList.toggle('open'); this.menu.classList.toggle('open'); }
    closeMenu() { this.btn.classList.remove('open'); this.menu.classList.remove('open'); }
}

class CarouselController extends UIAnimator {
    constructor(gridSelector, columnSelector, indicatorSelector) { super(gridSelector); this.grid = document.querySelector(gridSelector); this.columns = document.querySelectorAll(columnSelector); this.indicators = document.querySelectorAll(indicatorSelector); }
    init() {
        if (!this.grid || !this.columns.length || !this.indicators.length || window.innerWidth > 850) return;
        this.grid.addEventListener('scroll', () => requestAnimationFrame(() => this.updateCarousel()));
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.grid.scrollTo({ left: this.grid.clientWidth * index, behavior: 'smooth' }));
        });
        this.updateCarousel();
    }
    updateCarousel() {
        const activeIndex = Math.round(this.grid.scrollLeft / this.grid.clientWidth);
        this.indicators.forEach((indicator, index) => index === activeIndex ? indicator.classList.add('active') : indicator.classList.remove('active'));
        this.columns.forEach((column, index) => column.style.opacity = index === activeIndex ? '1' : '0.25');
    }
}

class LightboxGallery {
    constructor() {
        this.lightbox = document.getElementById('lightbox'); 
        this.img = document.getElementById('lightbox-img');
        this.title = document.getElementById('lightbox-title'); 
        this.category = document.getElementById('lightbox-category');
        this.closeBtn = document.querySelector('.lightbox-close'); 
        this.prevBtn = document.querySelector('.lightbox-prev'); 
        this.nextBtn = document.querySelector('.lightbox-next');
        this.currentFilter = 'all'; 
        this.visibleItems = []; 
        this.currentIndex = 0;
        this.touchStartX = 0; 
        this.touchEndX = 0;
    }

    init() {
        if (!this.lightbox) return;
        
        // 1. Delegación de eventos en el contenedor de proyectos
        // Esto soluciona el problema de que las fotos de Firebase no respondían
        document.getElementById('contenedor-proyectos').addEventListener('click', (e) => {
            const item = e.target.closest('.portfolio-item');
            if (item) this.openLightbox(item);
        });

        // 2. Filtros
        document.querySelectorAll('.filter-btn').forEach(btn => 
            btn.addEventListener('click', (e) => this.currentFilter = e.target.getAttribute('data-filter'))
        );
        
        // 3. Controles
        this.closeBtn.addEventListener('click', () => this.closeLightbox());
        this.prevBtn.addEventListener('click', () => this.navigate(-1));
        this.nextBtn.addEventListener('click', () => this.navigate(1));
        this.lightbox.addEventListener('click', (e) => { if (e.target === this.lightbox) this.closeLightbox(); });
        
        // 4. Swipe
        this.lightbox.addEventListener('touchstart', e => this.touchStartX = e.changedTouches[0].screenX, {passive: true});
        this.lightbox.addEventListener('touchend', e => { this.touchEndX = e.changedTouches[0].screenX; this.handleSwipe(); }, {passive: true});
    }

    openLightbox(clickedItem) {
        // Obtenemos todos los items visibles actualmente
        const allItems = Array.from(document.querySelectorAll('.portfolio-item')).filter(item => {
             // Solo tomamos los que no tienen display: none
             return window.getComputedStyle(item).display !== 'none';
        });
        
        this.visibleItems = this.currentFilter === 'all' 
            ? allItems 
            : allItems.filter(item => item.getAttribute('data-category') === this.currentFilter);
            
        this.currentIndex = this.visibleItems.indexOf(clickedItem);
        this.updateLightboxContent();
        this.lightbox.classList.add('active');
        
        // Bloqueo de scroll aplicado correctamente
        document.documentElement.classList.add('no-scroll');
        document.body.classList.add('no-scroll');
    }

    closeLightbox() { 
        this.lightbox.classList.remove('active'); 
        // Restaurar scroll
        document.documentElement.classList.remove('no-scroll');
        document.body.classList.remove('no-scroll');
    }

    navigate(direction) {
        this.img.classList.add('fade-out');
        this.title.classList.add('fade-out');
        this.category.classList.add('fade-out');

        setTimeout(() => {
            this.currentIndex += direction;
            if (this.currentIndex >= this.visibleItems.length) this.currentIndex = 0;
            if (this.currentIndex < 0) this.currentIndex = this.visibleItems.length - 1;
            
            this.updateLightboxContent();

            this.img.classList.remove('fade-out');
            this.title.classList.remove('fade-out');
            this.category.classList.remove('fade-out');
        }, 300);
    }

    updateLightboxContent() {
        const item = this.visibleItems[this.currentIndex];
        if (!item) return; // Seguridad
        this.img.src = item.querySelector('img').src;
        this.title.textContent = item.querySelector('.item-title').textContent;
        this.category.textContent = item.querySelector('.item-category').textContent;
    }

    handleSwipe() {
        if (this.touchEndX < this.touchStartX - 50) this.navigate(1);
        if (this.touchEndX > this.touchStartX + 50) this.navigate(-1);
    }
}


    updateLightboxContent() {
        const item = this.visibleItems[this.currentIndex];
        this.img.src = item.querySelector('img').src;
        this.title.textContent = item.querySelector('.item-title').textContent;
        this.category.textContent = item.querySelector('.item-category').textContent;
    }
    handleSwipe() {
        if (this.touchEndX < this.touchStartX - 50) this.navigate(1);
        if (this.touchEndX > this.touchStartX + 50) this.navigate(-1);
    }
}

// 2. INICIALIZACIÓN (Actualizada para rendimiento)

async function cargarProyectos() {
    const contenedor = document.getElementById('contenedor-proyectos');
    if (!contenedor) return;

    try {
        const proyectosRef = collection(db, "proyecto");
        const querySnapshot = await getDocs(proyectosRef);
        
        let htmlAcumulado = "";
        
        querySnapshot.forEach((doc) => {
            const proyecto = doc.data();
            htmlAcumulado += `
                <div class="portfolio-item scroll-reveal" data-category="residencial">
                    <div class="item-image-wrapper">
                        <img src="${proyecto.imagen}" alt="${proyecto.titulo}">
                    </div>
                    <div class="portfolio-item-info">
                        <h3 class="item-title">${proyecto.titulo}</h3>
                        <span class="item-category">${proyecto.descripcion}</span>
                    </div>
                </div>
            `;
        });
        
        // Inyectamos todo el HTML nuevo de una sola vez
        contenedor.insertAdjacentHTML('beforeend', htmlAcumulado);
    } catch (error) {
        console.error("Hubo un error cargando los proyectos:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Iniciamos la carga de proyectos (sin bloquear la UI)
    cargarProyectos();

    // 2. Encendemos tus herramientas inmediatamente
    new TextSequenceAnimator('.reveal-text', 200).init();
    new ScrollObserver('.scroll-reveal').init();
    new AccordionController('.accordion-item').init();
    new PortfolioFilter('.filter-btn', '.portfolio-item').init();
    new MobileMenu('.hamburger-btn', '.nav-menu').init();
    new CarouselController('.resume-grid', '.resume-column', '.indicator-dash').init();
    new LightboxGallery().init();
    
    if(document.getElementById('parallax-container')) {
        new MouseParallax('parallax-container', 'parallax-image', 15).init();
    }
});

