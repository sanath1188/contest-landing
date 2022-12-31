import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomepageService {

  constructor(private http: HttpClient) { }

  sendTextMessage(contactNumber: string): Observable<any> {
    return this.http
      .post<any>("https://api.econtest.me/account/send-app-link", { username: contactNumber }, {observe: 'response'});
  }
}
