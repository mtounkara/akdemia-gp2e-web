import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmBoxEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { Trainer } from 'src/app/models/Trainer';
import { AlertService } from 'src/app/services/alert.service';
import { TrainerService } from 'src/app/services/trainer.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-formateurs',
  templateUrl: './formateurs.component.html',
  styleUrls: ['./formateurs.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s ease-in'),
      ]),
      transition('* => void', [
        animate('0.5s ease-out', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class FormateursComponent implements OnInit {
  convert(arg0: number) {
    return Math.ceil(arg0);
  }

  //---
  //--- Variables
  //---
  formateurForm!: FormGroup;
  formateurValue!: Trainer;
  modalRef!: NgbModalRef;
  //for search
  formateursAll: Trainer[] = [];
  formateursAllReserved: Trainer[] = [];
  formateursSearch: Trainer[] = [];
  //for filter
  filterForm!: FormGroup;
  searchForm!: FormGroup;
  //for pagination
  page: number = 1;
  position: number = 1;

  formateurUpdateForm!: FormGroup;
  isLoading!: boolean;
  isFormFormateurLoading!: boolean;

  //--- Conctructeur
  constructor(
    private formateurService: TrainerService,
    private toastService: ToastrService,
    private utilsService: UtilsService,
    private alert: AlertService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: ConfirmBoxEvokeService
  ) {}

  //--- Interface ngOnInit
  ngOnInit(): void {
    this.innitForm();
    this.getAllFormateurs();
  }

  //--- Initialisation formulaire
  innitForm() {
    this.formateurForm = new FormGroup({
      activity: new FormControl(''),
      cvLink: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      gender: new FormControl(''),
    });
    this.searchForm = new FormGroup({
      keyWord: new FormControl(''),
    });

    this.filterForm = new FormGroup({
      filter: new FormControl(20),
    });

    this.formateurUpdateForm = this.formBuilder.group({
      id: ['', Validators.required],
      activity: ['', Validators.required],
      cvLink: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  searchByName() {
    this.formateursAll = this.formateursAllReserved;
    let table: Trainer[] = [];
    for (let i = 0; i < this.formateursAll.length; i++) {
      let fullName =
        this.formateursAll[i].firstName + ' ' + this.formateursAll[i].lastName;

      if (
        fullName
          .toLowerCase()
          .includes(this.searchForm.value.keyWord.toLowerCase())
      ) {
        table.push(this.formateursAll[i]);
      }
    }
    if (this.searchForm.value.keyWord.trim() == '') {
      this.formateursAll = this.formateursAllReserved;
    } else {
      this.formateursAll = table;
    }
  }

  handlePageChange(event: number) {
    this.page = event;
  }

  getSubString(text: string) {
    return this.utilsService.getSubString(text, 30);
  }

  //--- Recupérer tous les formateurs
  getAllFormateurs() {
    this.isLoading = true;
    this.formateurService.getAll().subscribe(
      (data) => {
        this.formateursAll = data;
        this.formateursAllReserved = data;
        this.isLoading = false;
      },
      (err) => {
        this.alert.alertError(
          err.error !== null
            ? err.error.message
            : 'Impossible de récupérer les formateurs'
        );
      }
    );
  }

  //--- Modification des infos d'un formateur
  formateurEdit(id: number) {
    this.formateurService.getById(id).subscribe(
      (data) => {
        this.formateurUpdateForm.patchValue({
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          activity: data.activity,
          cvLink: data.cvLink,
        });
      },
      (err) => {
        this.alert.alertError(
          err.error !== null ? err.error.message : 'Impossible de modifier'
        );
      }
    );
  }

  updateFormateur() {
    this.isFormFormateurLoading = true;
    let formateurUpdate = this.formateurUpdateForm.value;
    const formateurId = formateurUpdate.id;
    this.formateurService
      .edit(formateurId, formateurUpdate)
      .pipe(
        tap(
          (value) => {
            let themeResponse = value;
            this.toastService.success('Modification effectuée avec succès !');
            this.isFormFormateurLoading = false;
            this.formateurUpdateForm.reset();
            setTimeout(() => {
              this.formateurUpdateForm.reset();
              window.location.reload();
            }, 10);
          },
          (error) => {
            if (error.error == null) {
              this.toastService.error(
                "Une erreur est survenue lors de l'enregistrement d'un formateur"
              );
              this.isFormFormateurLoading = false;
            } else {
              this.toastService.error(error.error.message);
              this.isFormFormateurLoading = false;
            }
          }
        )
      )
      .subscribe();
  }

  //--- Enregistrer un formateur
  saveFormateur() {
    this.isFormFormateurLoading = true;
    let formateurSave = this.createFormateur();
    this.formateurService.save(formateurSave).subscribe(
      (value) => {
        let formateurResponse = value;
        this.toastService.success('Enregistrement effectué avec succès !');
        this.isFormFormateurLoading = false;
        this.formateurForm.reset();
        setTimeout(() => {
          this.formateurForm.reset();
          window.location.reload();
        }, 1000);
      },
      (error) => {
        console.log(error);
        if (error.error == null) {
          this.toastService.error(
            "Une erreur est survenue lors de l'enregistrement du formateur"
          );
          this.isFormFormateurLoading = false;
        } else {
          this.toastService.error(error.error.message);
          this.isFormFormateurLoading = false;
        }
      }
    );
  }

  //--- Creation
  createFormateur(): Trainer {
    this.formateurValue = this.formateurForm.value;
    this.formateurValue.firstName = this.formateurForm.value.firstName;
    this.formateurValue.lastName = this.formateurForm.value.lastName;
    this.formateurValue.gender = this.formateurForm.value.gender;
    this.formateurValue.activity = this.formateurForm.value.activity;
    this.formateurValue.cvLink = this.formateurForm.value.cvLink;

    return this.formateurValue;
  }

  formateurDelete(id: number) {
    this.alertService
      .customFour(
        'Etes-vous sûr de vouloir effectuer cette suppression?',
        'Cette action est irréversible!',
        'Confirmer',
        'Annuler'
      )
      .subscribe(
        (resp) => {
          if (resp.success) {
            this.formateurService.delete(id).subscribe(() => {
              this.getAllFormateurs();
              this.toastService.success('Supprimé avec succès');
            });
          }
        },
        (err) => {
          this.toastService.error(
            err.error !== null
              ? err.error.message
              : 'Impossible de supprimer le formateur'
          );
        }
      );
  }
}
