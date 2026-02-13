import { Injectable, isDevMode } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FootballScoresService {

  // Use proxy in development to avoid CORS, direct API in production
  private apiUrl = isDevMode()
    ? '/api/teams/66/matches'
    : 'https://api.football-data.org/v4/teams/66/matches';

  constructor(private http: HttpClient) { }

  getUnitedScores(): Observable<any> {
    const headers = new HttpHeaders({
      'X-Auth-Token': '19de5c6e7e554dae8953e810a926fed1',
      'Content-Type': 'application/json'
    })
    return this.http.get(this.apiUrl, { headers });
  }

  getNextMatch(): Observable<any> {
    const headers = new HttpHeaders({
      'X-Auth-Token': '19de5c6e7e554dae8953e810a926fed1',
      'Content-Type': 'application/json'
    })
    // Get only scheduled/timed matches, sorted by date
    const params = {
      status: 'SCHEDULED,TIMED'
    };
    return this.http.get<any>(this.apiUrl, { headers, params }).pipe(
      map(response => response.matches[0]) // Get just the first match (next game)
    );
  }
}
