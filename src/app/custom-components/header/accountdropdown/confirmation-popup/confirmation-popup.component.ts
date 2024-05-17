import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-switch-account-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  @Output() switchAccount  = new EventEmitter();
  ngOnInit(): void {
  }
  resetAndCloseForm() {
    this.modalService.dismissAll();
  }
  onClick($event) {
    this.switchAccount.emit($event);
  }
}
