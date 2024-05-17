import { Component, HostBinding, Input, Output, QueryList, EventEmitter, Renderer2, ViewChildren, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BreakpointService, FacetCollapseState, FacetService, FocusDirective, ProductFacetNavigationComponent } from '@spartacus/storefront';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtils } from 'src/app/core/utils/utils';
import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Facet, FacetValue } from '@spartacus/core';
import { ProductextendService } from '../productextend.service';

@Component({
  selector: 'app-productfacets',
  templateUrl: './productfacets.component.html',
  styleUrls: ['./productfacets.component.scss']
})
export class ProductfacetsComponent extends ProductFacetNavigationComponent {
  protected _facet: Facet;
  state$: Observable<FacetCollapseState>;

  @Input() model: any;
  @Input() facetState: any;
  @Input() facetCategoryState;
  @Input() subFacetState
  @Input() resetFilters
  @Output() resetFilterFalse: EventEmitter<any> = new EventEmitter();
  facetModel: any;
  modalStateOpen = true;
  hideAccordion = [];
  isMobile = CommonUtils.isMobile();
  facetList$: Observable<any>;
  residentialChecked: any;
  commercialChecked: any;
  industrialChecked: any;

  segmentState = [];

  routerSnapshotURL = ':name-asc:application:Wall:fq=segment:Residential';
  isSpecialString = ':name-asc:isSpecial:true'

  @HostBinding('class.multi-select') isMultiSelect: boolean;

  @ViewChildren('facetValue') values: QueryList<ElementRef<HTMLElement>>;

  @ViewChild(FocusDirective) keyboardFocus: FocusDirective;

  @Input()
  set facet(value: Facet) {
    this._facet = value;
    this.isMultiSelect = !!value.multiSelect;
    this.state$ = this.facetService.getState(value);
  }

  get facet(): Facet {
    return this._facet;
  }

  constructor(private modalService: NgbModal, breakpointService: BreakpointService, protected facetService: FacetService, protected elementRef: ElementRef,
    protected renderer: Renderer2, public productextendService: ProductextendService, private route: ActivatedRoute, private router: Router) {
    super(breakpointService);
  }

  ngOnInit(): void {
    // on page load the default selection is Residential, so navigate there

    this.facetList$ = this.facetService?.facetList$;
    if (this.model?.facets) {
      this.facetModel = this.model;
    }
    this.isMobile = CommonUtils.isMobile();

    this.segmentState['Residential'] = true;
    this.segmentState['Commercial'] = false;
    this.segmentState['Industrial'] = false;
    this.segmentState['Special'] = false;

  }
  navigateToResidential() {
    let queryParam = ':name-asc:segment:Residential'
    this.router.navigate(['/my-products/all'], { queryParams: { query: queryParam }, replaceUrl: true });
  }

  selectedSegment() {
    if (window.location.href.includes('segment:Residential')) {
      this.residentialChecked = 'checked';
    }
    else if (window.location.href.includes('segment:Commercial')) {
      this.commercialChecked = 'checked';
    }
    else if (window.location.href.includes('segment:Industrial')) {
      this.industrialChecked = 'checked';
    }
  }

  ngAfterContentChecked() {
    this.selectedSegment();
  }

  ngOnChanges() {
    if (this.model?.facets) {
      this.facetModel = this.model;
    }
    if (this.resetFilters) {
      this.clearFilters();
    }
  }

  toggleFilterItems(i, catName) {
    this.hideAccordion[i] = !this.hideAccordion[i];
    this.productextendService.facetCategoryState[catName] = !this.productextendService.facetCategoryState[catName];
  }

  resetAndCloseForm() {
    this.modalService.dismissAll();
    this.modalStateOpen = !this.modalStateOpen;
  }

  getRouterLinkSegment(segmentName, segmentState) {

    this.segmentState[segmentName] = segmentState;
    let routerSnapshot = this.route.snapshot.queryParamMap.get('query');
    this.routerSnapshotURL = routerSnapshot

    let queryParamSegment = '';
    queryParamSegment = this.getSegmentQueryParam();


    let newSnapshot = this.routerSnapshotURL.split(':fq')

    this.routerSnapshotURL = newSnapshot[0] + queryParamSegment;

    this.router.navigate(['/my-products/all'], { queryParams: { query: this.routerSnapshotURL }, replaceUrl: false });
  }

  getRouterLink() {
    return (this.isMobile) ? './my-products/all' : './';
  }

  getLinkParams(value: FacetValue) {

    let newSnapshot = this.routerSnapshotURL.split(':fq')
    let segmentURL = ':fq' + newSnapshot[1];
    return this.facetService.getLinkParams(value.query?.query.value + segmentURL);
  }

  selectFacet(facetIndex, valueIndex, facet) {
    this.facetState[facetIndex][valueIndex] = true;
    if (this.isMobile) {
      let newSnapshot = this.routerSnapshotURL.split(':fq')
      let segmentURL = ':fq' + newSnapshot[1];
      let queryVal = this.facetService.getLinkParams(facet.query?.query.value + segmentURL);
      this.router.navigate(['/my-products/all'], { queryParams: { query: queryVal.query }, replaceUrl: false });
    }
  }

  selectSubFacet(valueName, subFacetIndex) {
    this.subFacetState[valueName][subFacetIndex] = !this.subFacetState[valueName][subFacetIndex];
  }

  selectFacetCategory(i) {
    this.productextendService.facetCategoryState[i] = !this.productextendService.facetCategoryState[i];
  }

  clearFilters() {
    let queryParam = ':fq=segment:Residential'

    this.segmentState['Residential'] = true;
    this.segmentState['Commercial'] = false;
    this.segmentState['Industrial'] = false;
    this.segmentState['Special'] = false;

    this.resetFilterFalse.emit(false);
    this.router.navigate(['/my-products/all'], { queryParams: { query: queryParam }, replaceUrl: true });

  }

  getSegmentQueryParam() {
    let query = '';
    if (this.segmentState['Residential']) {
      query = ':fq=segment:Residential';
    }
    if (this.segmentState['Commercial']) {
      query = ':fq=segment:Commercial';
    }
    if (this.segmentState['Industrial']) {
      query = ':fq=segment:Industrial';
    }
    if (this.segmentState['Residential'] && this.segmentState['Commercial']) {
      query = ':fq=segment:Residential,Commercial';
    }
    if (this.segmentState['Residential'] && this.segmentState['Industrial']) {
      query = ':fq=segment:Residential,Industrial';
    }
    if (this.segmentState['Commercial'] && this.segmentState['Industrial']) {
      query = ':fq=segment:Commercial,Industrial';
    }
    if (this.segmentState['Commercial'] && this.segmentState['Industrial'] && this.segmentState['Residential']) {
      query = ':fq=segment:Residential,Commercial,Industrial';
    }
    if (this.segmentState['Special']) {
      let a = this.routerSnapshotURL.includes('isSpecial')
      if (!a) {
        query = this.isSpecialString + query;
      }
    }
    if (!this.segmentState['Special']) {
      query = query.replace(this.isSpecialString, '');
      this.routerSnapshotURL = this.routerSnapshotURL.replace(this.isSpecialString, '');
    }
    return query;
  }

}