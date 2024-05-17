import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { CommonUtils } from "src/app/core/utils/utils";
import { AccountsService } from "src/app/shared/services/accounts.service";

@Component({
  selector: "app-accounts-credit-payment",
  templateUrl: "./acounts-credit-payment.component.html",
  styleUrls: ["./acounts-credit-payment.component.scss"],
})
export class AccountsCreditPaymentComponent implements OnInit, OnDestroy {
  paymentDuePercent: any;
  paymentProcessing: any;
  creditBalancePercent: any;
  @Output() graphDataLoad = new EventEmitter<boolean>(false);
  isLoading$ = new BehaviorSubject<boolean>(true);
  creditPaymentData: any;
  creditProcessingPercent: any;
  private subscription = new Subscription();
  creditDataCheck: boolean = false;
  creditAvaliablePercent: any;
  leftOverlayValue: any;
  leftGrayOverlayValue: any;
  constructor(private accountsService: AccountsService) {}
  isMobile = CommonUtils.isMobile();
  accountNumberEmptyVal: boolean = false;

  ngOnInit(): void {
    this.creditBal();
  }

  escapeJson(str: any): any {
    const myJSONString = JSON.stringify(str);
    const myEscapedJSONString = myJSONString
      .replace(/\\n/g, "\\n")
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, "\\&")
      .replace(/\\r/g, "\\r")
      .replace(/\\t/g, "\\t")
      .replace(/\\b/g, "\\b")
      .replace(/\\f/g, "\\f")
      .replace(/\\/g, "");

    const firstChar = myEscapedJSONString?.substring(0, 1);

    return firstChar == '"' || firstChar == "'"
      ? myEscapedJSONString?.substring(1, myEscapedJSONString?.length - 1)
      : myEscapedJSONString;
  }

  creditBal(): void {
    this.subscription.add(
      this.accountsService.creditPaymentGraphData().subscribe(
        (data: any) => {
          //this.accountsService.creditLimit = data.creditLimit;
          //this.creditPaymentData = JSON.parse(data);

          const resData: any = JSON.parse(
            JSON.stringify(this.escapeJson(data))
          );

          const responseData = JSON.parse(resData);

          let totalOverdueAmtInDspCrcy: number = 0;
          let totalAmountInDisplayCrcy: number = 0;
          this.creditPaymentData =
            responseData?.ZB2R_CREDITINFORMATION1?.ZB2R_CREDITINFORMATION1Type;

          responseData?.ZB2R_CREDITINFORMATION1?.ZB2R_CREDITINFORMATION1Type?.ZB2R_P_AccountRecType?.forEach(
            (resData: any) => {
              if (
                resData?.NetDueIntervalText === "A. < -90" ||
                resData?.NetDueIntervalText === "B. -90 - -61" ||
                resData?.NetDueIntervalText === "C. -60 - -31" ||
                resData?.NetDueIntervalText === "D. -30 - 0"
              ) {
                totalOverdueAmtInDspCrcy =
                  totalOverdueAmtInDspCrcy +
                  parseInt(resData?.TotalOverdueAmtInDspCrcy);
              }
              if (
                resData?.NetDueIntervalText === "A. < -90" ||
                resData?.NetDueIntervalText === "H. > 90" ||
                resData?.NetDueIntervalText === "E. 1 - 30" ||
                resData?.NetDueIntervalText === "F. 31 - 60" ||
                resData?.NetDueIntervalText === "G. 61 - 90" ||
                resData?.NetDueIntervalText === "D. -30 - 0" ||
                resData?.NetDueIntervalText === "C. -60 - -31" ||
                resData?.NetDueIntervalText === "B. -90 - -61"
              ) {
                totalAmountInDisplayCrcy =
                  totalAmountInDisplayCrcy +
                  parseInt(resData?.TotalAmountInDisplayCrcy);
              }
            }
          );

          this.accountsService.creditLimit =
            this.creditPaymentData?.CustomerCreditLimitAmount;

          let totalPayment =
            parseInt(this.creditPaymentData?.BalanceOpenValues) +
            this.creditPaymentData?.CrdtLmtExceededAmtInDspCrcy;

          this.paymentDuePercent = Math.round(
            (totalOverdueAmtInDspCrcy / totalAmountInDisplayCrcy) * 100
          );
          this.paymentProcessing =
            (parseInt(this.creditPaymentData?.BalanceOpenValues) /
              parseInt(this.creditPaymentData?.AvailableCreditInvoices)) *
            100;
          this.paymentProcessing = 100 - this.paymentDuePercent;

          if (
            this.paymentDuePercent?.toString() == "NaN" &&
            this.paymentProcessing?.toString() == "NaN"
          ) {
            this.paymentProcessing = 0;
            this.paymentDuePercent = 0;
            this.accountNumberEmptyVal = true;
          } else if (this.paymentDuePercent?.toString() == "NaN") {
            this.paymentDuePercent = 0;
            this.accountNumberEmptyVal = true;
          } else if (this.paymentProcessing?.toString() == "NaN") {
            this.paymentProcessing = 0;
            this.accountNumberEmptyVal = true;
          }
          //Credit Calculation to show graph percentage
          this.creditBalancePercent = Math.round(
            (parseInt(this.creditPaymentData?.AvailableCreditInvoices) /
              parseInt(this.creditPaymentData?.CustomerCreditLimitAmount)) *
              100
          );
          this.creditProcessingPercent = Math.round(
            ((parseInt(this.creditPaymentData?.BalanceOpenValues) +
              parseInt(this.creditPaymentData?.Balanceopendelivery) -
              parseInt(this.creditPaymentData?.AvailableCreditInvoices)) /
              parseInt(this.creditPaymentData?.CustomerCreditLimitAmount)) *
              100
          );
          this.creditAvaliablePercent =
            100 - (this.creditBalancePercent + this.creditProcessingPercent);
          if (
            this.creditBalancePercent.toString() == "NaN" &&
            this.creditProcessingPercent == "NaN"
          ) {
            this.accountNumberEmptyVal = true;
          }

          this.isLoading$.next(false);
          this.creditDataCheck = true;

          if (this.paymentDuePercent == "NaN") {
            this.paymentDuePercent = 0;
          }
          // this.graphDataLoad.emit();
        },
        (error) => {
          this.isLoading$.next(false);
        }
      )
    );
  }

  getFloatNumber(value: any): any {
    const retValue: any = parseFloat(value).toFixed(3).toString();
    return isNaN(retValue) ? 0 : retValue;
  }

  getOpenOrders(): any {
    return this.getFloatNumber(
      ((this.creditPaymentData?.BalanceOpenValues as number) +
        this.creditPaymentData?.Balanceopendelivery) as number
    );
  }

  getAvailableBalance(): any {
    return this.getFloatNumber(
      parseFloat(this.creditPaymentData?.BalanceOpenValues)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
