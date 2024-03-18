import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_BASE } from '../conf/constant';
import { Trainer } from '../models/Trainer';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root',
})
export class TrainerService extends CrudService<Trainer> {
  constructor(private http: HttpClient) {
    const url: string = URL_BASE;
    super(http, `${url}/formateurs`);
  }
}
