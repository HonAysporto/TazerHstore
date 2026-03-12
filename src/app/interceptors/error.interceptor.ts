import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const snackBar = inject(MatSnackBar);

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {

      let errorMessage = 'Something went wrong. Please try again.';

      if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Check your internet connection.';
      }

      else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      else if (error.status === 401) {
        errorMessage = 'Unauthorized request.';
      }

      else if (error.status === 404) {
        errorMessage = 'Resource not found.';
      }

      snackBar.open(errorMessage, 'Close', {
        duration: 4000
      });

      return throwError(() => error);

    })

  );
};