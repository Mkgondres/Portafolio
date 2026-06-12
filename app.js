/**
 * ==========================================
 * Principios SOLID y POO aplicados:
 * 1. Single Responsibility Principle (SRP)
 * 2. Open/Closed Principle (OCP)
 * ==========================================
 */

// --------------------------------------------------
// 1. CLASES (Las herramientas)
// --------------------------------------------------

// Clase Base: Interfaz genérica para componentes de UI
class UIComponent {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
    }

    init() {
        throw new Error("El método init() debe ser implementado por la subclase.");
    }
}

// Clase: Animación de entrada (Hero)
class EntranceAnimator extends UIComponent {
    constructor(selector, delayIncrement = 200) {
        super(selector);
        this.delayIncrement = delayIncrement;
    }

    init() {
        if (!this.elements) return;
        this.elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('visible');
            }, index * this.delayIncrement);
        });
    }
}

// Clase: Animación al hacer scroll (Sobre mí)
class ScrollObserver {
    constructor(selector, options = {}) {
        this.elements = document.querySelectorAll(selector);
        this.options = {
            root: null,
            threshold: 0.2,
            ...options
        };
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, this.options);

        this.elements.forEach(el => observer.observe(el));
    }
}

// Clase: Sistema de filtrado (Portafolio)
class PortfolioFilter {
    constructor(buttonsSelector, itemsSelector) {
        this.buttons = document.querySelectorAll(buttonsSelector);
        this.items = document.querySelectorAll(itemsSelector);
    }

    init() {
        if (!this.buttons || !this.items) return;

        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Cambiar botón activo
                this.buttons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                // Filtrar
                const filterValue = e.target.getAttribute('data-filter');
                this.filterGallery(filterValue);
            });
        });
    }

    filterGallery(filterValue) {
        this.items.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';

            setTimeout(() => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.display = 'none';
                }
            }, 400); 
        });
    }
}

// --------------------------------------------------
// 2. INICIALIZACIÓN (Encendemos las herramientas)
// --------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Encender animaciones del Hero
    const heroAnimator = new EntranceAnimator('.fade-in', 300);
    heroAnimator.init();

    // 2. Encender animaciones de Scroll
    const scrollReveal = new ScrollObserver('.reveal-scroll');
    scrollReveal.init();

    // 3. Encender filtros del Portafolio
    const portfolioFilter = new PortfolioFilter('.filter-btn', '.portfolio-item');
    portfolioFilter.init();

});
