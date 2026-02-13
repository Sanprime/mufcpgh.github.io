import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { MatchCacheService } from '../services/match-cache.service';

interface CountdownDisplay {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
}

@Component({
  selector: 'app-next-game',
  templateUrl: './next-game.component.html',
  styleUrls: ['./next-game.component.css']
})
export class NextGameComponent implements OnInit, OnDestroy {
  match: any = null;
  countdown: CountdownDisplay = { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: false };
  matchDateEST: string = '';

  loading: boolean = true;
  error: string | null = null;
  refreshing: boolean = false;

  private timerSubscription?: Subscription;

  constructor(private matchCacheService: MatchCacheService) { }

  ngOnInit(): void {
    this.loadMatchData();
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  loadMatchData(): void {
    this.loading = true;
    this.error = null;

    this.matchCacheService.getNextMatch().subscribe({
      next: (match) => {
        if (!match) {
          this.error = 'No upcoming matches found';
          this.loading = false;
          return;
        }

        this.match = match;
        this.matchDateEST = this.convertToEST(match.utcDate);
        this.loading = false;
        this.refreshing = false;
        this.startCountdownTimer();
      },
      error: (err) => {
        console.error('Failed to load match data:', err);
        this.error = 'Unable to load match information. Please try again later.';
        this.loading = false;
        this.refreshing = false;
      }
    });
  }

  refreshMatch(): void {
    this.refreshing = true;

    // Stop existing timer
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.matchCacheService.forceRefresh().subscribe({
      next: (match) => {
        if (!match) {
          this.error = 'No upcoming matches found';
          this.refreshing = false;
          return;
        }

        this.match = match;
        this.matchDateEST = this.convertToEST(match.utcDate);
        this.error = null;
        this.refreshing = false;
        this.startCountdownTimer();
      },
      error: (err) => {
        console.error('Failed to refresh match data:', err);
        this.error = 'Unable to refresh match information. Please try again later.';
        this.refreshing = false;
      }
    });
  }

  private startCountdownTimer(): void {
    if (!this.match?.utcDate) {
      return;
    }

    const matchDate = new Date(this.match.utcDate);

    this.timerSubscription = interval(1000).pipe(
      map(() => this.calculateCountdown(matchDate)),
      distinctUntilChanged((prev, curr) =>
        prev.days === curr.days &&
        prev.hours === curr.hours &&
        prev.minutes === curr.minutes &&
        prev.seconds === curr.seconds
      )
    ).subscribe(countdown => {
      this.countdown = countdown;

      // Auto-refresh if match has finished
      if (countdown.isFinished && !this.refreshing) {
        console.log('Match time passed, refreshing...');
        this.refreshMatch();
      }
    });
  }

  private calculateCountdown(matchDate: Date): CountdownDisplay {
    const now = new Date().getTime();
    const matchTime = matchDate.getTime();
    const difference = matchTime - now;

    if (difference < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      isFinished: false
    };
  }

  convertToEST(utcDateString: string): string {
    try {
      const date = new Date(utcDateString);
      return date.toLocaleString('en-US', {
        timeZone: 'America/New_York',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Failed to convert timezone:', error);
      return utcDateString;
    }
  }

  get isUrgent(): boolean {
    return this.countdown.days === 0 && !this.countdown.isFinished;
  }
}
