import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { popupThankYouMessage } from 'src/app/core/constants/general';

@Component({
  selector: 'app-fi-confirmation-popup',
  templateUrl: './fi-confirmation-popup.component.html',
  styleUrls: ['./fi-confirmation-popup.component.scss']
})
export class FIConfirmationPopupComponent implements OnInit {

  @Input() isSuccess: boolean = false;
  popupThankYouMessage = popupThankYouMessage;
  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }

}
