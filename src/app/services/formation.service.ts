import { Injectable } from '@angular/core';
import { Formation } from '../models/Formation';
import { CrudService } from './crud.service';
import { HttpClient } from '@angular/common/http';
import { URL_BASE } from '../conf/constant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormationService extends CrudService<Formation> {

  constructor(private http: HttpClient) {
    const url: string = URL_BASE;
    super(http, `${url}/formations`);
  }
}