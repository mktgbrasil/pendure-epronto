/* ==========================================================================
   MOBILE NAVIGATION MENU
   ========================================================================== */
const mobileToggle = document.getElementById('mobile-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Active status styling
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

/* ==========================================================================
   3D HERO FAN SHOWCASE ANIMATION (CYCLIC CAROUSEL)
   ========================================================================== */
const showcaseCards = document.querySelectorAll('.showcase-card');
const carouselDots = document.querySelectorAll('.carousel-indicator .dot');
const arrowLeft = document.querySelector('.carousel-indicator .arrow.left');
const arrowRight = document.querySelector('.carousel-indicator .arrow.right');

let currentShowcaseIndex = 1; // Center card (index 1) is active by default
const cardClasses = ['card-left', 'card-center', 'card-right'];

function updateShowcasePositions() {
    showcaseCards.forEach((card, index) => {
        // Clear old positional classes
        card.classList.remove('card-left', 'card-center', 'card-right');
        
        // Calculate shifted position
        // This is a simple modular arithmetic rotation
        let positionIndex = (index - currentShowcaseIndex + 4) % 3;
        card.classList.add(cardClasses[positionIndex]);
    });

    // Update dots indicator
    carouselDots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentShowcaseIndex) {
            dot.classList.add('active');
        }
    });
}

// Auto-rotation timer (1 second interval)
let autoRotateInterval = setInterval(() => {
    currentShowcaseIndex = (currentShowcaseIndex + 1) % 3;
    updateShowcasePositions();
}, 1000);

function resetAutoRotate() {
    clearInterval(autoRotateInterval);
    autoRotateInterval = setInterval(() => {
        currentShowcaseIndex = (currentShowcaseIndex + 1) % 3;
        updateShowcasePositions();
    }, 1000);
}

// Click cards directly to rotate
showcaseCards.forEach((card, index) => {
    card.addEventListener('click', () => {
        currentShowcaseIndex = index;
        updateShowcasePositions();
        resetAutoRotate();
    });
});

// Click dots to rotate
carouselDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentShowcaseIndex = index;
        updateShowcasePositions();
        resetAutoRotate();
    });
});

// Click arrows to rotate
if (arrowLeft) {
    arrowLeft.addEventListener('click', () => {
        currentShowcaseIndex = (currentShowcaseIndex - 1 + 3) % 3;
        updateShowcasePositions();
        resetAutoRotate();
    });
}

if (arrowRight) {
    arrowRight.addEventListener('click', () => {
        currentShowcaseIndex = (currentShowcaseIndex + 1) % 3;
        updateShowcasePositions();
        resetAutoRotate();
    });
}

// Initial position setup
updateShowcasePositions();


/* ==========================================================================
   DYNAMIC PRODUCT FILTERING
   ========================================================================== */
const tabButtons = document.querySelectorAll('.tab-btn');
const categorySelect = document.getElementById('category-select');
const productCards = document.querySelectorAll('.product-card');

function filterProducts(category) {
    productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        // Fade-out effect
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            if (category === 'todos' || cardCategory === category) {
                card.style.display = 'flex';
                // Trigger reflow to restart transition
                card.offsetHeight; 
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.display = 'none';
            }
        }, 150);
    });
}

// Handling tab filter clicks
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Set active class
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        filterProducts(filterValue);
        
        // Sync the dropdown select value
        if (categorySelect) {
            categorySelect.value = filterValue;
        }
    });
});

// Handling mobile select dropdown changes
if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
        const selectedValue = e.target.value;
        filterProducts(selectedValue);
        
        // Sync horizontal tabs
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === selectedValue) {
                btn.classList.add('active');
            }
        });
    });
}

// Show More Button Actions
const btnShowMore = document.getElementById('btn-show-more');
if (btnShowMore) {
    btnShowMore.addEventListener('click', () => {
        // Open WhatsApp to request complete catalogue
        window.open('https://wa.me/5511968126432?text=Olá!%20Achei%20seu%20site%20e%20gostaria%20de%20receber%20o%20catálogo%20completo%20de%20quadros.', '_blank');
    });
}


/* ==========================================================================
   INTERACTIVE SOFA WALL SIMULATOR MODAL
   ========================================================================== */
const modal = document.getElementById('simulation-modal');
const modalFrameImg = document.getElementById('modal-frame-image');
const modalTitle = document.getElementById('modal-art-title');
const modalCategory = document.getElementById('modal-art-category');
const priceValueText = document.getElementById('price-value');

// Selection State variables
let currentArtName = '';
let currentMaterial = 'vidro';
let currentSize = 'A3';
let currentFrame = 'sem_moldura';

// Pricing configuration matrices
const pricing = {
    basePrice: {
        vidro: 180,    // Digital UV Print on 4mm Tempered Glass
        canvas: 110,   // Canvas Print Wrap
        papel: 65      // Fine Art Paper (requires frame)
    },
    sizeFactor: {
        A3: 1.0,       // 30x42 cm
        medium: 1.8,   // 40x60 cm
        large: 2.6,    // 50x70 cm
        xlarge: 3.8    // 60x90 cm
    },
    framePrice: {
        sem_moldura: 0,
        moldura_filete: 60,
        moldura_madeira: 85
    }
};

const labels = {
    material: {
        vidro: 'Impressão Digital em Vidro Temperado (4mm)',
        canvas: 'Impressão Premium em Canvas',
        papel: 'Papel Fotográfico Fine Art'
    },
    size: {
        A3: 'A3 (30x42cm)',
        medium: '40x60 cm',
        large: '50x70 cm',
        xlarge: '60x90 cm'
    },
    frame: {
        sem_moldura: 'Sem Moldura (Bordas Lapidadas)',
        moldura_filete: 'Moldura Filete Preta',
        moldura_madeira: 'Moldura de Madeira Freijó'
    }
};

function calculatePrice() {
    const base = pricing.basePrice[currentMaterial];
    const factor = pricing.sizeFactor[currentSize];
    const frameAddon = pricing.framePrice[currentFrame];
    
    // Glass printing requires no frame or special frame, Paper requires a frame
    // Let's implement a logical price calculation
    let calculated = (base * factor) + frameAddon;
    
    // Formatting currency in BRL
    priceValueText.innerText = `R$ ${calculated.toFixed(2).replace('.', ',')}`;
}

function openSimulationModal(artTitle, imgSrc, category) {
    currentArtName = artTitle;
    
    // Set text and image
    modalTitle.innerText = artTitle;
    modalFrameImg.src = imgSrc;
    modalCategory.innerText = category === 'vidro' ? 'Coleção Impressão em Vidro' : 'Coleção ' + category.toUpperCase();
    
    // Reset option selections to defaults
    resetModalOptions();
    
    // Open Modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
    
    // Calculate initial price
    calculatePrice();
    updateSimulatorVisuals();
}

function closeSimulationModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Unlock background scrolling
}

// Close modal when clicking outside content area
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeSimulationModal();
        }
    });
}

function resetModalOptions() {
    // Reset states
    currentMaterial = 'vidro';
    currentSize = 'A3';
    currentFrame = 'sem_moldura';
    
    // Reset DOM buttons active classes
    setActiveOptionButton('material-selector', currentMaterial);
    setActiveOptionButton('size-selector', currentSize);
    setActiveOptionButton('frame-selector', currentFrame);
}

function setActiveOptionButton(containerId, value) {
    const container = document.getElementById(containerId);
    if (container) {
        const buttons = container.querySelectorAll('.opt-btn');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-value') === value) {
                btn.classList.add('active');
            }
        });
    }
}

function selectOption(button, type) {
    const value = button.getAttribute('data-value');
    
    // Select siblings and toggle class
    const parent = button.parentElement;
    parent.querySelectorAll('.opt-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    if (type === 'material') {
        currentMaterial = value;
        
        // Logical rule: Paper cannot be frameless, automatically force frame if paper is selected
        if (currentMaterial === 'papel' && currentFrame === 'sem_moldura') {
            currentFrame = 'moldura_filete';
            setActiveOptionButton('frame-selector', currentFrame);
        }
        
        // Logical rule: Glass is often best frameless, but can have frame.
    } else if (type === 'size') {
        currentSize = value;
    } else if (type === 'frame') {
        currentFrame = value;
        
        // Logical rule: Paper cannot be frameless
        if (currentFrame === 'sem_moldura' && currentMaterial === 'papel') {
            currentMaterial = 'vidro';
            setActiveOptionButton('material-selector', currentMaterial);
        }
    }
    
    updateSimulatorVisuals();
    calculatePrice();
}

// Update the size scale and borders of the frame in the simulated living room
function updateSimulatorVisuals() {
    const frameContainer = document.querySelector('.simulated-frame-container');
    const frameImg = document.getElementById('modal-frame-image');
    
    if (frameContainer && frameImg) {
        // Reset sizes and frames classes
        frameContainer.className = 'simulated-frame-container';
        frameImg.className = 'simulated-frame';
        
        // Add current selected size class (sz-A3, sz-medium, sz-large, sz-xlarge)
        frameContainer.classList.add('sz-' + currentSize);
        
        // Add current selected frame style class (frm-sem_moldura, frm-moldura_filete, frm-moldura_madeira)
        frameImg.classList.add('frm-' + currentFrame);
    }
}

/* ==========================================================================
   WHATSAPP ORDER GENERATION
   ========================================================================== */
function sendOrderToWhatsApp() {
    const materialLabel = labels.material[currentMaterial];
    const sizeLabel = labels.size[currentSize];
    const frameLabel = labels.frame[currentFrame];
    const priceText = priceValueText.innerText;
    
    const message = `Olá Pendure e Pronto! Gostaria de fazer um orçamento para o quadro *${currentArtName}* com as seguintes customizações que simulei no site:

• *Material:* ${materialLabel}
• *Tamanho:* ${sizeLabel}
• *Moldura:* ${frameLabel}
• *Preço Estimativo:* ${priceText}

Gostaria de saber o valor do frete e os prazos de entrega e instalação para minha região!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5511968126432?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

/* ==========================================================================
   AI ROOM SIMULATOR LOGIC (SIMULADOR IA DE PAREDE)
   ========================================================================== */
let currentIAMaterial = 'vidro';
let currentIASizeLabel = '50 x 70 cm';
let currentIABasePrice = 320;
let currentIAFrameVal = 'sem';
let currentIAFrameAddon = 0;
let currentIAPhotoSource = 'custom_family.jpg';

// Dragging and Zooming State
let photoPosX = 0;
let photoPosY = 0;
let photoScale = 1;
let isDraggingPhoto = false;
let startMouseX = 0;
let startMouseY = 0;

function applyIAPhotoTransform() {
    const previewImg = document.getElementById('ia-preview-img');
    const container = document.getElementById('ia-wall-frame');
    
    if (previewImg && container) {
        const cRect = container.getBoundingClientRect();
        const imgNW = previewImg.naturalWidth || cRect.width;
        const imgNH = previewImg.naturalHeight || cRect.height;
        
        if (cRect.width === 0 || cRect.height === 0) return;

        const containerRatio = cRect.width / cRect.height;
        const imgRatio = imgNW / imgNH;
        
        let renderedImgWidth, renderedImgHeight;
        
        if (imgRatio > containerRatio) {
            // Image is wider than container
            renderedImgHeight = cRect.height * photoScale;
            renderedImgWidth = renderedImgHeight * imgRatio;
        } else {
            // Image is taller than container
            renderedImgWidth = cRect.width * photoScale;
            renderedImgHeight = renderedImgWidth / imgRatio;
        }
        
        const maxDragX = Math.max(0, (renderedImgWidth - cRect.width) / 2);
        const maxDragY = Math.max(0, (renderedImgHeight - cRect.height) / 2);
        
        // Clamp position within exact visual bounds
        photoPosX = Math.max(-maxDragX, Math.min(maxDragX, photoPosX));
        photoPosY = Math.max(-maxDragY, Math.min(maxDragY, photoPosY));
        
        previewImg.style.transform = `translate(${photoPosX}px, ${photoPosY}px) scale(${photoScale})`;
    }
}

function onIAZoomChange(val) {
    photoScale = parseFloat(val);
    applyIAPhotoTransform();
}

function resetIAPhotoTransform() {
    photoPosX = 0;
    photoPosY = 0;
    photoScale = 1;
    const zoomRange = document.getElementById('ia-zoom-range');
    if (zoomRange) zoomRange.value = 1;
    applyIAPhotoTransform();
}

// Initialize file upload & drag/touch listeners
document.addEventListener('DOMContentLoaded', function() {
    const iaPhotoUploadInput = document.getElementById('ia-photo-upload');
    if (iaPhotoUploadInput) {
        iaPhotoUploadInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (evt) {
                    const previewImg = document.getElementById('ia-preview-img');
                    if (previewImg) {
                        previewImg.src = evt.target.result;
                        currentIAPhotoSource = 'Foto Pessoal do Cliente (' + file.name + ')';
                        resetIAPhotoTransform();
                    }
                    
                    // Clear active thumbnail preset styling
                    document.querySelectorAll('.ia-thumb-btn').forEach(btn => btn.classList.remove('active'));
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Drag and Touch Handlers on the Frame Container
    const frameContainer = document.getElementById('ia-wall-frame');
    if (frameContainer) {
        // Mouse Events
        frameContainer.addEventListener('mousedown', function(e) {
            e.preventDefault();
            isDraggingPhoto = true;
            startMouseX = e.clientX - photoPosX;
            startMouseY = e.clientY - photoPosY;
            frameContainer.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', function(e) {
            if (!isDraggingPhoto) return;
            photoPosX = e.clientX - startMouseX;
            photoPosY = e.clientY - startMouseY;
            applyIAPhotoTransform();
        });

        window.addEventListener('mouseup', function() {
            if (isDraggingPhoto) {
                isDraggingPhoto = false;
                if (frameContainer) frameContainer.style.cursor = 'grab';
            }
        });

        // Touch Events (Mobile / Tablets)
        frameContainer.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1) {
                isDraggingPhoto = true;
                startMouseX = e.touches[0].clientX - photoPosX;
                startMouseY = e.touches[0].clientY - photoPosY;
            }
        }, { passive: true });

        window.addEventListener('touchmove', function(e) {
            if (!isDraggingPhoto || e.touches.length !== 1) return;
            photoPosX = e.touches[0].clientX - startMouseX;
            photoPosY = e.touches[0].clientY - startMouseY;
            applyIAPhotoTransform();
        }, { passive: true });

        window.addEventListener('touchend', function() {
            isDraggingPhoto = false;
        });
    }
});

function setIAPreviewPhoto(imageSrc, buttonEl) {
    const previewImg = document.getElementById('ia-preview-img');
    if (previewImg) {
        previewImg.src = imageSrc;
        currentIAPhotoSource = imageSrc;
        resetIAPhotoTransform();
    }
    document.querySelectorAll('.ia-thumb-btn').forEach(btn => btn.classList.remove('active'));
    if (buttonEl) buttonEl.classList.add('active');
}

function setIAMaterial(matVal, buttonEl) {
    currentIAMaterial = matVal;
    const wallFrame = document.getElementById('ia-wall-frame');
    if (wallFrame) {
        if (matVal === 'canvas') {
            wallFrame.classList.add('material-canvas');
            wallFrame.classList.remove('material-vidro');
        } else {
            wallFrame.classList.add('material-vidro');
            wallFrame.classList.remove('material-canvas');
        }
    }
    
    // Toggle active state
    if (buttonEl && buttonEl.parentElement) {
        buttonEl.parentElement.querySelectorAll('.ia-btn-opt').forEach(btn => btn.classList.remove('active'));
        buttonEl.classList.add('active');
    }
    
    updateIATotalPrice();
}

function setIASize(buttonEl) {
    const w = buttonEl.getAttribute('data-w');
    const h = buttonEl.getAttribute('data-h');
    const label = buttonEl.getAttribute('data-label');
    const price = parseFloat(buttonEl.getAttribute('data-price'));
    
    currentIASizeLabel = label;
    currentIABasePrice = price;
    
    const wallFrame = document.getElementById('ia-wall-frame');
    const sizeBadge = document.getElementById('ia-size-badge');
    
    if (wallFrame) {
        wallFrame.style.width = w;
        wallFrame.style.height = h;
    }
    if (sizeBadge) {
        sizeBadge.innerText = 'Tamanho Real: ' + label;
    }
    
    if (buttonEl && buttonEl.parentElement) {
        buttonEl.parentElement.querySelectorAll('.ia-btn-opt').forEach(btn => btn.classList.remove('active'));
        buttonEl.classList.add('active');
    }
    
    updateIATotalPrice();
}

function setIAFrame(frameVal, buttonEl) {
    currentIAFrameVal = frameVal;
    currentIAFrameAddon = parseFloat(buttonEl.getAttribute('data-add'));
    
    const wallFrame = document.getElementById('ia-wall-frame');
    if (wallFrame) {
        wallFrame.classList.remove('frame-sem', 'frame-filete', 'frame-madeira');
        wallFrame.classList.add('frame-' + frameVal);
    }
    
    if (buttonEl && buttonEl.parentElement) {
        buttonEl.parentElement.querySelectorAll('.ia-btn-opt').forEach(btn => btn.classList.remove('active'));
        buttonEl.classList.add('active');
    }
    
    updateIATotalPrice();
}

function updateIATotalPrice() {
    let materialMultiplier = currentIAMaterial === 'vidro' ? 1.0 : 0.85;
    let total = (currentIABasePrice * materialMultiplier) + currentIAFrameAddon;
    
    const totalPriceEl = document.getElementById('ia-total-price');
    if (totalPriceEl) {
        totalPriceEl.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
}

function sendIASimulationToWhatsApp() {
    const materialText = currentIAMaterial === 'vidro' ? 'Vidro Temperado 4mm (Com Brilho)' : 'Tela Canvas Fine Art (Texturizada)';
    let frameText = 'Sem Moldura (Vidro Puro)';
    if (currentIAFrameVal === 'filete') frameText = 'Filete Preto';
    if (currentIAFrameVal === 'madeira') frameText = 'Madeira Freijó';
    
    const totalPriceEl = document.getElementById('ia-total-price');
    const priceText = totalPriceEl ? totalPriceEl.innerText : 'R$ 320,00';
    
    const message = `Olá Pendure e Pronto! Fiz uma simulação da MINHA FOTO no Simulador IA da sala no site e gostaria de encomendar o meu quadro:

• *Foto:* ${currentIAPhotoSource}
• *Acabamento:* ${materialText}
• *Tamanho na Parede:* ${currentIASizeLabel}
• *Moldura:* ${frameText}
• *Valor Estimado:* ${priceText}

Vou enviar a imagem original em alta resolução aqui pelo WhatsApp para vocês prepararem a simulação final e o envio!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5511968126432?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}
