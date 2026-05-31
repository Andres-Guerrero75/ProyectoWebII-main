import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../services/productos.service';
import { CarritoService } from '../services/carrito.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class ProductosComponent implements OnInit {

  private platformId = inject(PLATFORM_ID);

  productos: any[] = [];
  productosFiltrados: any[] = [];
  textoBusqueda: string = '';
  categoriaSeleccionada: string = 'Todas las categorías';

  mostrarCarrito: boolean = false;
  isLoggedIn: boolean = false;
  nombreUsuario: string = '';
  esAdmin: boolean = false;
  mostrarFormulario: boolean = false;

  nuevoProducto: any = {
    codigo: '', nombre: '', precio: 0, preciov: 0, stock: 0,
    categoria: '', imagen: '', descuento: 0, proveedorId: null
  };

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public carritoService: CarritoService
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarProductos();
      setTimeout(() => this.verificarSesion(), 50);
    }
  }

  // --- MÉTODOS DE CARRITO ---
  toggleCarrito() { this.mostrarCarrito = !this.mostrarCarrito; }

  get carrito() { return this.carritoService.obtenerProductos(); }

  getCantidadTotal(): number { return this.carritoService.contarProductos(); }

  getTotal(): number {
    return this.carrito.reduce((total, item) =>
      total + ((item.preciov || item.precio || 0) * (item.cantidad || 1)), 0);
  }

  agregarAlCarrito(producto: any) {
    // Añadimos cantidad inicial de 1 al agregar
    const prodConCantidad = { ...producto, cantidad: 1 };
    this.carritoService.agregarProducto(prodConCantidad);
    alert('Producto agregado al carrito.');
  }

  aumentarCantidad(item: any): void {
    item.cantidad = (item.cantidad || 1) + 1;
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  disminuirCantidad(item: any): void {
    if (item.cantidad > 1) {
      item.cantidad -= 1;
    } else {
      this.eliminarDelCarrito(item);
    }
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  eliminarDelCarrito(item: any): void {
    const index = this.carrito.indexOf(item);
    if (index > -1) {
      this.carrito.splice(index, 1);
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }
  }

  vaciarCarrito(): void {
    if (confirm('¿Seguro que deseas vaciar el carrito?')) {
      this.carritoService.vaciarCarrito();
    }
  }

  // --- LÓGICA DE SESIÓN Y PRODUCTOS ---
  verificarSesion(): void {
    if (isPlatformBrowser(this.platformId)) {
      const usuarioRaw = localStorage.getItem('usuario');
      if (usuarioRaw) {
        const usuarioParsed = JSON.parse(usuarioRaw);
        this.isLoggedIn = true;
        this.nombreUsuario = usuarioParsed.nombre || 'Usuario';
        this.esAdmin = (usuarioParsed.rol?.toUpperCase() === 'ADMIN');
      }
      this.cdr.detectChanges();
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  cargarProductos() {
    this.productoService.listar().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data;
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  filtrarProductos() {
    const texto = this.textoBusqueda.toLowerCase();
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(texto) &&
      (this.categoriaSeleccionada === 'Todas las categorías' || p.categoria === this.categoriaSeleccionada)
    );
  }

  agregarProducto(): void {
    if (!this.nuevoProducto.nombre || this.nuevoProducto.precio <= 0) return;
    this.productoService.crear(this.nuevoProducto).subscribe({
      next: () => {
        alert('Producto registrado.');
        this.cargarProductos();
        this.toggleFormulario();
      }
    });
  }

  toggleFormulario(): void { this.mostrarFormulario = !this.mostrarFormulario; }

  eliminarProducto(id: number): void {
    if (confirm('¿Eliminar producto?')) {
      this.productoService.eliminar(id).subscribe(() => this.cargarProductos());
    }
  }
}
