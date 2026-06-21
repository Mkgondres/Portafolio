// 1. Importaciones de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDBg0n4lFbO42s1sax3ve4_jKDpQGkdQCo",
  authDomain: "mi-portafolio-aad90.firebaseapp.com",
  projectId: "mi-portafolio-aad90",
  storageBucket: "mi-portafolio-aad90.firebasestorage.app",
  messagingSenderId: "207584593414",
  appId: "1:207584593414:web:eecfe3e8531d4872626587",
  measurementId: "G-YRFNL9X3SK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. Clases del Sistema
class UIAnimator {
    constructor(selector) { this.elements = document.querySelectorAll(selector); }
}

class TextSequenceAnimator extends UIAnimator {
    constructor(selector, delayIncrement = 250) { super(selector); this.delayIncrement = delayIncrement; }
    init() {
        this.elements.forEach((element, index) => { 
            setTimeout(() => { element.classList.add('visible'); }, index * this.delayIncrement); 
        });
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
        this.visibleItems = [];
        this.currentIndex = 0;
    }
    init() {
        if (!this.lightbox) return;
        const contenedor = document.getElementById('contenedor-proyectos');
        if (contenedor) {
            contenedor.addEventListener('click', (e) => {
                const item = e.target.closest('.portfolio-item');
                if (item) this.openLightbox(item);
            });
        }
        this.closeBtn.addEventListener('click', () => this.closeLightbox());
        this.prevBtn.addEventListener('click', () => this.navigate(-1));
        this.nextBtn.addEventListener('click', () => this.navigate(1));
    }
    openLightbox(clickedItem) {
        // Seleccionamos items visibles y los convertimos en array
        this.visibleItems = Array.from(document.querySelectorAll('.portfolio-item'))
                                .filter(i => window.getComputedStyle(i).display !== 'none');
        this.currentIndex = this.visibleItems.indexOf(clickedItem);
        this.updateLightboxContent();
        this.lightbox.classList.add('active');
        document.body.classList.add('no-scroll');
        document.documentElement.classList.add('no-scroll');
    }
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.classList.remove('no-scroll');
        document.documentElement.classList.remove('no-scroll');
    }
    navigate(direction) {
        this.currentIndex += direction;
        if (this.currentIndex >= this.visibleItems.length) this.currentIndex = 0;
        if (this.currentIndex < 0) this.currentIndex = this.visibleItems.length - 1;
        this.updateLightboxContent();
    }
    updateLightboxContent() {
        const item = this.visibleItems[this.currentIndex];
        if (item) {
            this.img.src = item.querySelector('img').src;
            this.title.textContent = item.querySelector('.item-title').textContent;
            this.category.textContent = item.querySelector('.item-category').textContent;
        }
    }
}

// 3. Ejecución Segura
async function cargarProyectos() {
    const contenedor = document.getElementById('contenedor-proyectos');
    if (!contenedor) return;
    try {
        const querySnapshot = await getDocs(collection(db, "proyecto"));
        let htmlAcumulado = "";
        querySnapshot.forEach((doc) => {
            const p = doc.data();
            htmlAcumulado += `<div class="portfolio-item scroll-reveal" data-category="residencial"><div class="item-image-wrapper"><img src="${p.imagen}" alt="${p.titulo}"></div><div class="portfolio-item-info"><h3 class="item-title">${p.titulo}</h3><span class="item-category">${p.descripcion}</span></div></div>`;
        });
        contenedor.insertAdjacentHTML('beforeend', htmlAcumulado);
    } catch (e) { console.error("Error al cargar Firebase, pero el resto de la web sigue funcionando."); }
}

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargar proyectos
    await cargarProyectos();
    
    // 2. Inicializar componentes solo cuando ya existe el HTML
    new TextSequenceAnimator('.reveal-text', 200).init();
    
    // Inicializar el resto de tus clases (PortfolioFilter, Accordion, etc) igual que antes
    // (Omitidas para brevedad, pero mantenlas aquí si las necesitas)
    
    new LightboxGallery().init();
});
