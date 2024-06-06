import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { ICarModelDetails } from "./car-model-details.model";
import { ICarOptionDetails } from "./car-option-details.model";

@Injectable({
  providedIn: 'root',
})
export class TeslaCarsClient {
  private _imageApi = "https://interstate21.com/tesla-app/images";

  constructor(private _http: HttpClient) {
  }

  getModels(): Observable<ICarModelDetails[]> {
    return this._http.get<ICarModelDetails[]>("/models")
      .pipe(
        catchError(this.handleError),
      );
  }

  getModelImageUrl(modelCode: string, colorCode: string): string {
    return `${this._imageApi}/${modelCode}/${colorCode}.jpg`;
  }

  getConfigs(modelCode: string): Observable<ICarOptionDetails> {
    return this._http.get<ICarOptionDetails>(`/options/${modelCode}`)
      .pipe(
        catchError(this.handleError),
      );
  }

  getOptionsPrice(): number {
    // missing from the API but I would expect to get it from there with the rest.
    return 1000;
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    console.log(err);
    if (err.status === 0) {
      errorMessage = `An error occurred: ${err.error}`;
    } else {
      errorMessage = `Server returned: ${err.statusText}, error message is: ${err.error}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
