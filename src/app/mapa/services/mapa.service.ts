import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Geocoding } from '../models/geocoding';

@Injectable({
  providedIn: 'root'
})
export class MapaService {

  constructor(private http: HttpClient ) { }


  obterLatELong():Observable<Geocoding[]>{

    return this.http.get<Geocoding[]>('https://geocode.maps.co/search?q=RJ+BR')


  }

}
