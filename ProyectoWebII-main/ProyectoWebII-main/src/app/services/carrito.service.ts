import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private productos: any[] = [];
  private platformId = inject(PLATFORM_ID); // Inyectamos la plataforma

  constructor() {
    // Solo accedemos a localStorage si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const guardado = localStorage.getItem('carrito');
      if (guardado) this.productos = JSON.parse(guardado);
    }
  }

  agregarProducto(producto: any) {
    this.productos.push(producto);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('carrito', JSON.stringify(this.productos));
    }
  }

  obtenerProductos() {
    return this.productos;
  }

  contarProductos(): number {
    return this.productos.length;
  }

  vaciarCarrito() {
    this.productos = [];
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('carrito');
    }
  }
}
