import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { SubTheme } from 'src/app/models/SubTheme';
import { Theme } from 'src/app/models/Theme';
import { AlertService } from 'src/app/services/alert.service';
import { SubThemeService } from 'src/app/services/sub-theme.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UtilsService } from 'src/app/services/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subthemes',
  templateUrl: './subthemes.component.html',
  styleUrls: ['./subthemes.component.scss'],
})
export class SubthemesComponent implements OnInit {
  convert(arg0: number) {
    return Math.ceil(arg0);
  }

  id!: number;
  //pour rechercher les sous themes
  subThemesAll: SubTheme[] = [];
  subThemesAllReserved: SubTheme[] = [];
  subThemesSearch: SubTheme[] = [];

  //pour filtrer les sous themes
  filterForm!: FormGroup;
  searchForm!: FormGroup;

  //pour gérer la pagination
  page: number = 1;
  position: number = 1;

  subThemeForm!: FormGroup;
  subThemeUpdateForm!: FormGroup;
  subThemeValue!: SubTheme;
  modalRef!: NgbModalRef;

  isLoading!: boolean;
  isFormSubThemeLoading!: boolean;

  //--- Constructor
  constructor(
    private subThemeService: SubThemeService,
    private themeService: ThemeService,
    private toastService: ToastrService,
    private utilsService: UtilsService,
    private alert: AlertService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  //---------------------------------------------
  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.innitForm();
    this.getAllSubThemes();
  }

  innitForm() {
    this.subThemeForm = new FormGroup({
      subthemeTitle: new FormControl(''),
      description: new FormControl(''),
      themes: new FormControl([]),
    });

    this.searchForm = new FormGroup({
      keyWord: new FormControl(''),
    });

    this.filterForm = new FormGroup({
      filter: new FormControl(20),
    });

    this.subThemeUpdateForm = this.formBuilder.group({
      id: ['', Validators.required],
      subthemeTitle: ['', Validators.required],
      description: ['', Validators.required],
      creationDate: ['', Validators.required],
      themes: [[]],
    });
  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
  }

  //--- recherche par le nom de sous-theme
  searchByName() {
    this.subThemesAll = this.subThemesAllReserved;
    let table: SubTheme[] = [];
    for (let i = 0; i < this.subThemesAll.length; i++) {
      if (
        this.subThemesAll[i].subthemeTitle
          .toLowerCase()
          .includes(this.searchForm.value.keyWord.toLowerCase())
      ) {
        table.push(this.subThemesAll[i]);
      }
    }
    if (this.searchForm.value.keyWord.trim() == '') {
      this.subThemesAll = this.subThemesAllReserved;
    } else {
      this.subThemesAll = table;
    }
  }

  //--- gestion de l'evenement changement de page
  handlePageChange(event: number) {
    this.page = event;
  }

  //---
  saveSubTheme() {
    this.isFormSubThemeLoading = true;
    let subThemeSave = this.createSubTheme();
    console.log(subThemeSave);
    this.subThemeService
      .save(subThemeSave)
      .pipe(
        tap(
          (value) => {
            let subThemeResponse = value;
            this.toastService.success('Enregistrement effectué avec succès !');
            this.isFormSubThemeLoading = false;
            this.subThemeForm.reset();
            setTimeout(() => {
              this.subThemeForm.reset();
              window.location.reload();
            }, 1000);
          },
          (error) => {
            console.log(error);
            if (error.error == null) {
              this.toastService.error(
                "Une erreur est survenue lors de l'enregistrement du sous thème"
              );
              this.isFormSubThemeLoading = false;
            } else {
              this.toastService.error(error.error.message);
              this.isFormSubThemeLoading = false;
            }
          }
        )
      )
      .subscribe();
  }

  //--- creeer un sous theme
  createSubTheme(): SubTheme {
    this.subThemeValue = this.subThemeForm.value;
    this.subThemeValue.subthemeTitle = this.subThemeForm.value.subthemeTitle;
    this.subThemeValue.description = this.subThemeForm.value.description;
    this.subThemeValue.creationDate = new Date();
    return this.subThemeValue;
  }

  //--- Affichage de tous les sous themes
  getAllSubThemes() {
    this.isLoading = true;
    this.subThemeService.getAll().subscribe(
      (data) => {
        this.subThemesAll = data;
        this.subThemesAllReserved = data;
        this.isLoading = false;
      },
      (err) => {
        this.alert.alertError(
          err.error !== null
            ? err.error.message
            : 'Impossible de récupérer les thèmes'
        );
      }
    );
  }

  //--- Supprimer un sous theme
  subThemeDelete(id: number) {
    Swal.fire({
      title: 'Etes-vous sûr de vouloir effectuer cette suppression?',
      text: 'Cette action est irréversible!',
      icon: 'warning',
      cancelButtonText: 'Annuler',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, Supprimer!',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.subThemeService.delete(id).subscribe(
          () => {
            //this.getAllSubThemes();
            setTimeout(() => {
              this.subThemeForm.reset();
              window.location.reload();
            }, 1000);
            Swal.fire(
              'Supprimé!',
              'Le sous-thème a été supprimé avec succès.',
              'success'
            );
          },
          (err) => {
            this.alert.alertError(
              err.error !== null
                ? err.error.message
                : "Une erreur s'est produite lors de la suppréssion"
            );
          }
        );
      }
    });
  }

  //--- Modifier un sous theme
  subThemeEdit(id: number) {
    this.subThemeService.getById(id).subscribe(
      (data) => {
        this.subThemeUpdateForm.patchValue({
          id: data.id,
          subthemeTitle: data.subthemeTitle,
          description: data.description,
          creationDate: data.creationDate,
        });
      },
      (err) => {
        this.alert.alertError(
          err.error !== null
            ? err.error.message
            : 'Impossible de modifier le sous-thème'
        );
      }
    );
  }

  //--- Mise à jour d'un sous thème
  updateSubTheme() {
    this.isFormSubThemeLoading = true;
    let subThemeUpdate = this.subThemeUpdateForm.value;
    const subTemeId = subThemeUpdate.id;
    let creationDate = subThemeUpdate.creationDate;
    subThemeUpdate.updateDate = new Date();
    subThemeUpdate.creationDate = creationDate;
    this.subThemeService
      .edit(subTemeId, subThemeUpdate)
      .pipe(
        tap(
          (value) => {
            this.isFormSubThemeLoading = false;
            let themeResponse = value;
            this.toastService.success('Modification effectué avec success !');
            this.subThemeUpdateForm.reset();
            setTimeout(() => {
              this.subThemeUpdateForm.reset();
              window.location.reload();
            }, 1000);
          },
          (error) => {
            console.log(error);
            if (error.error == null) {
              this.isFormSubThemeLoading = false;
              this.toastService.error(
                "Une erreur est survenue lors de l'enregistrement d'un thème"
              );
            } else {
              this.isFormSubThemeLoading = false;
              this.toastService.error(error.error.message);
            }
          }
        )
      )
      .subscribe();
  }

  getSubString(text: string) {
    return this.utilsService.getSubString(text, 30);
  }
  //--- détail du sous theme et rout vers Training (formation)
  // subThemeDetail(id: number) {
  //   this.router.navigate([`dashboard/catalogues/subthemes/infos/${id}`]);
  // }
}
