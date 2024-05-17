import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { myTeamConstants } from 'src/app/core/constants/general';
import { CommonUtils } from 'src/app/core/utils/utils';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { MyTeamService } from '../../shared/services/my-team.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MyTeamFiltersComponent } from './my-team-filters/my-team-filters.component';
import { PermissionService } from 'src/app/core/service/permissions.services';
import { BehaviorSubject } from 'rxjs';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import { ViewConfig } from '@spartacus/storefront';

@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.scss']
})
export class MyTeamComponent implements OnInit, AfterViewChecked, OnChanges {
  myTeam = myTeamConstants;
  myTeamForm: UntypedFormGroup;
  numpattern = '^[0-9]*$';
  isMobile = CommonUtils.isMobile();
  isLoading$ = new BehaviorSubject<boolean>(true);
  divContent = true;
  isOpen = false;
  selectedSortName: any = {code: "STATUSAZ", name: "All active", selected: true};
  showFilterSection: boolean = true;
  modalRef: any;
  addTeamMember$ = new BehaviorSubject<boolean>(true);
  testVal: boolean = false;
  permissionAllowed: boolean;
  @Output() valueChange = new EventEmitter();
  cards = [{
    name: 'string',
    status: 'string',
    img: 'string'
  }];
  @ViewChild('updateMemberFormModal', { static: true }) updateMemberFormModal;

  emailCheck: boolean = false;
  phoneCheck: boolean = false;
  jobTitleCheck: boolean = false;

  isInfiniteScroll: boolean = this.isMobile;

  pageSize: number = 12;
  paginationModel = {
    currentPage: 0,
    pageSize: this.pageSize,
    sort: '',
    totalPages: 3,
    totalResults: 10,
  };

  filtersModel: any = [];
  filtersCategoryState = [];
  filtersState = [[]]

  users = []
  mobileUserData: any;
  public isPaginationModel$ = new BehaviorSubject<boolean>(true);
  sorts = []
  @ViewChild(MyTeamFiltersComponent, { static: false }) MyTeamFiltersComponent;
  ErrorMsgText: string;

  constructor(private fb: UntypedFormBuilder,
    private teamsService: MyTeamService,
    private modalService: NgbModal,
    private shareEvents: ShareEvents,
    private cdr: ChangeDetectorRef,
    private permissionUtil: PermissionService,
    private userDetails: AccountDropDownStateService,
    private scrollConfig: ViewConfig) {
    this.shareEvents.resetGlobalSearchSendEvent();
    this.initializeFormGroup();
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
    this.valueChange.emit(true);
  }

  ngOnChanges(): void {
  }

  ngOnInit(): void {
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
    'event': 'Page-Details', //constant value
    'currentURL': window.location.href, // page url
    'currentPageTitle': 'fletcher Insulation My Team Page', // enter if exists
    'pageType': 'My Team',
    'isLoggedIn': 'Yes'
    });
    this.resetTeamFilters();

    if (this.userDetails._getAccountState$ && this.userDetails.isDataAvailable) {
      this.getUsers();
    } else {
      this.shareEvents.accountsInfoAvailableSubjectReceiveEvent().subscribe(() => {
        this.getUsers();
      });
    }
    this.shareEvents.mobileTeamMemberSearchReceiveEvent().subscribe((data) => {
      this.onSearchQuery(data)
    });
    this.shareEvents.mobileTeamMemberResetReceiveEvent().subscribe(() => {
      this.onClearSearch();
    })


  }

  resetTeamFilters() {
    this.teamsService.permissionsQueryString = [];
    this.teamsService.isApplyPermissionsQuery = false;

    this.teamsService.teamsSearchQuery = '';
    this.teamsService.isApplySearchQuery = true;
  }

  toggleDivContent() {
    this.divContent = !this.divContent;
    this.showFilterSection = !this.showFilterSection;
  }

  openAddTeamMemberPopup() {
    this.modalService.dismissAll();
    this.shareEvents.addTeamMemberSubjectSendEvent();
  }
  selectFilter(filterIndex, valueIndex) {
    this.filtersState[filterIndex][valueIndex] = !this.filtersState[filterIndex][valueIndex];
  }

  openFiltersPopup(content) {
    this.modalService.dismissAll();
    this.modalRef = this.modalService.open(content, { centered: true, size: 'lg' });
  }

  pageChange(event) {
    this.paginationModel.currentPage = event;
    this.getUsers();
    window.scroll(0,0);
  }

  getUsers() {

    this.teamsService.getUserData(this.paginationModel.currentPage, this.pageSize, this.selectedSortName.code, this.teamsService.permissionsQueryString).subscribe((data) => {
      
      this.users = data.users;
      this.paginationModel = data.pagination;
      this.mobileUserData = data;
      this.sorts = data.sorts;

      this.filtersModel = data.filters;
      this.initializeFilterState();

      this.isPaginationModel$.next(false);

      this.permissionAllowed = this.permissionUtil.isPermissionAllowed("fbManageMyTeamGroup") || (sessionStorage.getItem("fbCSRTradeAcc") && sessionStorage.getItem("internalUserState") == 'false');
      this.isLoading$.next(false);
      this.valueChange.emit(true);
    }, error => {
      if(error.status == 403) {
        this.permissionAllowed = false;
      }
      else {
        this.ErrorMsgText = error.error.errors[0].message;
      }
      this.isLoading$.next(false);
    });
  }

  usersPerPageSelectionChange(value) {
    this.pageSize = value;
    this.getUsers();
    window.scroll(0,0);
  }

  openRemoveMemberModal($event) {
    this.shareEvents.removeTeamMemberSubjectSendEvent();
  }

  onRemoveTeamMemberConfirmed() {
    let teamMemberId = 1;
    let x = this.teamsService.removeTeamMember(teamMemberId);
    if (x) {
      this.modalService.dismissAll();
    }
  }

  initializeFormGroup() {
    this.myTeamForm = this.fb.group({
      emailAddress: new UntypedFormControl(null, [Validators.required, Validators.email]),
      phoneNumber: new UntypedFormControl('', [Validators.pattern(this.numpattern), Validators.minLength(9), Validators.maxLength(10)]),
      jobTitle: new UntypedFormControl('', [Validators.required, Validators.minLength(4)])

    });
  }

  initializeFilterState() {
    this.filtersModel.forEach((n, m) => {
      this.filtersState[m] = [];
      n.values.forEach((e, o) => {
        this.filtersState[m][o] = e.selected;
      });
    })
  }

  onDropdownClick() {
    this.isOpen = !this.isOpen;
  }

  changeSortOption(e) {
    this.sorts.forEach(k => {
      k.selected = false;
    })
    this.selectedSortName = this.sorts[e];
    this.sorts[e].selected = true;
    this.paginationModel.currentPage = 0;
    this.getUsers();
  }

  onFilterSelection($event) {
    this.teamsService.isApplyPermissionsQuery = false;
    this.teamsService.isApplyPermissionsQuery = true;
    if (this.teamsService.permissionsQueryString[$event.filter.code]) {
      
      // if the selected filter is already present in the string, then the call is for de-select so remove it
      if (this.teamsService.permissionsQueryString[$event.filter.code].includes($event.value.code) && !$event.selected) {
        this.teamsService.permissionsQueryString[$event.filter.code] = this.teamsService.permissionsQueryString[$event.filter.code].replace($event.value.code, '')

        //after removing the de-selected filter, there will be trailing comma, remove trailing and leading commas if any
        this.teamsService.permissionsQueryString[$event.filter.code] = this.teamsService.permissionsQueryString[$event.filter.code].replace(/(^,)|(,$)/g, "")
        
        // after removing the trailing commas, check if string doesnt have any filter in it, if not then remove the key from the array as well (by deleting it)
        if (this.teamsService.permissionsQueryString[$event.filter.code].length < 1) {
          
            delete this.teamsService.permissionsQueryString[$event.filter.code];
          }
      }
      else {
        this.teamsService.permissionsQueryString[$event.filter.code] = this.teamsService.permissionsQueryString[$event.filter.code] + ',' + $event.value.code
      }
    }
    else {
      this.teamsService.permissionsQueryString[$event.filter.code] = $event.value.code
    }
    this.resetFiltersAndPagination(); // on filter change the page number and per page as reset to , pageNumber = 0, perPage = 12
    this.paginationModel.currentPage = 0;
    this.getUsers();
  }

  resetFiltersAndPagination() {
    this.pageSize = 12;
    this.paginationModel.currentPage = 0;
  }

  onSearchQuery($event) {
    this.teamsService.isApplyPermissionsQuery = false;
    this.teamsService.isApplySearchQuery = true;
    this.teamsService.teamsSearchQuery = $event;
    this.paginationModel.currentPage = 0;
    this.getUsers();
  }

  onClearSearch() {
    if(this.teamsService.teamsSearchQuery.length > 0){
      this.teamsService.teamsSearchQuery = '';
      this.paginationModel.currentPage = 0;
      this.getUsers();
    }
  }
  resetAndCloseForm() {
    
    this.modalService.dismissAll();
  }
  resetFilters() {
    this.teamsService.permissionsQueryString = [];
    this.teamsService.isApplyPermissionsQuery = false;

    this.teamsService.teamsSearchQuery = '';
    this.teamsService.isApplySearchQuery = true;
    this.paginationModel.currentPage = 0;
    this.selectedSortName = {code: "STATUSAZ", name: "All active", selected: true};

    this.getUsers();

  }
}
