import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse ,HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError ,map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }


  //consume la api publica de datos abiertos para obtener los trms
  public obtenerTrm(){
      const datosAbiertos = "https://www.datos.gov.co/resource/ceyp-9c7c.json?$limit=10000";
      return this.http.get(datosAbiertos);
  }
  
  //consulta el valor del bitcoin en un dia especifico
  //fecha: fecha que se desea consultar debe stas en formato YYYY-MM-DD
  public obtenerHistoricoBitCoin(fecha){
     const historico = 'https://api.coinbase.com/v2/prices/BTC-USD/spot?date='+fecha;
     return this.http.get(historico);
  }

  //obtiene el precio de compra del bitcoin en tiempo real
  public obtenerBitCoinInfoActual(): Observable<any> { 
    const urlCoinBase = 'https://api.coinbase.com/v2/prices/BTC-USD/buy'; 
    return this.http.get(urlCoinBase);
  }

  //Obtiene la informacion general https://fastforex.readme.io/reference/introduction 
  public obtenerTRMeuro(): Observable<any> {
    const urlFastForex = 'https://api.fastforex.io//fetch-one?from=USD&to=EUR&api_key=c5aa2d5452-cf3b494b98-r6u2x9'; 
    return this.http.get(urlFastForex);
  }

}
