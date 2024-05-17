import { Injectable } from "@angular/core";
import { NgbDate, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { GlobalMessageConfig, GlobalMessageService, GlobalMessageType } from "@spartacus/core";
import { Subject, BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class ShareEvents {

    constructor(private globalMessageService: GlobalMessageService,
        private globalConfig: GlobalMessageConfig) { }

    // Share Events Subjects Declraration
    private contactCustomerServiceSubject = new Subject<any>();
    private contactMobileCustomerServiceSubject = new Subject<any>();
    private helpWithProductSubject = new Subject<any>();
    private mobileProductSearchSidePanelSubject = new Subject<any>();
    private mobileHamburgerMenuSubject = new Subject<any>();
    private productMenuSubject = new Subject<any>();
    private addTeamMemberSubject = new Subject<any>();
    private updateTeamMemberSubject = new Subject<any>();
    private removeTeamMemberSubject = new Subject<any>();
    private accountsInfoAvailableSubject = new Subject<any>();
    private teamMemberSearch = new Subject<any>();
    private teamMemberReset = new Subject<any>();
    private orderDeliverySearch = new Subject<any>();
    private orderDeliveryReset = new Subject<any>();
    private quoteSearch = new Subject<any>();
    private quoteReset = new Subject<any>();
    private accountSearch = new Subject<any>();
    private accountReset = new Subject<any>();
    private cartDate = new Subject<any>();
    private changeOrderSubject = new Subject<any>();
    private disputeInvoiceSubject = new Subject<any>();
    private payInvoiceSubject = new Subject<any>();
    private requestForPODSubject = new Subject<any>();
    private productMTO = new Subject<any>();
    private cartUpdate = new Subject<any>();
    private resetTeamSearch = new Subject<any>();
    private resetGlobalSearch = new Subject<any>();
    public selectedPaymentAccountType = '';
    private createAccountSubject = new Subject<any>();
    private paymentSubject = new Subject<any>();

    private openInternalStaffPopup = new Subject<any>();
    private internalStaffHeaderValue = new Subject<any>();
    private openInternalStaffupdateAccount = new Subject<any>();
    private openInternalStaffUpdatePopup = new Subject<any>();
    private updateInternalStaffName = new Subject<any>();

    private closeSideMenuOnOpenSearchForm = new Subject<any>();

    public checkDeliveryData = [];
    public teamMemberSearchVal = '';
    public orderSearchVal = '';
    public orderSearchFromDate: any | null | NgbDate;
    public orderSearchToDate: any | null | NgbDate;
    public quoteSearchVal = '';
    public quoteSearchFromDate: any | null | NgbDate;
    public quoteSearchToDate: any | null | NgbDate;

    public accountSearchVal = '';
    public accountSearchValReference = '';
    public accountSearchFromDate: any | null | NgbDate;
    public accountSearchToDate: any | null | NgbDate;
    public orderCode = '';
    public otp = '';
    public accountsOtp = '';

    public isQuoteDetails: any = new BehaviorSubject(false);
    public isOrderDetails: any = new BehaviorSubject(false);
    public isAccountDetails: any = new BehaviorSubject(false);

    /* added for passing internal staff user value */
    private internalUserNumber:any = new BehaviorSubject({userNumber:null});

    public isInternalStaffLoaded: any = new BehaviorSubject(false);

    public selectedProduct: any;

    public paymentStatus: string = '';


    /* ---------------------------Send and Receive Events---------------------------*/

    // Send and Receive Events---------Contact Customer Service Popup Subject
    contactCustomerServicePopupSendEvent() {
        this.contactCustomerServiceSubject.next();
    }
    contactCustomerServicePopupReceiveEvent() {
        return this.contactCustomerServiceSubject.asObservable();
    }

    // Send and Receive Events--------- Mobile Contact Customer Service Popup Subject
    contactCustomerServicePopupMobileSendEvent() {
        this.contactMobileCustomerServiceSubject.next();
    }
    contactCustomerServicePopupMobileReceiveEvent() {
        return this.contactMobileCustomerServiceSubject.asObservable();
    }

    // Send and Receive Events--------- Mobile Contact Customer Service Popup Subject
    helpWithProductSubjectSendEvent() {
        this.helpWithProductSubject.next();
    }
    helpWithProductSubjectReceiveEvent() {
        return this.helpWithProductSubject.asObservable();
    }

    productMenuSubjectSendEvent() {
        this.productMenuSubject.next();
    }
    productMenuSubjectReceiveEvent() {
        return this.productMenuSubject.asObservable();
    }

    //mobileProductSearchSidePanelSubject Send and Receive Event
    mobileProductSearchSidePanelSubjectSentEvent() {
        this.mobileProductSearchSidePanelSubject.next();
    }

    mobileProductSearchSidePanelSubjectReceiveEvent() {
        return this.mobileProductSearchSidePanelSubject.asObservable();
    }

    // mobileHamburgerMenuSubject Send and Receive Event
    mobileHamburgerMenuSubjectSendEvent() {
        this.mobileHamburgerMenuSubject.next();
    }
    mobileHamburgerMenuSubjectReceiveEvent() {
        return this.mobileHamburgerMenuSubject.asObservable();
    }


    // mobileHamburgerMenuSubject Send and Receive Event
    addTeamMemberSubjectSendEvent() {
        this.addTeamMemberSubject.next();
    }
    addTeamMemberSubjectReceiveEvent() {
        return this.addTeamMemberSubject.asObservable();
    }

    updateTeamMemberSubjectSendEvent(e) {
        this.updateTeamMemberSubject.next(e);
    }
    updateTeamMemberSubjectReceiveEvent() {
        return this.updateTeamMemberSubject.asObservable();
    }

    // removeTeamMemberSubject Send and Receive Event
    removeTeamMemberSubjectSendEvent() {
        this.removeTeamMemberSubject.next();
    }
    removeTeamMemberSubjectReceiveEvent() {
        return this.removeTeamMemberSubject.asObservable();
    }

    // removeTeamMemberSubject Send and Receive Event
    accountsInfoAvailableSubjectSendEvent() {
        this.accountsInfoAvailableSubject.next();
    }
    accountsInfoAvailableSubjectReceiveEvent() {
        return this.accountsInfoAvailableSubject.asObservable();
    }

    // Mobile teamMember Search Send and Receive Event
    mobileTeamMemberSearchSendEvent(e) {
        this.teamMemberSearch.next(e);
    }
    mobileTeamMemberSearchReceiveEvent() {
        return this.teamMemberSearch.asObservable();
    }

    // Mobile teamMember Reset Send and Receive Event
    mobileTeamMemberResetSendEvent() {
        this.teamMemberReset.next();
    }
    mobileTeamMemberResetReceiveEvent() {
        return this.teamMemberReset.asObservable();
    }

    // Mobile order and delivery Send and Receive Event
    mobileOrderDeliverySearchSendEvent(e) {
        this.orderDeliverySearch.next(e);
    }
    mobileOrderDeliverySearchReceiveEvent() {
        return this.orderDeliverySearch.asObservable();
    }

    mobileOrderDeliveryResetSendEvent() {
        this.orderDeliveryReset.next();
    }
    mobileOrderDeliveryResetReceiveEvent() {
        return this.orderDeliveryReset.asObservable();
    }

    // Mobile Quote Send and Receive Event
    mobileQuoteSearchSendEvent(e) {
        this.quoteSearch.next(e);
    }
    mobileQuoteReceiveEvent() {
        return this.quoteSearch.asObservable();
    }

    mobileQuoteResetSendEvent() {
        this.quoteReset.next();
    }
    mobileQuoteResetReceiveEvent() {
        return this.quoteReset.asObservable();
    }


    // Mobile Account Send and Receive Event
    mobileAccountSearchSendEvent(e) {
        this.accountSearch.next(e);
    }
    mobileAccountSearchReceiveEvent() {
        return this.accountSearch.asObservable();
    }

    mobileAccountResetSendEvent() {
        this.accountReset.next();
    }
    mobileAccountResetReceiveEvent() {
        return this.accountReset.asObservable();
    }


    // Send Cart Data
    sendCartData(e) {
        this.cartDate.next(e);
    }
    receiveCartDate() {
        return this.cartDate.asObservable();
    }

    productFormMTOsendEvent() {
        this.productMTO.next();
    }
    productFormMTOreceiveEvent() {
        return this.productMTO.asObservable();
    }

    cartUpdateSendEvent(e) {
        this.cartUpdate.next(e);
    }
    cartUpdateReceiveEvent() {
        return this.cartUpdate.asObservable();
    }

    resetTeamSearchSendEvent() {
        this.resetTeamSearch.next();
    }
    resetTeamSearchReceiveEvent() {
        return this.resetTeamSearch.asObservable();
    }

    resetGlobalSearchSendEvent() {
        this.resetGlobalSearch.next();
    }
    resetGlobalSearchReceiveEvent() {
        return this.resetGlobalSearch.asObservable();
    }

    notificationInfo(message) {
        this.globalConfig.globalMessages['[GlobalMessage] Information'].timeout = 4000;
        this.globalMessageService.add(
            message,
            GlobalMessageType.MSG_TYPE_INFO
        );
    }

    // Send and Receive Events--------- Mobile Contact Customer Service Popup Subject
    changeOrderSubjectSendEvent() {
        this.changeOrderSubject.next();
    }
    changeOrderSubjectReceiveEvent() {
        return this.changeOrderSubject.asObservable();
    }

    // Send and Receive Events--------- payment Service Popup Subject
    paymentSubjectSendEvent() {
        this.paymentSubject.next();
    }
    paymentSubjectReceiveEvent() {
        return this.paymentSubject.asObservable();
    }

    // Send and Receive Events--------- Dispute Invoice Popup Subject
    disputeInvoiceSubjectSendEvent() {
        this.disputeInvoiceSubject.next();
    }
    disputeInvoiceSubjectReceiveEvent() {
        return this.disputeInvoiceSubject.asObservable();
    }

    // Send and Receive Events--------- Pay Invoice Popup Subject
    payInvoiceSubjectSendEvent() {
        this.payInvoiceSubject.next();
    }
    payInvoiceSubjectReceiveEvent() {
        return this.payInvoiceSubject.asObservable();
    }

    // Send and Receive Events--------- Request for POD Popup Subject
    requestForPODSubjectSendEvent() {
        this.requestForPODSubject.next();
    }
    requestForPODSubjectReceiveEvent() {
        return this.requestForPODSubject.asObservable();
    }

    // centralized method to set value - either quotes details page boolean is true/false
    setIsQuoteDetails(status: boolean) {
        this.isQuoteDetails.next(status);
    }

    // centralized method to set value - either orders details page boolean is true/false
    setIsOrderDetails(status: boolean) {
        this.isOrderDetails.next(status);
    }

    // centralized method to set value - either account details page boolean is true/false
    setIsAccountDetails(status: boolean) {
        this.isAccountDetails.next(status);
    }

    createAccountSubjectSendEvent() {
        this.createAccountSubject.next();
    }
    createAccountSubjectReceiveEvent() {
        return this.createAccountSubject.asObservable();
    }

    // Internal Staff open popup event
  internalStaffPopupSendEvent() {
    this.openInternalStaffPopup.next();
  }
  internalStaffPopupReceivevent(): Observable<any>{
    return this.openInternalStaffPopup.asObservable();
  }

  internalStaffSearchUpdateSendEvent() {
    this.openInternalStaffUpdatePopup.next();
  }

  internalStaffSearchUpdateReceiveEvent() {
    return this.openInternalStaffUpdatePopup.asObservable();
  }

  internalUpdateHeaderSendEvent() {
    this.updateInternalStaffName.next();
  }

  internalUpdateHeaderReceiveEvent() {
    return this.updateInternalStaffName.asObservable();
  }

  //Internal staff to update header customer ID when search with ordernumber
  internalStaffUpdateAccountSendEvent() {
    this.openInternalStaffupdateAccount.next();
  }
  internalStaffUpdateAccountReceiveEvent(): Observable<any> {
    return this.openInternalStaffupdateAccount.asObservable();
  }

    //sending value of internal user to disabled text box
    setInternalUserNumber(dataObj: string) {
        this.internalUserNumber.next({ userNumber: dataObj });
    }

    receiveInternalUserNumber(): Observable<any> {
        return this.internalUserNumber.asObservable();
    }

    updateSelectedProduct(product: any): void {
      this.selectedProduct = product;
    }

    getSeletedProdcut(): any {
      return this.selectedProduct;
    }

    //closing side menu on click of Select Account button in mobile view
    closeSideMenuSendEvent() {
        this.closeSideMenuOnOpenSearchForm.next();
    }
    closeSideMenuReceiveEvent() {
        return this.closeSideMenuOnOpenSearchForm.asObservable();
    }

    isInternalStaffLoadedSendEvent() {
        this.changeOrderSubject.next();
    }

    isInternalStaffLoadedReceiveEvent() {
        return this.changeOrderSubject.asObservable();
    }

}
