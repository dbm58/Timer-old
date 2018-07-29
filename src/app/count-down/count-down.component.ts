import { Component, OnInit } from '@angular/core';
import { Observable        } from 'rxjs/Rx';

@Component({
  selector: 'app-count-down',
  templateUrl: './count-down.component.html',
  styleUrls: ['./count-down.component.css']
})
export class CountDownComponent implements OnInit {

  running : boolean = false;

  maxReps = 5;
  spSecs = 120;
  ggSecs = 30;

  strct : [ number, number, string ];

  get repNum( ): number
  {
    return this.strct[ 0 ];
  }

  get countDown( ) : Date
  {
    return new Date(
                     0, 0, 0, 0,
                     0, // minutes
                     ( ( this.strct[ 2 ] == "Soft Pedal" ) ? this.spSecs : this.ggSecs ) - this.strct[ 1 ]
                   );
  }

  get action( ) : string
  {
    return this.strct[ 2 ];
  }

  constructor( ) { }

  ngOnInit( ) { }


  startTimer( )
  {
    this.running = true;
    var obs : Observable<[number, number, string]>[ ] = [ ];
    for( let rr = 0 ; rr < this.maxReps ; rr++ )
    {
      obs.push( Observable.range( 0, this.spSecs ).map( ( v, i ) => [ rr, i, 'Soft Pedal' ] ) );
      obs.push( Observable.range( 0, this.ggSecs ).map( ( v, i ) => [ rr, i, 'Go, go, go!'] ) );
    }
    //  ellipsis is a work-around for a RxJs bug
    var subscr = 
      Observable.zip(
                      Observable.concat( ... obs ),
                      Observable.interval( 1000 )
                    )
                    .subscribe(
                                x =>  this.strct = x[0],
                                null, 
                                ( ) => {
                                         this.running = false;
                                         subscr.unsubscribe( );
                                       }
                              );
  }
}
