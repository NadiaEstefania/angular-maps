/// <reference types="@types/google.maps" />

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, catchError, map, of } from 'rxjs';
import { MapaService } from './services/mapa.service';
import { Marcador } from './models/marcador';


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit,OnDestroy{


  apiLoaded?: Observable<boolean>;
 

//Este objeto Options define algumas propriedades de inicialização do mapa
  options: google.maps.MapOptions = {
    center: {lat:  -22.908333, lng: -43.196388},
    zoom: 8
  };

//ViewChild é um tipo de decorator que faz com que possamos acessar elementos do nosso template,
//conseguimos acessar outros componentes filhos que usamos dentro do nosso template
// por exemplo o <google-maps> é 
//um componente da bibliote da Maps ou outros elementos presentes no template.
//aqui estamos fazendo referencia ao infoWindow declarado no template a fim de acessar alguns metodos dele.
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  subscription$!: Subscription


  marcadores: Marcador[] = []

  constructor(
   private httpClient: HttpClient,
   private mapaService: MapaService
  ){
    //Para funcionamento do programa substituir a API Key
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=[YOUR_KEY_HERE]', 'callback')
    .pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }
 


  ngOnInit(): void {


    this.subscription$ =  this.mapaService.obterLatELong().subscribe(geocoding=>{
      geocoding.forEach(val =>{

      const localizacao= {lat:parseFloat(val.lat),lng:parseFloat(val.lon)};
      const label: google.maps.MarkerLabel = {text:val.display_name}
      
      this.marcadores.push({label:label,position:localizacao})
    })})


}


  openInfoWindow(marker: MapMarker,markerPosition:Marcador) {
  
    this.infoWindow.infoWindow?.setContent(`${markerPosition.label.text}`)
    this.infoWindow.open(marker);
  }


  ngOnDestroy(): void {
    this.subscription$.unsubscribe()
  }


}
