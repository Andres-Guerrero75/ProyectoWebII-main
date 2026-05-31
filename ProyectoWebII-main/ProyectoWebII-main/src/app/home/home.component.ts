import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../services/carrito.service'; // 👈 Asegúrate de que la ruta apunte bien a tus servicios

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isLoggedIn: boolean = false;
  nombreUsuario: string = '';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    public carritoService: CarritoService // 👈 Inyectado 'public' para usarlo en el HTML
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.verificarSesion();
    }, 50);
  }

  verificarSesion(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      const usuarioRaw = localStorage.getItem('usuario');

      if (token) {
        this.isLoggedIn = true;
        if (usuarioRaw) {
          const usuarioParsed = JSON.parse(usuarioRaw);
          this.nombreUsuario = usuarioParsed.nombre || usuarioParsed.username || usuarioParsed.correo || 'Usuario';
        } else {
          this.nombreUsuario = 'Usuario';
        }
        this.cdr.detectChanges();
      } else {
        this.isLoggedIn = false;
        this.nombreUsuario = '';
        this.cdr.detectChanges();
      }
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.isLoggedIn = false;
    this.nombreUsuario = '';
    this.router.navigate(['/login']);
  }

  // 👈 Nueva función para enviar los productos en oferta al servicio global
  agregarAlCarrito(producto: any): void {
    this.carritoService.agregarProducto(producto);
  }
}
