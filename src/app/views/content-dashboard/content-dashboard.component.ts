import { Component, OnInit } from '@angular/core';
import { SubTheme } from 'src/app/models/SubTheme';
import { SubThemeService } from 'src/app/services/sub-theme.service';
import { Theme } from 'src/app/models/Theme';
import { ThemeService } from 'src/app/services/theme.service';
import { Formation } from 'src/app/models/Formation';
import { FormationService } from 'src/app/services/formation.service';
import { Particular } from 'src/app/models/Particular';
import { Company } from 'src/app/models/Company';
import { Employee } from 'src/app/models/Employee';
import { ParticularService } from 'src/app/services/particular.service';
import { CompanyService } from 'src/app/services/company.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { Trainer } from 'src/app/models/Trainer';
import { TrainerService } from 'src/app/services/trainer.service';

@Component({
  selector: 'app-content-dashboard',
  templateUrl: './content-dashboard.component.html',
  styleUrls: ['./content-dashboard.component.scss'],
})
export class ContentDashboardComponent implements OnInit {
  constructor(
    private themeService: ThemeService,
    private subThemeService: SubThemeService,
    private formationService: FormationService,
    private particularService: ParticularService,
    private companyService: CompanyService,
    private employeeService: EmployeeService,
    private formateurService: TrainerService
  ) {}

  listeTheme: Theme[] = [];

  listeSubTheme: SubTheme[] = [];

  listeFormations: Formation[] = [];

  listeParticuliers: Particular[] = [];
  listeCompagnies: Company[] = [];
  listeEmployees: Employee[] = [];

  listeFormateurs: Trainer[] = [];

  ngOnInit(): void {
    this.loadThemes();
    this.loadSubThemes();
    this.loadFormations();
    this.loadParticuliers();
    this.loadCompagniess();
    this.loadEmployees();

    this.loadFormateurs();
  }

  loadThemes() {
    this.themeService.getAll().subscribe({
      next: (data) => (this.listeTheme = data),
    });
  }

  loadSubThemes() {
    this.subThemeService.getAll().subscribe({
      next: (data) => (this.listeSubTheme = data),
    });
  }

  loadFormations() {
    this.formationService.getAll().subscribe({
      next: (data) => (this.listeFormations = data),
    });
  }

  //--- Calcul nombre de participants
  loadParticuliers() {
    this.particularService.getAll().subscribe({
      next: (data) => (this.listeParticuliers = data),
    });
  }

  loadCompagniess() {
    this.companyService.getAll().subscribe({
      next: (data) => (this.listeCompagnies = data),
    });
  }

  loadEmployees() {
    this.employeeService.getAll().subscribe({
      next: (data) => (this.listeEmployees = data),
    });
  }

  //--- Calcul nombre total de formateurs
  loadFormateurs() {
    this.formateurService.getAll().subscribe({
      next: (data) => (this.listeFormateurs = data),
    });
  }
}
