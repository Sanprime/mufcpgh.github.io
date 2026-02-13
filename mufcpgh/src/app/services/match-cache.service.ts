import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FootballScoresService } from '../football-scores.service';

interface MatchCache {
  match: any;
  cachedAt: number;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class MatchCacheService {
  private readonly STORAGE_KEY = 'mufc_next_match_cache';
  private readonly CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours

  constructor(private footballScoresService: FootballScoresService) { }

  getNextMatch(): Observable<any> {
    const cache = this.getCachedMatch();

    if (cache && this.isCacheValid(cache)) {
      console.log('Using cached match data');
      return of(cache.match);
    }

    console.log('Fetching fresh match data from API');
    return this.fetchAndCacheMatch();
  }

  forceRefresh(): Observable<any> {
    console.log('Force refreshing match data');
    return this.fetchAndCacheMatch();
  }

  clearCache(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('Cache cleared');
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  private fetchAndCacheMatch(): Observable<any> {
    return this.footballScoresService.getNextMatch().pipe(
      tap(match => {
        if (match) {
          this.setCachedMatch(match);
        }
      }),
      catchError(error => {
        console.error('Failed to fetch match data:', error);
        return throwError(() => error);
      })
    );
  }

  private getCachedMatch(): MatchCache | null {
    try {
      const cached = localStorage.getItem(this.STORAGE_KEY);
      if (!cached) {
        return null;
      }
      return JSON.parse(cached) as MatchCache;
    } catch (error) {
      console.warn('Failed to read cache:', error);
      return null;
    }
  }

  private setCachedMatch(match: any): void {
    try {
      const cache: MatchCache = {
        match,
        cachedAt: Date.now(),
        expiresAt: this.calculateExpiryTime(match)
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cache));
      console.log('Match data cached until:', new Date(cache.expiresAt).toLocaleString());
    } catch (error) {
      console.warn('Failed to cache match data:', error);
    }
  }

  private isCacheValid(cache: MatchCache): boolean {
    const now = Date.now();

    // Cache expired by time (6 hours)
    if (now > cache.expiresAt) {
      console.log('Cache expired by time');
      return false;
    }

    // Game already happened
    const matchDate = new Date(cache.match.utcDate).getTime();
    if (now > matchDate) {
      console.log('Match time has passed');
      return false;
    }

    return true;
  }

  private calculateExpiryTime(match: any): number {
    const sixHoursFromNow = Date.now() + this.CACHE_DURATION_MS;
    const matchTime = new Date(match.utcDate).getTime();

    // Expire in 6 hours OR when game starts (whichever is sooner)
    return Math.min(sixHoursFromNow, matchTime);
  }
}
