/**
 * ==========================================
 * Arquitectura JS - SOLID Principles
 * ==========================================
 */

// 1. CLASE BASE: Componente genérico de UI (Open/Closed Principle)
class UIAnimator {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
    }
    init() {
        throw new Error("El método init() debe implementarse en la subclase.");
    }
}

// 2. CLASE: Animación de textos en cascada (Hero)
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

// 3. CLASE: Efecto Parallax interactivo con el ratón
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

// 4. CLASE NUEVA: Observador de Scroll para revelar elementos (Single Responsibility Principle)
class ScrollObserver extends UIAnimator {
    constructor(selector, options = {}) {
        super(selector);
        this.options = {
            root: null,
            threshold: 0.1, // Se activa cuando el 10% del párrafo entra en pantalla
            ...options
        };
    }

    init() {
        if (!this.elements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Animación de un solo sentido
                }
            });
        }, this.options);

        this.elements.forEach(el => observer.observe(el));
    }
}

/**
 * ==========================================
 * INICIALIZACIÓN
 * ==========================================
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // Inicializaciones Sección 1
    const textAnimator = new TextSequenceAnimator('.reveal-text', 200);
    textAnimator.init();

    const heroParallax = new MouseParallax('parallax-container', 'parallax-image', 15);
    heroParallax.init();

    // Inicialización Sección 2 (Nuevo)
    const scrollAnimate = new ScrollObserver('.scroll-reveal');
    scrollAnimate.init();

});
