import { Injectable } from '@angular/core';
import { Session } from '../models/Session';
import { CrudService } from './crud.service';
import { HttpClient } from '@angular/common/http';
import { URL_BASE } from '../conf/constant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService extends CrudService<Session> {

  constructor(private http: HttpClient) {
    const url: string = URL_BASE;
    super(http, `${url}/sessions`);
  }
}