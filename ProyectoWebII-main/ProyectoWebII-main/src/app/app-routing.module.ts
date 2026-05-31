import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegistroComponent } from './registro/registro.component';



const routes: Routes = [
  { path: '', component: HomeComponent }, // ruta raíz/
  { path: 'registro', component: RegistroComponent }

];/**h */

@NgModule({
  imports: [RouterModule.forRoot(routes)],
 
  exports: [RouterModule],
  

})
export class AppRoutingModule {}
