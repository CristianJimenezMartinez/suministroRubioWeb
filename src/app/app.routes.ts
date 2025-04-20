// app.routes.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { ArticulosComponent } from './articulos/articulos.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { CheckoutComponent } from './checkout/checkout.component'; // Importa el componente de checkout
import { AuthGuard } from './guards/auth.guard';
import { ContactoComponent } from './info/contacto/contacto.component';
import { SobreNosotrosComponent } from './info/sobre-nosotros/sobre-nosotros.component';
import { PoliticaPrivacidadComponent } from './info/politica-privacidad/politica-privacidad.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Ruta raíz
  { path: 'home', component: HomeComponent },
  { path: 'categorias/:sec', component: CategoriaComponent },
  { path: 'categorias', component: CategoriaComponent },
  { path: 'articulos/:fam', component: ArticulosComponent },
  { path: 'articulos', component: ArticulosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent }, // Ruta de checkout
  { path: 'contacto', component: ContactoComponent },
  { path: 'sobre-nosotros', component: SobreNosotrosComponent },
  { path: 'politica-privacidad', component: PoliticaPrivacidadComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
