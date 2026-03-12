import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private activeRequests = 0;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private loadingTimer: any;

  show() {

    this.activeRequests++;

    if (this.activeRequests === 1) {

      // Delay showing spinner to prevent flicker
      this.loadingTimer = setTimeout(() => {
        this.loadingSubject.next(true);
      }, 200); // spinner appears only if request lasts more than 200ms

    }

  }

  hide() {

    if (this.activeRequests > 0) {
      this.activeRequests--;
    }

    if (this.activeRequests === 0) {

      // stop pending timer if request finished quickly
      clearTimeout(this.loadingTimer);

      this.loadingSubject.next(false);

    }

  }

}