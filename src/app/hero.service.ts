import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Hero} from './hero';
// import {HEROES} from './mock-heroes';
import {MessageService} from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import {log} from 'util';

const httpOptions = {
  headers: new HttpHeaders({'Content-type': 'application/json'})
};


@Injectable({
  providedIn: 'root'
})



export class HeroService {

  private heroesUrl = 'api/heroes';


  constructor(private messageService: MessageService,
              private http: HttpClient) {}

  /*
  * Handle http operation that failed
  * Let the app continue
  * @param operation - name of the operation that failed
  * @param result - optional value to return as an observable
  * */

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  /*
  // using RxJs of() method
  getHeroes(): Observable<Hero[]> {

    this.messageService.add('HeroService: Successfully fetched the heroes...');
    return of(HEROES);
  }*/

  // Get heroes from the server
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]> (this.heroesUrl)
      .pipe(
        catchError(this.handleError('getHeroes', [] ))
      );
  }

  getHero(id: number): Observable<Hero> {
      const url = `${this.heroesUrl}/${id}`;
      /*this.messageService.add(`HeroService: fetched a hero with id : ${id}`);
      return of(HEROES.find(hero => hero.id === id));*/

      return this.http.get<Hero>(url).pipe(
        tap(_ => this.log(`fetched hero with id : ${id}`)),
        catchError(this.handleError<Hero>(`getHero id=$(id)` ))
      );
  }

  // POST: add a new hero to the server
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap((hero1: Hero) => this.log(`added hero with id : ${hero1.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }

  // PUT: update a hero on the server
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap( _ => this.log(`updated hero: id=${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      );
  }

  // DELETE: delete a hero from the server
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`deleted id = ${id}`)),
        catchError(this.handleError<Hero>('deletedHero'))
      );
  }
  // GET heroes whose name matches the search term
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
      .pipe(
        tap(_ => this.log(`found hero matching "${term}"`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}


