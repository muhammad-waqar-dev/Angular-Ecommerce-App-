import { Component, OnInit } from '@angular/core';
import { CmsService } from '@spartacus/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-custom-footer',
  templateUrl: './custom-footer.component.html',
  styleUrls: ['./custom-footer.component.scss']
})
export class CustomFooterComponent implements OnInit {
  siteLogoData: any;
  footerBannerData: any;
  contactInfo: any;
  paragraphData:any = '';
  isLoading$ = new BehaviorSubject<boolean>(false);
  constructor(private cmsService: CmsService) { }

  ngOnInit(): void {
    this.isLoading$.next(true);
    this.cmsService.getComponentData("SiteFooterLogoComponent").subscribe((data) => {
      this.siteLogoData = data;
    })
    this.cmsService.getComponentData("FIFooterBannerComponent").subscribe((data) => {
      this.footerBannerData = data;
    })
    this.cmsService.getComponentData("FIContactComponent").subscribe((data) => {
      this.contactInfo = data;
      this.isLoading$.next(false);
    })
    this.cmsService.getComponentData("FIFooterTextParagraph").subscribe((data) => {
      this.paragraphData = data;
      this.isLoading$.next(false);
    })
    
  }
  callTo() {
    return "tel:" + this.contactInfo?.content;
  }

}
