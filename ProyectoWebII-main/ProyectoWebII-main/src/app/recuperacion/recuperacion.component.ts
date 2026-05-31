import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recuperacion',
  standalone: true,
  templateUrl: './recuperacion.component.html',
  imports: [CommonModule, RouterModule],
  styleUrl: './recuperacion.component.css'

})
export class RecuperacionComponent {
  onSubmit(event: Event) {
    event.preventDefault(); // Evita recargar la página

    const input = (event.target as HTMLFormElement).querySelector('#email') as HTMLInputElement;
    const email = input.value.trim();

    if (!email) {
      alert('Por favor, ingresa tu correo electrónico.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert(' El formato del correo electrónico no es válido.');
      return;
    }

    alert(`Se ha enviado un enlace de recuperación al correo: ${email}`);
    input.value = ''; 
  }
}

