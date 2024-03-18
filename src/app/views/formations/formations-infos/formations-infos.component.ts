import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Formation } from "src/app/models/Formation";
import { Theme } from "src/app/models/Theme";
import { AlertService } from "src/app/services/alert.service";
import { FormationService } from "src/app/services/formation.service";
import { ThemeService } from "src/app/services/theme.service";
import { UtilsService } from "src/app/services/utils.service";


@Component({
  selector: 'app-formations-infos',
  templateUrl: './formations-infos.component.html',
  styleUrls: ['./formations-infos.component.scss']
})
export class FormationsInfosComponent implements OnInit{
  id!: number;
  //for search
  themesAllReserved: Theme[] = [];
  themesSearch: Theme[] = [];
   //for filter
   filterForm!: FormGroup;
   searchForm!: FormGroup;
    //for pagination
   page: number = 1;
   position: number = 1;

   formationDetail: Formation = {
     id: 0,
     title: '',
     description: '',
     trainingPrice: 0,
     creationDate: new Date(),
     updateDate: new Date(),
     themes: [],
     logo: ''
   };

  themeForm!: FormGroup;
  themeValue!: Theme;
  themesAll: Theme[] = [];
  themeUpdateForm!: FormGroup;
  isLoading!: boolean;
  isFormThemeLoading!: boolean;

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService,
    private themeService: ThemeService,
    private alert: AlertService,
    private toastService: AlertService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder
  ) {
    this.themeUpdateForm = this.formBuilder.group({
      id: ['', Validators.required],
      themeTitle: ['', Validators.required],
      description: ['', Validators.required],
      creationDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.handlerGetFormationById();
    this.innitForm();
  }

  innitForm() {
    this.themeForm = new FormGroup({
      themeTitle: new FormControl(''),
      description: new FormControl(''),
      formations: new FormControl([]),
    });

    this.searchForm = new FormGroup({
      keyWord: new FormControl(''),
    });

    this.filterForm = new FormGroup({
      filter: new FormControl(20),
    });
  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
  }

  searchByName() {
    this.themesAll = this.themesAllReserved;
    let table: Theme[] = [];
    for (let i = 0; i < this.themesAll.length; i++) {
      if (
        this.themesAll[i].themeTitle
          .toLowerCase()
          .includes(this.searchForm.value.keyWord.toLowerCase())
      ) {
        table.push(this.themesAll[i]);
      }
    }
    if (this.searchForm.value.keyWord.trim() == '') {
      this.themesAll = this.themesAllReserved;
    } else {
      this.themesAll = table;
    }
  }

  handlePageChange(event: number) {
    this.page = event;
  }

  handlerGetFormationById() {
    this.formationService.getById(this.id).subscribe(
      (data) => {
        this.formationDetail = data;
        this.themesAll = this.formationDetail.themes;
        this.themesAllReserved = this.formationDetail.themes;
        //console.log("Object Formation........" +this.formationDetail.themes);
      },
      (err) => {
        this.alert.alertError(
          err.error !== null ? err.error.message : "Une erreur s'est produite"
        );
      }
    );
  }


  getSubString(text: string) {
    return this.utilsService.getSubString(text, 30);
  }
 



}
