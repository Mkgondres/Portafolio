/**
 * ==========================================
 * Arquitectura JS - SOLID Principles
 * ==========================================
 */

// --------------------------------------------------
// 1. CLASES (Las herramientas)
// --------------------------------------------------

// CLASE BASE: Componente genérico de UI
class UIAnimator {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
    }
    init() {
        throw new Error("El método init() debe implementarse en la subclase.");
    }
}

// CLASE: Animación de textos en cascada (Hero)
class TextSequenceAnimator extends UIAnimator {
    constructor(selector, delayIncrement = 250) {
        super(selector);
        this.delayIncrement = delayIncrement;
    }

    init() {
        if (!this.elements.length) return;
        window.addEventListener('load', () => {
            this.elements.forEach((element, index) => {
                setTimeout(() => {
                    element.classList.add('visible');
                }, index * this.delayIncrement);
            });
        });
    }
}

// CLASE: Efecto Parallax interactivo con el ratón (Hero)
class MouseParallax {
    constructor(containerId, targetId, intensity = 20) {
        this.container = document.getElementById(containerId);
        this.target = document.getElementById(targetId);
        this.intensity = intensity;
    }

    init() {
        if (!this.container || !this.target) return;
        this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.container.addEventListener('mouseleave', () => this.handleMouseLeave());
    }

    handleMouseMove(e) {
        const rect = this.container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const moveX = ((mouseX - centerX) / centerX) * -this.intensity;
        const moveY = ((mouseY - centerY) / centerY) * -this.intensity;

        requestAnimationFrame(() => {
            this.target.style.transform = `translate(${moveX}px, ${moveY}px)`;
            this.target.style.transition = 'none';
        });
    }

    handleMouseLeave() {
        requestAnimationFrame(() => {
            this.target.style.transform = 'translate(0px, 0px)';
            this.target.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        });
    }
}

// CLASE: Observador de Scroll para revelar elementos (Secciones Generales)
class ScrollObserver extends UIAnimator {
    constructor(selector, options = {}) {
        super(selector);
        this.options = {
            root: null,
            threshold: 0.05, 
            ...options
        };
    }

    init() {
        if (!this.elements.length) return;

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

// CLASE: Controlador del Acordeón Interactivo (Sección 4)
class AccordionController extends UIAnimator {
    constructor(selector) {
        super(selector);
    }

    init() {
        if (!this.elements.length) return;

        this.elements.forEach(item => {
            const header = item.querySelector('.accordion-header');
            
            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                
                this.elements.forEach(el => el.classList.remove('open'));

                if (!isOpen) {
                    item.classList.add('open');
                }
            });
        });
    }
}

// CLASE: Sistema de Filtrado de Portafolio Avanzado (Sección 5)
class PortfolioFilter {
    constructor(buttonsSelector, itemsSelector) {
        this.buttons = document.querySelectorAll(buttonsSelector);
        this.items = document.querySelectorAll(itemsSelector);
    }

    init() {
        if (!this.buttons.length || !this.items.length) return;

        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.buttons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                const filterValue = e.target.getAttribute('data-filter');
                this.animateFilter(filterValue);
            });
        });
    }

    animateFilter(filterValue) {
        this.items.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95) translateY(10px)';

            setTimeout(() => {
                const itemCategory = item.getAttribute('data-category');

                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'block';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1) translateY(0)';
                    }, 50);
                } else {
                    item.style.display = 'none';
                }
            }, 450); 
        });
    }
}

// CLASE: Controlador del Menú Hamburguesa para Móviles
class MobileMenu extends UIAnimator {
    constructor(btnSelector, menuSelector) {
        super(btnSelector);
        this.btn = document.querySelector(btnSelector);
        this.menu = document.querySelector(menuSelector);
        this.links = document.querySelectorAll(`${menuSelector} a`);
    }

    init() {
        if (!this.btn || !this.menu) return;

        this.btn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            this.toggleMenu();
        });

        document.addEventListener('click', (e) => {
            const isMenuOpen = this.menu.classList.contains('open');
            const clickedInsideMenu = this.menu.contains(e.target);
            const clickedOnButton = this.btn.contains(e.target);

            if (isMenuOpen && !clickedInsideMenu && !clickedOnButton) {
                this.closeMenu();
            }
        });

        this.links.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
    }

    toggleMenu() {
        this.btn.classList.toggle('open');
        this.menu.classList.toggle('open');
    }

    closeMenu() {
        this.btn.classList.remove('open');
        this.menu.classList.remove('open');
    }
}

// NUEVA CLASE: Controlador de Enfoque e Indicadores del Carrusel Móvil (Con función táctil)
class CarouselController extends UIAnimator {
    constructor(gridSelector, columnSelector, indicatorSelector) {
        super(gridSelector);
        this.grid = document.querySelector(gridSelector);
        this.columns = document.querySelectorAll(columnSelector);
        this.indicators = document.querySelectorAll(indicatorSelector);
    }

    init() {
        if (!this.grid || !this.columns.length || !this.indicators.length) return;

        // Solo se activa si estamos en pantalla móvil
        if (window.innerWidth > 850) return;

        // 1. Escucha cuando el usuario desliza con el dedo (Swipe)
        this.grid.addEventListener('scroll', () => {
            requestAnimationFrame(() => this.updateCarousel());
        });

        // 2. Escucha cuando el usuario TOCA una línea indicadora
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                const columnWidth = this.grid.clientWidth;
                // Desliza suavemente a la columna correspondiente
                this.grid.scrollTo({
                    left: columnWidth * index,
                    behavior: 'smooth'
                });
            });
        });

        // Ejecución inicial al cargar para iluminar la primera línea
        this.updateCarousel();
    }

    updateCarousel() {
        const scrollLeft = this.grid.scrollLeft;
        const width = this.grid.clientWidth;
        
        // Calcula qué columna está enfocada en pantalla (0 o 1)
        const activeIndex = Math.round(scrollLeft / width);

        // Actualiza las líneas (dorado activo / gris inactivo)
        this.indicators.forEach((indicator, index) => {
            if (index === activeIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        // Aplica el Enfoque Visual: atenúa la columna que no se está viendo
        this.columns.forEach((column, index) => {
            if (index === activeIndex) {
                column.style.opacity = '1';
            } else {
                column.style.opacity = '0.25'; // Transparencia elegante
            }
        });
    }
}

// --------------------------------------------------
// 2. INICIALIZACIÓN (Encendemos las herramientas)
// --------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    
    const textAnimator = new TextSequenceAnimator('.reveal-text', 200);
    textAnimator.init();

    const heroParallax = new MouseParallax('parallax-container', 'parallax-image', 15);
    heroParallax.init();

    const scrollAnimate = new ScrollObserver('.scroll-reveal');
    scrollAnimate.init();

    const accordionUI = new AccordionController('.accordion-item');
    accordionUI.init();

    const galleryFilter = new PortfolioFilter('.filter-btn', '.portfolio-item');
    galleryFilter.init();

    const mobileNav = new MobileMenu('.hamburger-btn', '.nav-menu');
    mobileNav.init();

    // ¡Aquí encendemos el Carrusel Inteligente!
    const resumeCarousel = new CarouselController('.resume-grid', '.resume-column', '.indicator-dash');
    resumeCarousel.init();

});
