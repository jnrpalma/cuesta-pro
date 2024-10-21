import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VaccinationService {
  constructor(private http: HttpClient) {}

  getVaccinations(): Observable<any[]> {
    return this.http.get<any[]>('/api/vaccinations');
  }

  applyVaccination(vaccination: any): Observable<any> {
    return this.http.post('/api/vaccinations', vaccination);
  }
}