import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

 
  //valor del bitcoin obtenido por parametro  
  amount =  this.navParams.get('amount');
  //fecha obtenida por parametro 
  fecha =this.navParams.get('fecha') ;
  //trm actual del peso 
  trmPeso = this.navParams.get('trm');
  //alamacena la informacion del trm del euro con respecto al dolar 
  dataTrmEuro:any = {} ;
  //alamacena unicamente el valor de los dolares a los que equivale un euro
  trmActualEuro:any = 0;
  //valor quemado en casi de no usar la api 
  valorEuroEstatico = 0.87;  
  //valida si se consume la api para obtener el valor o se toma el valor estatico
  euroEstatico = false ;
  //alamacena el total en euros por bitcoin 
  totalEnEuros:any = 0 ;
  //alamacena el total en pesos por bitcoin 
  totalEnPesos:any = 0 ;
  
  constructor(private navParams: NavParams, public apiService: ApiService ,public modalController: ModalController ) { 
      //alert(this.amount + "- " + this.fecha + " - " + this.trm);
      //valida si se tomara el euro estatico o desde el api 
      if(this.euroEstatico){
          this.trmActualEuro = this.valorEuroEstatico;
          //alert(this.trmActualEuro);
          this.calcularDatos();
      }else{//desde el api
          this.apiService.obtenerTRMeuro().subscribe(responseEuro => {
          console.log(responseEuro);
          this.dataTrmEuro= responseEuro;
          console.log(this.dataTrmEuro.result);
          this.trmActualEuro= this.dataTrmEuro.result.EUR;
          console.log(this.trmActualEuro);
         // alert(this.trmActualEuro);
          this.calcularDatos();
        })
      }
        
      
  }

  //calcula el total el euros y pesos apartir del precio del bitcoin y el trm actual del peso y el auro respectivamente
  calcularDatos(){
    this.totalEnEuros = this.amount * this.trmActualEuro ;
    this.totalEnPesos = this.amount * this.trmPeso;
    //alert(this.totalEnEuros + "--- "+ this.totalEnPesos );
  }

  //cierra la ventana modal
  cerrarVentana(){
    this.modalController.dismiss();
  }

  ngOnInit() {
  }

}
