import { CommonModule } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProveedorService } from '../services/proveedor.service';
import { CarritoService } from '../services/carrito.service';

interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  products: string[];
  lastOrder: string;
  status: 'Activo' | 'Pendiente';
  rating: number;
}

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css'
})
export class ProveedoresComponent implements OnInit {

  private platformId = inject(PLATFORM_ID);

  suppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];
  searchTerm: string = '';
  isModalOpen: boolean = false;
  selectedSupplier: Supplier | null = null;
  orderData: any = {};
  isOrderModalOpen: boolean = false;
  isLoggedIn: boolean = false;
  nombreUsuario: string = '';
  esAdmin: boolean = false;
  newSupplier: any = { name: '', email: '', phone: '', address: '', ruc: '', productsText: '' };

  constructor(
    private router: Router,
    private proveedorService: ProveedorService,
    public carritoService: CarritoService
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.verificarSesion();
      this.cargarProveedores();
    }
  }

  // --- MÉTODOS REQUERIDOS POR EL HTML ---

  getActiveCount(): number {
    return this.suppliers.filter(s => s.status === 'Activo').length;
  }

  getPendingCount(): number {
    return this.suppliers.filter(s => s.status === 'Pendiente').length;
  }

  getAverageRating(): string {
    if (this.suppliers.length === 0) return '0';
    const total = this.suppliers.reduce((sum, s) => sum + s.rating, 0);
    return (total / this.suppliers.length).toFixed(1);
  }

  getRatingStars(rating: number): string {
    const filled = '★'.repeat(Math.round(rating));
    const empty = '☆'.repeat(5 - Math.round(rating));
    return filled + empty;
  }

  contactSupplier(email: string): void {
    window.location.href = `mailto:${email}`;
  }

  newOrder(id: number): void {
    const supplier = this.suppliers.find(s => s.id === id);
    if (!supplier) return;
    this.selectedSupplier = supplier;
    this.orderData = {
      date: new Date().toISOString().substring(0, 10),
      quantities: {}
    };
    this.isOrderModalOpen = true;
  }

  confirmOrder(): void {
    if (!this.selectedSupplier) return;
    this.selectedSupplier.lastOrder = this.orderData.date;
    alert('Pedido registrado con éxito.');
    this.isOrderModalOpen = false;
  }

  closeOrderModal(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.isOrderModalOpen = false;
    }
  }

  closeModalOnOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal')) this.closeModal();
  }

  // --- LÓGICA DE GESTIÓN ---

  cargarProveedores(): void {
    this.proveedorService.listar().subscribe({
      next: (data) => {
        this.suppliers = data.map((p: any) => ({
          id: p.id,
          name: p.nombre,
          email: p.correo,
          phone: p.telefono,
          address: p.direccion,
          products: [],
          lastOrder: '—',
          status: 'Activo' as 'Activo',
          rating: 0
        }));
        this.filteredSuppliers = [...this.suppliers];
      }
    });
  }

  verificarSesion(): void {
    if (isPlatformBrowser(this.platformId)) {
      const usuarioRaw = localStorage.getItem('usuario');
      if (usuarioRaw) {
        const usuarioParsed = JSON.parse(usuarioRaw);
        this.isLoggedIn = true;
        this.nombreUsuario = usuarioParsed.nombre || 'Administrador';
        this.esAdmin = usuarioParsed.rol?.toUpperCase() === 'ADMIN';
      }
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  filterSuppliers(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredSuppliers = term === '' ? [...this.suppliers] : this.suppliers.filter(s =>
      s.name.toLowerCase().includes(term) || s.products.some(p => p.toLowerCase().includes(term))
    );
  }

  openModal(): void { this.isModalOpen = true; }
  closeModal(): void { this.isModalOpen = false; this.resetForm(); }

  addSupplier(): void {
    if (!this.newSupplier.name || !this.newSupplier.email || !this.newSupplier.phone) return;
    this.proveedorService.crear(this.newSupplier).subscribe({
      next: () => {
        this.cargarProveedores();
        this.closeModal();
        alert('Proveedor registrado.');
      }
    });
  }

  deleteSupplier(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este proveedor?')) {
      this.proveedorService.eliminar(id).subscribe(() => this.cargarProveedores());
    }
  }

  private resetForm(): void {
    this.newSupplier = { name: '', email: '', phone: '', address: '', ruc: '', productsText: '' };
  }
}
