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

// CLASE: Observador de Scroll para revelar elementos (Secciones 2, 3 y 4)
class ScrollObserver extends UIAnimator {
    constructor(selector, options = {}) {
        super(selector);
        this.options = {
            root: null,
            threshold: 0.1, 
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

// NUEVA CLASE: Controlador del Acordeón Interactivo (Sección 4)
class AccordionController extends UIAnimator {
    constructor(selector) {
        super(selector);
    }

    init() {
        if (!this.elements.length) return;

        this.elements.forEach(item => {
            const header = item.querySelector('.accordion-header');
            
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Cierra todos los elementos primero
                this.elements.forEach(el => el.classList.remove('active'));

                // Si el que clickeamos NO estaba activo, lo abrimos.
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
}

// --------------------------------------------------
// 2. INICIALIZACIÓN (Encendemos las herramientas)
// --------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    
    // Inicializaciones Sección 1
    const textAnimator = new TextSequenceAnimator('.reveal-text', 200);
    textAnimator.init();

    const heroParallax = new MouseParallax('parallax-container', 'parallax-image', 15);
    heroParallax.init();

    // Inicializaciones Sección 2 y 3 (Scroll Reveal general)
    const scrollAnimate = new ScrollObserver('.scroll-reveal');
    scrollAnimate.init();

    // Inicialización Sección 4 (Acordeón)
    const accordionUI = new AccordionController('.accordion-item');
    accordionUI.init();

});
