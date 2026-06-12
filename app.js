
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

// 2. CLASE: Animación de textos en cascada (Single Responsibility Principle)
class TextSequenceAnimator extends UIAnimator {
    constructor(selector, delayIncrement = 250) {
        super(selector);
        this.delayIncrement = delayIncrement;
    }

    init() {
        if (!this.elements.length) return;
        
        // Ejecuta la animación al cargar la ventana
        window.addEventListener('load', () => {
            this.elements.forEach((element, index) => {
                setTimeout(() => {
                    element.classList.add('visible');
                }, index * this.delayIncrement);
            });
        });
    }
}

// 3. CLASE: Efecto Parallax interactivo con el ratón (Alta Interactividad)
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
        // Calcula la posición del ratón relativa al centro del contenedor
        const rect = this.container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calcula el desplazamiento (movimiento sutil inverso al ratón)
        const moveX = ((mouseX - centerX) / centerX) * -this.intensity;
        const moveY = ((mouseY - centerY) / centerY) * -this.intensity;

        // Aplica el estilo usando requestAnimationFrame para máxima fluidez
        requestAnimationFrame(() => {
            this.target.style.transform = `translate(${moveX}px, ${moveY}px)`;
            this.target.style.transition = 'none'; // Quita la transición para que siga al ratón al instante
        });
    }

    handleMouseLeave() {
        // Devuelve la imagen a su posición original suavemente
        requestAnimationFrame(() => {
            this.target.style.transform = 'translate(0px, 0px)';
            this.target.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        });
    }
}

/**
 * ==========================================
 * INICIALIZACIÓN
 * ==========================================
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Instanciar animaciones de texto (Los textos subirán suavemente uno a uno)
    const textAnimator = new TextSequenceAnimator('.reveal-text', 200);
    textAnimator.init();

    // 2. Instanciar el efecto interactivo Parallax en la imagen
    const heroParallax = new MouseParallax('parallax-container', 'parallax-image', 15);
    heroParallax.init();

});
