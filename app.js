/**
 * ==========================================
 * Principios SOLID y POO aplicados:
 * 1. Single Responsibility Principle (SRP): Cada clase tiene un solo trabajo.
 * 2. Open/Closed Principle (OCP): La clase base UIComponent puede extenderse sin modificarse.
 * ==========================================
 */

// Clase Base: Interfaz genérica para componentes de UI
class UIComponent {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
    }

    init() {
        throw new Error("El método init() debe ser implementado por la subclase.");
    }
}

// Clase Hija: Encargada ÚNICAMENTE de las animaciones de entrada (SRP)
class EntranceAnimator extends UIComponent {
    constructor(selector, delayIncrement = 200) {
        super(selector);
        this.delayIncrement = delayIncrement;
    }

    // Implementación del método obligatorio
    init() {
        this.animateElements();
    }

    animateElements() {
        if (!this.elements) return;

        this.elements.forEach((element, index) => {
            // Añadimos un retraso progresivo (stagger effect) para que no aparezcan de golpe
            setTimeout(() => {
                element.classList.add('visible');
            }, index * this.delayIncrement);
        });
    }
}

// ================= INICIALIZACIÓN =================
// Se ejecuta cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    
    // Instanciamos el animador específicamente para los elementos ".fade-in" del Hero
    const heroAnimator = new EntranceAnimator('.fade-in', 300);
    heroAnimator.init();

});
