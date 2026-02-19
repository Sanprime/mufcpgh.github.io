import { Injectable, isDevMode } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FootballScoresService {

  // Dev: local proxy; Prod: Cloudflare Worker proxy (handles auth + CORS)
  private apiUrl = isDevMode()
    ? '/api/teams/66/matches'
    : 'https://mufcpgh-api.sanjeev-ramanan96.workers.dev';

  constructor(private http: HttpClient) { }

  getUnitedScores(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getNextMatch(): Observable<any> {
    const params = {
      status: 'SCHEDULED,TIMED'
    };
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => response.matches[0]) // Get just the first match (next game)
    );
  }
}
