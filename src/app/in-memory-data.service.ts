import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from './hero';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class InMemoryDataService implements InMemoryDbService {

  constructor() { }

  createDb() {
    const heroes = [
      {id: 11, name: 'Spider Man'},
      {id: 12, name: 'Super Man'},
      {id: 13, name: 'Iron Man'},
      {id: 14, name: 'Bat Man'},
      {id: 15, name: 'Ant Man'}
    ];
    return {heroes};
  }

  genId(heroes: Hero[]): number {
    return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1 : 11;
  }


}
