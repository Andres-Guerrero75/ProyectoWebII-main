import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarritoService } from '../services/carrito.service'; // <--- IMPORTANTE

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  isLoggedIn: boolean = false;
  nombreUsuario: string = '';

  // Inyectamos el servicio aquí como public para usarlo en el HTML
  constructor(private router: Router, public carritoService: CarritoService) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.verificarSesion();
    }
  }

  verificarSesion(): void {
    const usuarioRaw = localStorage.getItem('usuario');
    if (usuarioRaw) {
      this.isLoggedIn = true;
      this.nombreUsuario = JSON.parse(usuarioRaw).nombre || 'Administrador';
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
