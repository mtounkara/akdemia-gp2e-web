import { Component } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {
  dashboardLink: string = '/';
  themesLink: string = '/dashboard/catalogues/themes';
  subthemesLink: string = '/dashboard/catalogues/subthemes';
  clientsLink: string = '/dashboard/clients';
  sessionsLink: string = '/dashboard/sessions';
  catalogueLink: string = '/dashboard/catalogues';
  formationsLink: string = '/dashboard/catalogues/formations';
  formateursLink: string = '/dashboard/formateurs';
}
