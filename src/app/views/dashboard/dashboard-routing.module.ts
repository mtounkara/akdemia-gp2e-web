import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { ContentDashboardComponent } from '../content-dashboard/content-dashboard.component';
import { ThemesComponent } from '../themes/themes.component';
import { ClientsComponent } from '../clients/clients.component';
import { ThemesInfosComponent } from '../themes/themes-infos/themes-infos.component';
import { InsertClientComponent } from '../clients/insert-client/insert-client.component';
import { RouterModule, Routes } from '@angular/router';
import { SubthemesComponent } from '../subthemes/subthemes/subthemes.component';
import { FormationsComponent } from '../formations/formations.component';
import { FormateursComponent } from '../formateurs/formateurs.component';
import { FormationsInfosComponent } from '../formations/formations-infos/formations-infos.component';
import { SessionsComponent } from '../sessions/sessions.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', component: ContentDashboardComponent },
      { path: 'catalogues/themes', component: ThemesComponent },
      { path: 'catalogues/subthemes', component: SubthemesComponent },
      { path: 'catalogues/formations', component: FormationsComponent },
      { path: 'sessions', component: SessionsComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'catalogues/themes/infos/:id', component: ThemesInfosComponent },
      { path: 'catalogues/formations/infos/:id', component: FormationsInfosComponent },
      { path: 'clients/insert', component: InsertClientComponent },
      { path: 'clients/:id', component: InsertClientComponent },
      { path: 'clients/employe/:id', component: InsertClientComponent },
      { path: 'clients/particulier/:id', component: InsertClientComponent },
      { path: 'clients/company/:id', component: InsertClientComponent },
      { path: 'formateurs', component: FormateursComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
