import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { ICarModel } from "./car-model";
import { ICarOption } from "./car-options";

@Injectable({
  providedIn: 'root',
})
export class TeslaCarsClient {
  private _imageApi = "https://interstate21.com/tesla-app/images";

  constructor(private _http: HttpClient) {
  }

  getModels(): Observable<ICarModel[]> {
    return this._http.get<ICarModel[]>("/models")
      .pipe(
        catchError(this.handleError),
      );
  }

  getModelImageUrl(modelCode: string, colorCode: string): string {
    return `${this._imageApi}/${modelCode}/${colorCode}.jpg`;
  }

  getConfigs(modelCode: string): Observable<ICarOption> {
    return this._http.get<ICarOption>(`/options/${modelCode}`)
      .pipe(
        catchError(this.handleError),
      );
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
