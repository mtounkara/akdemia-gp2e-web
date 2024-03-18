import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmBoxEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { Session } from 'src/app/models/Session';
import { AlertService } from 'src/app/services/alert.service';
import { SessionService } from 'src/app/services/sessions.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit {

  convert(arg0: number) {
    return Math.ceil(arg0);
  }

  sessionForm!: FormGroup;
  sessionValue!: Session;
  modalRef!: NgbModalRef;
  //for search
  sessionsAll: Session[] = [];
  sessionsAllReserved: Session[] = [];
  sessionsSearch: Session[] = [];
  //for filter
  filterForm!: FormGroup;
  searchForm!: FormGroup;
  //for pagination
  page: number = 1;
  position: number = 1;

  sessionUpdateForm!: FormGroup;
  isLoading!: boolean;
  isFormSessionLoading!: boolean;

  constructor(
    private sessionService: SessionService,
    private toastService: ToastrService,
    private utilsService: UtilsService,
    private alert: AlertService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: ConfirmBoxEvokeService
  ) {}

  ngOnInit(): void {
    this.innitForm();
    this.getAllSessions();
  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
  }

  innitForm() {
    this.sessionForm = new FormGroup({
      id: new FormControl(''),
      code: new FormControl(''),
      description: new FormControl(''),
      lacation: new FormControl(''),
      date: new FormControl(''),
      duration: new FormControl(''),
      price: new FormControl(''),
      minParticipants: new FormControl(''),
      creationDate: new FormControl(''),
      updateDate: new FormControl('')
    });

    this.searchForm = new FormGroup({
      keyWord: new FormControl(''),
    });

    this.filterForm = new FormGroup({
      filter: new FormControl(20),
    });

    this.sessionUpdateForm = this.formBuilder.group({
      id: ['', Validators.required],
      code: ['', Validators.required],
      description: ['', Validators.required],
      lacation: ['', Validators.required],
      date: ['', Validators.required],
      duration: ['', Validators.required],
      price: ['', Validators.required],
      minParticipants: ['', Validators.required],
      creationDate: ['', Validators.required],
      updateDate: ['', Validators.required],

    });
  }

  searchByName() {
    this.sessionsAll = this.sessionsAllReserved;
    let table: Session[] = [];
    for (let i = 0; i < this.sessionsAll.length; i++) {
      if (
        this.sessionsAll[i].code
          .toLowerCase()
          .includes(this.searchForm.value.keyWord.toLowerCase())
      ) {
        table.push(this.sessionsAll[i]);
      }
    }
    if (this.searchForm.value.keyWord.trim() == '') {
      this.sessionsAll = this.sessionsAllReserved;
    } else {
      this.sessionsAll = table;
    }
  }

  handlePageChange(event: number) {
    this.page = event;
  }

  saveSession() {
    this.isFormSessionLoading = true;
    let sessionSave = this.createSession();
    this.sessionService.save(sessionSave).subscribe(
      (value) => {
        let sessionResponse = value;
        this.toastService.success('Enregistrement effectué avec succès !');
        this.isFormSessionLoading = false;
        this.sessionForm.reset();
        setTimeout(() => {
          this.sessionForm.reset();
          window.location.reload();
        }, 1000);
      },
      (error) => {
        console.log(error);
        if (error.error == null) {
          this.toastService.error(
            "Une erreur est survenue lors de l'enregistrement du session"
          );
          this.isFormSessionLoading = false;
        } else {
          this.toastService.error(error.error.message);
          this.isFormSessionLoading = false;
        }
      }
    );
  }

  getAllSessions() {
    this.isLoading = true;
    this.sessionService.getAll().subscribe(
      (data) => {
        this.sessionsAll = data;
        this.sessionsAllReserved = data;
        this.isLoading = false;
      },
      (err) => {
        this.alert.alertError(
          err.error !== null
            ? err.error.message
            : 'Impossible de récupérer les sessions'
        );
      }
    );
  }

  createSession(): Session {
    this.sessionValue = this.sessionForm.value;
    this.sessionValue.code = this.sessionForm.value.code;
    this.sessionValue.description = this.sessionForm.value.description;
    this.sessionValue.lacation = this.sessionForm.value.lacation;
    this.sessionValue.date = this.sessionForm.value.date;
    this.sessionValue.duration = this.sessionForm.value.duration;
    this.sessionValue.price = this.sessionForm.value.price;
    this.sessionValue.creationDate = new Date();
    return this.sessionValue;
  }

  sessionDelete(id: number) {
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
            this.sessionService.delete(id).subscribe(() => {
              this.getAllSessions();
              this.toastService.success('Supprimé avec succès');
            });
          }
        },
        (err) => {
          this.toastService.error(
            err.error !== null
              ? err.error.message
              : 'Impossible de supprimer le session'
          );
        }
      );
  }

  sessionEdit(id: number) {
    this.sessionService.getById(id).subscribe(
      (data) => {
        this.sessionUpdateForm.patchValue({
          id: data.id,
          code: data.code,
          description: data.description,
          lacation: data.lacation,
          date: data.date,
          duration: data.duration,
          price: data.price,
          minParticipants: data.minParticipants,
          updateDate: data.updateDate
        });
      },
      (err) => {
        this.alert.alertError(
          err.error !== null ? err.error.message : 'Impossible de modifier'
        );
      }
    );
  }

  updateSession() {
    this.isFormSessionLoading = true;
    let sessionUpdate = this.sessionUpdateForm.value;
    const sessionId = sessionUpdate.id;
    let creationDate = sessionUpdate.creationDate;
    sessionUpdate.updateDate = new Date();
    this.sessionService
      .edit(sessionId, sessionUpdate)
      .pipe(
        tap(
          (value) => {
            let sessionResponse = value;
            this.toastService.success('Modification effectuée avec succès !');
            this.isFormSessionLoading = false;
            this.sessionUpdateForm.reset();
            setTimeout(() => {
              this.sessionUpdateForm.reset();
              window.location.reload();
            }, 10);
          },
          (error) => {
            if (error.error == null) {
              this.toastService.error(
                "Une erreur est survenue lors de l'enregistrement d'un session"
              );
              this.isFormSessionLoading = false;
            } else {
              this.toastService.error(error.error.message);
              this.isFormSessionLoading = false;
            }
          }
        )
      )
      .subscribe();
  }

  sessionDetail(id: number) {
    this.router.navigate([`dashboard/catalogues/sessions/infos/${id}`]);
  }

  getSubString(text: string) {
    return this.utilsService.getSubString(text, 30);
  }

}
