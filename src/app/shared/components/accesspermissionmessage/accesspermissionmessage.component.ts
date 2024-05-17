import { Component, OnInit } from '@angular/core';
import { permissionAccessMessage } from 'src/app/core/constants/general';

@Component({
  selector: 'app-accesspermissionmessage',
  templateUrl: './accesspermissionmessage.component.html',
  styleUrls: ['./accesspermissionmessage.component.scss']
})
export class AccesspermissionmessageComponent implements OnInit {
  permissionAccessMessage = permissionAccessMessage;
  constructor() { }

  ngOnInit(): void {
  }

}
