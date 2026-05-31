import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarritoService } from './services/carrito.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'MiProjecto';
  carritoService = inject(CarritoService);
  mostrarCarrito: boolean = false;

  toggleCarrito() { this.mostrarCarrito = !this.mostrarCarrito; }

  // Métodos necesarios para el HTML del carrito
  get carrito() { return this.carritoService.obtenerProductos(); }

  getTotal(): number {
    return this.carrito.reduce((total, item) =>
      total + ((item.preciov || item.precio || 0) * (item.cantidad || 1)), 0);
  }

  eliminarDelCarrito(item: any): void {
    const index = this.carrito.indexOf(item);
    if (index > -1) {
      this.carrito.splice(index, 1);
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }
  }

  vaciarCarrito(): void {
    if (confirm('¿Vaciar carrito?')) this.carritoService.vaciarCarrito();
  }
}
