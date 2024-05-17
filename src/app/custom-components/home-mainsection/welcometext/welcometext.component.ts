import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcometext',
  templateUrl: './welcometext.component.html',
  styleUrls: ['./welcometext.component.scss']
})
export class WelcometextComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
    'event': 'Page-Details', //constant value
    'currentURL': window.location.href, // page url
    'currentPageTitle': 'Home', // enter if exists
    'pageType': 'Home',
    'isLoggedIn': 'Yes'
    });
  }

}
