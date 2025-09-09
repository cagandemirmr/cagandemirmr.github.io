"use strict";

// 1. MOBILE OPTIMIZER CLASS'INI EKLE
class MobileOptimizer {
    constructor() {
        this.isMobile = this.checkMobileDevice();
        this.init();
    }

    checkMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    init() {
        if (this.isMobile) {
            this.applyMobileOptimizations();
        }
    }

    applyMobileOptimizations() {
        this.removeTapDelay();
        this.optimizeTouchEvents();
        this.fixMobileTables(); // Tablo düzeltmelerini ekle
    }

    removeTapDelay() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-tap-highlight-color: transparent !important;
                -webkit-touch-callout: none !important;
            }
            input, textarea, [contenteditable] {
                -webkit-user-select: text !important;
                user-select: text !important;
            }
            
            /* MOBILE TABLE FIXES */
            table {
                width: 100% !important;
                max-width: 100% !important;
                display: block !important;
                overflow-x: auto !important;
                -webkit-overflow-scrolling: touch !important;
            }
            
            th, td {
                min-width: 80px !important;
                white-space: nowrap !important;
            }
            
            .table-container {
                overflow-x: auto !important;
                -webkit-overflow-scrolling: touch !important;
                width: 100% !important;
            }
        `;
        document.head.appendChild(style);
    }

    optimizeTouchEvents() {
        // Basit touch optimizasyonu
        if ('ontouchstart' in window) {
            document.documentElement.style.touchAction = 'manipulation';
        }
    }

    fixMobileTables() {
        // Tüm tabloları mobil uyumlu hale getir
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            // Tabloyu bir container içine al
            if (!table.parentElement.classList.contains('table-container')) {
                const container = document.createElement('div');
                container.className = 'table-container';
                table.parentElement.insertBefore(container, table);
                container.appendChild(table);
            }
            
            // Mobil için özel stiller
            table.style.minWidth = '100%';
            table.style.tableLayout = 'auto';
        });
    }
}

// Hemen çalıştır
new MobileOptimizer();

// Breakpoints fonksiyonu - ORİJİNAL KODU KORU
const breakpoints = (function () {
    "use strict";
    const l = {
        list: null,
        media: {},
        events: [],
        
        isMobile: function() {
            return window.innerWidth <= 767;
        },
        
        isTouchDevice: function() {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        },

        init(e) {
            l.list = e;
            ["resize", "orientationchange", "load", "fullscreenchange"].forEach(event => {
                window.addEventListener(event, l.poll);
            });
        },
        active(e) {
            if (!(e in l.media)) {
                let t, n, r, i, o, a, s;
                if (e.substr(0, 2) === ">=") (n = "gte", t = e.substr(2));
                else if (e.substr(0, 2) === "<=") (n = "lte", t = e.substr(2));
                else if (e.substr(0, 1) === ">") (n = "gt", t = e.substr(1));
                else if (e.substr(0, 1) === "<") (n = "lt", t = e.substr(1));
                else if (e.substr(0, 1) === "!") (n = "not", t = e.substr(1));
                else (n = "eq", t = e);

                if (t && t in l.list) {
                    i = l.list[t];
                    if (Array.isArray(i)) {
                        o = parseInt(i[0]);
                        a = parseInt(i[1]);
                        isNaN(o) ? (s = i[1].substr(String(a).length)) : (s = i[0].substr(String(o).length));
                        if (isNaN(o)) {
                            switch (n) {
                                case "gte": r = "screen"; break;
                                case "lte": r = `screen and (max-width: ${a}${s})`; break;
                                case "gt": r = `screen and (min-width: ${a + 1}${s})`; break;
                                case "lt": r = "screen and (max-width: -1px)"; break;
                                case "not": r = `screen and (min-width: ${a + 1}${s})`; break;
                                default: r = `screen and (max-width: ${a}${s})`;
                            }
                        } else if (isNaN(a)) {
                            switch (n) {
                                case "gte": r = `screen and (min-width: ${o}${s})`; break;
                                case "lte": r = "screen"; break;
                                case "gt": r = "screen and (max-width: -1px)"; break;
                                case "lt": r = `screen and (max-width: ${o - 1}${s})`; break;
                                case "not": r = `screen and (max-width: ${o - 1}${s})`; break;
                                default: r = `screen and (min-width: ${o}${s})`;
                            }
                        } else {
                            switch (n) {
                                case "gte": r = `screen and (min-width: ${o}${s})`; break;
                                case "lte": r = `screen and (max-width: ${a}${s})`; break;
                                case "gt": r = `screen and (min-width: ${a + 1}${s})`; break;
                                case "lt": r = `screen and (max-width: ${o - 1}${s})`; break;
                                case "not": r = `screen and (max-width: ${o - 1}${s}), screen and (min-width: ${a + 1}${s})`; break;
                                default: r = `screen and (min-width: ${o}${s}) and (max-width: ${a}${s})`;
                            }
                        }
                    } else {
                        r = i.charAt(0) === "(" ? `screen and ${i}` : i;
                    }
                    l.media[e] = !!r && r;
                }
            }
            return l.media[e] !== false && window.matchMedia(l.media[e]).matches;
        },
        on(e, t) {
            l.events.push({ query: e, handler: t, state: false });
            l.active(e) && t();
        },
        poll() {
            l.events.forEach(event => {
                const active = l.active(event.query);
                if (active && !event.state) {
                    event.state = true;
                    event.handler();
                } else if (!active && event.state) {
                    event.state = false;
                }
            });
        }
    };

    return {
        _: l,
        on(e, t) {
            l.on(e, t);
        },
        active(e) {
            return l.active(e);
        },
        isMobile: l.isMobile,
        isTouchDevice: l.isTouchDevice
    };
})();

// Browser detection - ORİJİNAL KODU KORU
const browser = (function () {
    "use strict";
    const o = {
        name: null,
        version: null,
        os: null,
        osVersion: null,
        touch: null,
        mobile: null,
        _canUse: null,
        canUse(e) {
            o._canUse || (o._canUse = document.createElement("div"));
            const t = o._canUse.style;
            const n = e.charAt(0).toUpperCase() + e.slice(1);
            return e in t || `Moz${n}` in t || `Webkit${n}` in t || `O${n}` in t || `ms${n}` in t;
        },
        init() {
            const e = navigator.userAgent;
            let t = "other";
            let n = 0;
            const r = [
                ["firefox", /Firefox\/([0-9\.]+)/],
                ["bb", /BlackBerry.+Version\/([0-9\.]+)/],
                ["bb", /BB[0-9]+.+Version\/([0-9\.]+)/],
                ["opera", /OPR\/([0-9\.]+)/],
                ["opera", /Opera\/([0-9\.]+)/],
                ["edge", /Edge\/([0-9\.]+)/],
                ["safari", /Version\/([0-9\.]+).+Safari/],
                ["chrome", /Chrome\/([0-9\.]+)/],
                ["ie", /MSIE ([0-9]+)/],
                ["ie", /Trident\/.+rv:([0-9]+)/]
            ];

            for (let i = 0; i < r.length; i++) {
                if (e.match(r[i][1])) {
                    t = r[i][0];
                    n = parseFloat(RegExp.$1);
                    break;
                }
            }

            o.name = t;
            o.version = n;
            t = "other";
            const r2 = [
                ["ios", /([0-9_]+) like Mac OS X/, e => e.replace("_", ".").replace("_", "")],
                ["ios", /CPU like Mac OS X/, () => 0],
                ["wp", /Windows Phone ([0-9\.]+)/, null],
                ["android", /Android ([0-9\.]+)/, null],
                ["mac", /Macintosh.+Mac OS X ([0-9_]+)/, e => e.replace("_", ".").replace("_", "")],
                ["windows", /Windows NT ([0-9\.]+)/, null],
                ["bb", /BlackBerry.+Version\/([0-9\.]+)/, null],
                ["bb", /BB[0-9]+.+Version\/([0-9\.]+)/, null],
                ["linux", /Linux/, null],
                ["bsd", /BSD/, null],
                ["unix", /X11/, null]
            ];

            n = 0;
            for (let i = 0; i < r2.length; i++) {
                if (e.match(r2[i][1])) {
                    t = r2[i][0];
                    n = parseFloat(r2[i][2] ? r2[i][2](RegExp.$1) : RegExp.$1);
                    break;
                }
            }

            if (t === "mac" && "ontouchstart" in window) {
                const screen = window.screen;
                if (
                    (screen.width === 1024 && screen.height === 1366) ||
                    (screen.width === 834 && screen.height === 1112) ||
                    (screen.width === 810 && screen.height === 1080) ||
                    (screen.width === 768 && screen.height === 1024)
                ) {
                    t = "ios";
                }
            }

            o.os = t;
            o.osVersion = n;
            o.touch = o.os === "wp" ? navigator.msMaxTouchPoints > 0 : "ontouchstart" in window;
            o.mobile = ["wp", "android", "ios", "bb"].includes(o.os);
        }
    };

    o.init();
    return o;
})();

// jQuery replacement - BASİT VERSİYON
class SimpleQuery {
    constructor(selector) {
        if (typeof selector === 'string') {
            this.elements = Array.from(document.querySelectorAll(selector));
        } else if (selector instanceof NodeList) {
            this.elements = Array.from(selector);
        } else if (selector instanceof Element) {
            this.elements = [selector];
        } else {
            this.elements = [];
        }
    }

    on(event, handler) {
        this.elements.forEach(element => {
            element.addEventListener(event, handler);
        });
        return this;
    }

    addClass(className) {
        this.elements.forEach(element => {
            element.classList.add(className);
        });
        return this;
    }

    removeClass(className) {
        this.elements.forEach(element => {
            element.classList.remove(className);
        });
        return this;
    }

    css(property, value) {
        if (value === undefined) {
            return this.elements[0] ? getComputedStyle(this.elements[0])[property] : null;
        }
        
        this.elements.forEach(element => {
            element.style[property] = value;
        });
        return this;
    }
}

// Global $ function
window.$ = (selector) => new SimpleQuery(selector);

// Basit Scrolly implementation
class SimpleScrolly {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }
}

// Basit Parallax implementation
class SimpleParallax {
    constructor(selector, intensity = 0.5) {
        this.elements = Array.from(document.querySelectorAll(selector));
        this.intensity = intensity;
        this.init();
    }

    init() {
        if (breakpoints.isMobile()) return; // Disable on mobile
        
        window.addEventListener('scroll', () => {
            this.animate();
        }, { passive: true });
    }

    animate() {
        const scrollY = window.scrollY;
        
        this.elements.forEach(element => {
            const movement = scrollY * this.intensity;
            element.style.transform = `translateY(${movement}px)`;
        });
    }
}

// DOM Ready helper
function domReady(callback) {
    if (document.readyState !== 'loading') {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
}

// MOBILE TABLE FIX FUNCTIONS
function initMobileTableFix() {
    if (!breakpoints.isMobile()) return;
    
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        // Tablo container kontrolü
        if (!table.closest('.table-container')) {
            const container = document.createElement('div');
            container.className = 'table-container';
            container.style.overflowX = 'auto';
            container.style.webkitOverflowScrolling = 'touch';
            container.style.width = '100%';
            
            table.parentNode.insertBefore(container, table);
            container.appendChild(table);
        }
        
        // Tablo stillerini düzenle
        table.style.minWidth = '100%';
        table.style.tableLayout = 'auto';
        
        // Hücreler için minimum genişlik
        const cells = table.querySelectorAll('th, td');
        cells.forEach(cell => {
            cell.style.minWidth = '80px';
            cell.style.whiteSpace = 'nowrap';
        });
    });
}

// Ana uygulama başlatma
domReady(() => {
    console.log('DOM loaded - initializing components');
    
    // Mobil tablo düzeltmelerini başlat
    initMobileTableFix();
    
    // Scrolly'yi başlat
    new SimpleScrolly();
    
    // Parallax efektleri
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length > 0) {
        new SimpleParallax('[data-parallax]', 0.3);
    }

    // Navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navPanel = document.querySelector('#navPanel');
    
    if (navToggle && navPanel) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            navPanel.classList.toggle('active');
            document.body.classList.toggle('nav-active');
        });
    }

    // Preload class'ını kaldır
    setTimeout(() => {
        document.body.classList.remove('is-preload');
    }, 100);

    // Mobile optimizasyonları
    if (breakpoints.isMobile()) {
        initMobileFeatures();
    }

    // Responsive images
    loadResponsiveImages();
    
    // Ekran yeniden boyutlandırmada tabloları güncelle
    window.addEventListener('resize', initMobileTableFix);
});

function initMobileFeatures() {
    console.log('Initializing mobile features');
    
    // Mobile için ek optimizasyonlar
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 767px) {
            .container {
                padding: 15px;
            }
            
            button, .btn {
                min-height: 44px;
                min-width: 44px;
            }
            
            /* Mobile table specific fixes */
            table {
                font-size: 14px !important;
            }
            
            th, td {
                padding: 8px 6px !important;
            }
        }
    `;
    document.head.appendChild(style);
}

function loadResponsiveImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    images.forEach(img => {
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
        }
    });
}

// Touch optimization
class TouchOptimizer {
    constructor() {
        this.init();
    }

    init() {
        if ('ontouchstart' in window) {
            this.addTouchStyles();
            this.preventZoom();
        }
    }

    addTouchStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .touch-element {
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
            }
            
            /* Table touch improvements */
            .table-container {
                -webkit-overflow-scrolling: touch;
                touch-action: manipulation;
            }
        `;
        document.head.appendChild(style);
    }

    preventZoom() {
        let lastTouchEnd = 0;
        
        document.addEventListener('touchend', (event) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
    }
}

// Initialize touch optimizations
new TouchOptimizer();

// Breakpoint change listener
window.addEventListener('resize', () => {
    if (breakpoints.isMobile()) {
        document.body.classList.add('mobile-view');
        initMobileTableFix(); // Yeniden boyutlandırmada tabloları güncelle
    } else {
        document.body.classList.remove('mobile-view');
    }
});

// Initial check
if (breakpoints.isMobile()) {
    document.body.classList.add('mobile-view');
    // Sayfa yüklendiğinde tabloları düzelt
    setTimeout(initMobileTableFix, 100);
}