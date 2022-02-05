import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import {interval, Subject} from "rxjs";
import {map, takeUntil, takeWhile} from "rxjs/operators";
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  
  //almacena la informacion de trm del portal datos abiertos del gobierno
  dataTrm :any = {};  
  //alamacena la informacion obtenida de coin base 
  dataBitCoin :any = {};   
  //alamacena el ultimo valor del trm del peso 
  trmActual :any = 0 ;
  //alamacena el precio del bitcoin en dolares
  bitCoinDolares : any = 0 ; 
  //almacena la fecha actual 
  fechaActual = new Date();
  //alamacena la fecha en formato  YYYY-MM-DD
  fechaMascara;
  //arreglo con la lista de fechas historicas 
  historicoFechas = [];
  //alamacena los historicos con fecha y precio del bitcoin
  historicoPreciosBitcoin = [];
  //cantidad de dias que se consultara el historico
  cantidadDiasHistorico = 15
  //tiempo de espera para volver a consultar el precio del bitcoin en milisegundos
  valorIntervaloConsulta = 60000;

  constructor(public apiService: ApiService ,public modalController: ModalController ) {
    //cada 60 segundos se hace la consulta del precio actual del bitcoin
    interval(this.valorIntervaloConsulta).subscribe((func => {
      //consume servicio rest
      this.apiService.obtenerBitCoinInfoActual().subscribe(responseBit => {
        //console.log(responseBit);
         //Mascara de fecha 
        this.fechaActual = new Date();
        this.fechaMascara = this.fechaActual.getUTCFullYear()+"-"+(this.fechaActual.getUTCMonth()+1)+"-"+this.fechaActual.getDate() + "  " +this.fechaActual.getHours()+":"+this.fechaActual.getMinutes();
        this.dataBitCoin = responseBit;
        this.bitCoinDolares = this.dataBitCoin.data.amount;
        console.log("Bit Coin en dolares : " + this.bitCoinDolares);
      })
    }))
   

    this.fechaMascara = this.fechaActual.getUTCFullYear()+"-"+(this.fechaActual.getUTCMonth()+1)+"-"+this.fechaActual.getDate() + "  " +this.fechaActual.getHours()+":"+this.fechaActual.getMinutes();

    //obtiene el valor del trm actual del peso
    this.apiService.obtenerTrm().subscribe(response => {
      //console.log(response);
      this.dataTrm= response
      //console.log(this.dataTrm.length);
      //console.log(this.dataTrm[this.dataTrm.length-1]);
      this.trmActual= this.dataTrm[this.dataTrm.length-1].valor;
      //console.log(this.trmActual);
    })

  
     //consulta inicial del precio del bitcoin
     this.apiService.obtenerBitCoinInfoActual().subscribe(responseBit => {
        //console.log(responseBit);
        this.dataBitCoin = responseBit;
        this.bitCoinDolares = this.dataBitCoin.data.amount;
        //console.log("Bit Coin en dolares : " + this.bitCoinDolares);
      });
   
    //console.log("fecha actual = " + this.fechaActual);
    //genera el rray de fechas para posteriormete hacer la consulta 
    for (var i = 1; i < this.cantidadDiasHistorico; ++i) {
      let fechaTemp = new Date();
      fechaTemp.setDate(this.fechaActual.getDate() -i );
      //console.log(fechaTemp);
      //console.log(fechaTemp.getUTCFullYear()+"-"+(fechaTemp.getUTCMonth()+1)+"-"+fechaTemp.getDate());
      let fechaTempFormat = fechaTemp.getUTCFullYear()+"-"+(fechaTemp.getUTCMonth()+1)+"-"+fechaTemp.getDate();
      this.historicoFechas.push(fechaTempFormat); //almacena 
     
    }
    //console.log(this.historicoFechas);
    //recorre el array para consultar en la api por cada dia  
    for (var i = 0; i < this.historicoFechas.length; ++i) {      
      let temp2 = this.historicoFechas[i];//fecha que se consulta 
      this.apiService.obtenerHistoricoBitCoin(this.historicoFechas[i]).subscribe(responseHisBit => {
        let datatemp = <any>{};
        //console.log(responseHisBit); 
        //console.log(this.historicoFechas[i]);
        datatemp = responseHisBit;
        datatemp.data.fecha = temp2;
        //almacena la informacion historica      
        this.historicoPreciosBitcoin.push(responseHisBit);
      })
    }
   

     //console.log(this.historicoPreciosBitcoin);

  }

 
  //presenta la ventana modal y envia parametros 
  //historico - booleano que valida si se dio click a un valor historico o al valor del dia actual
  //item - informacion del historico al cual se le dio click
  async presentModal(historico , item ) {
    //valida 
    if(!historico){//no es historico
        const modal = await this.modalController.create({
          component: ModalPage,
          cssClass: 'my-custom-class',
          componentProps: {
            'fecha': this.fechaMascara,
            'amount': this.bitCoinDolares,
            'trm':this.trmActual
            
          }
        });
        return await modal.present();
    }else{//es un valor historico 
        const modal = await this.modalController.create({
        component: ModalPage,
        cssClass: 'my-custom-class',
        componentProps: {
          'fecha': item.data.fecha,
          'amount': item.data.amount,
          'trm':this.trmActual
        }
     });
     return await modal.present();
  }
  
  
}


}
