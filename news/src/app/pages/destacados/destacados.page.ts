import { Component, OnInit, ViewChild } from '@angular/core';
import { NoticiasService } from 'src/app/services/noticias.service';
import { Observable } from 'rxjs';
import { Noticia, Article } from 'src/app/interfaces/noticia';
import { IonInfiniteScroll, IonContent } from '@ionic/angular';


@Component({
  selector: 'app-destacados',
  templateUrl: './destacados.page.html',
  styleUrls: ['./destacados.page.scss'],
})
export class DestacadosPage implements OnInit {

  @ViewChild(IonInfiniteScroll, {static: true}) infinite: IonInfiniteScroll;
  @ViewChild(IonContent, {static: true}) scroll: IonContent;

  categorias: string[ ] = [ 'general','business', 'entertainment',
   'health', 'science','sports', 'technology' ];
  categoria: string;
  
  array_Noticias: Article[]; 

  constructor( private noticias: NoticiasService ) { }

  ngOnInit(  ) {
    this.categoria = this.categorias[0];
    this.noticias.getNewsByCategory(this.categoria).subscribe( (resp) =>{
      this.array_Noticias = resp.articles;
    });
  }

  loadData( evento ){
    this.noticias.getNewsByCategory(this.categoria).subscribe( (resp)=> {
      console.log(resp.totalResults);
      console.log(this.array_Noticias.length);
    

      if( this.array_Noticias.length >= resp.totalResults ){
          evento.target.disabled = true;
          this.infinite.disabled = true;
      }
      else{
        this.array_Noticias.push(... resp.articles );
        evento.target.complete();
      }
      

    });
  }


  segmentChanged( evento ){
    this.categoria = evento.detail.value;
    this.noticias.getNewsByCategory(this.categoria).subscribe( (resp)=>{
      this.array_Noticias = [];
      this.infinite.disabled = false;
  
    
      this.array_Noticias = resp.articles;
      this.scroll.scrollToTop();
    });
  }
}
