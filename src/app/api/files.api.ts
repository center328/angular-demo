import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable, of} from 'rxjs';
import {AppConstant} from '../configs/constants.config';
import {ResultModel} from './models/result.model';
import {NumberModel} from './models/number.model';
import {catchError, map, switchMap} from 'rxjs/operators';

@Injectable()
export class FilesApi {
  constructor(private http: HttpClient) {
  }

  private getAdd(): Observable<ResultModel> {
    return this.http.get<ResultModel>(AppConstant.addJsonURL);
  }
  private getMultiply(): Observable<ResultModel> {
    return this.http.get<ResultModel>(AppConstant.multiplyJsonURL);
  }
  private getNumbers(): Observable<NumberModel[]> {
    return this.http.get<NumberModel[]>(AppConstant.numbersJsonURL);
  }
  public getData(): Observable<NumberModel[]> {
    return this.getNumbers().pipe(
      switchMap((numbers) => {
        if (numbers !== null && numbers.length > 0) {
            return forkJoin(
              numbers.map(num => {
                if (num.action === 'multiply') {
                  return this.getMultiply().pipe(
                    map((val) => this.processValues(num, val)),
                    catchError( () => of({result: '< MISSING DATA >'} as NumberModel))
                  );
                } else {
                  return this.getAdd().pipe(
                    map((val) => this.processValues(num, val)),
                    catchError( () => of({result: '< MISSING DATA >'} as NumberModel))
                  );
                }
              })
            );
        }
        return of([]);
      }),
      catchError(() => of([]))
    );
  }

  private processValues(num: NumberModel, val: ResultModel) {
    if (val === null || val.value === null) {
      num.result = '< MISSING DATA >';
    } else {
      num.sValue = val.value;
      if (num.action === 'add') {
        num.result = num.value + ' + ' + num.sValue + ' = ' + (num.value + num.sValue);
      } else {
        num.result = num.value + ' * ' + num.sValue + ' = ' + (num.value * num.sValue);
      }
    }
    return num;
  }
}
