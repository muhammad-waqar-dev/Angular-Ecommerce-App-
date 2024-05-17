import { environment } from "src/environments/environment"

const domainName = 'fletcherwebservices/v2/fi-spa/';

export const POST_SEND_NOTE_ENDPOINT = {
  url: environment.siteUrl + domainName +'webforms/send-note'
}

export const POST_PRODUCT_INQUIRY = {
  url: environment.siteUrl + domainName +'webforms/help-with-product'
}

export const POST_REVOKE = {
  url: environment.siteUrl + 'authorizationserver/oauth/revoke'
}

export const POST_ADD_NEW_TEAM_MEMBER_ENDPOINT = {
  url: environment.siteUrl + domainName +"webforms/team-member"
}

export const POST_USER_PROFILE_UPDATE = {
  url: environment.siteUrl + domainName +"webforms/user-details"
}

export const GET_AVAILABLE_USERS = {
  url: environment.siteUrl + domainName +'orgUnits/availableUsers'
}

export const GET_ORDERS = {
  url: environment.siteUrl + domainName +'history/account/orders'
}

export const GET_ORDER_Details = {
  url: environment.siteUrl + domainName +'history/order'
}

export const GET_ORDER_Statement = {
  url: environment.siteUrl + domainName +'documents'
}

export const GET_QUOTES = {
  url: environment.siteUrl + domainName +'fbQuotes/quotes'
}

export const GET_QUOTE_DETAILS = {
  url: environment.siteUrl + domainName +'fbQuotes/quote'
}

export const GET_QUOTE_Statement = {
  url: environment.siteUrl + domainName +'documents'
}

export const POST_WORKWHYFIDETAIL = {
  url: environment.siteUrl + domainName +'webforms/customer-suggest'
}

export const GET_COUNTRIES = {
  url: environment.siteUrl + domainName +'countries'
}

export const GET_STATES = {
  url: environment.siteUrl + domainName +'countries'
}

export const GET_DELIVERY_PICKUP = {
  url: environment.siteUrl + domainName +'users/current/checkout-data'
}

export const POST_DELIVERY_CHECK = {
  url: environment.siteUrl + domainName +'users/current/checkout-data/validate'
}

export const POST_FOR_REVIEW_Order_CHECK = {
  url: environment.siteUrl + domainName +'users/current/update-checkout-data'
}

export const POST_CardPaymentOrder = {
  url: environment.siteUrl + domainName +'order-payment/getOrderTransactionDetails'
}

export const POST_PaymentOrder = {
  url: environment.siteUrl + domainName +'users/current/orders?cartId=current&fields=DEFAULT,entries(totalPrice(formattedValue))'
}

export const POST_CartEmptyOrder = {
  url: environment.siteUrl + domainName +'users/current/carts?fields=DEFAULT'
}

export const GET_PermissionList = {
  url: environment.siteUrl + domainName +'fbB2BUser/users/current/permissions/?'
}

export const POST_ChangeOrder = {
  url: environment.siteUrl + domainName +'webforms/changeOrder'
}

export const GET_creditPaymentGraphURL = {
  url: environment.siteUrl + domainName +'invoiceandbilling/creditbalance'
}

export const POST_DISPUTE_INVOICE = {
  url: environment.siteUrl + domainName +'webforms/disputedInvoice'
}
export const POST_CreateAccountURL = {
  url: environment.siteUrl + domainName +'webforms/createAccount'
}

export const POST_RequestForPod = {
  url: environment.siteUrl + domainName +'webforms/pod-request'
}

export const GET_AccountsStatements = {
  url: environment.siteUrl + domainName +'invoiceandbilling/statements',
  pdfUrl: environment.siteUrl + domainName +'documents'
}

export const GET_Accounts = {
  url: environment.siteUrl + domainName +'invoiceandbilling/billing-documents?'
}

export const GET_Invoice_Statement = {
  url: environment.siteUrl + domainName +'documents/getBillingDocPDF'
}

export const GET_Account_Transaction_OTP = {
  url: environment.siteUrl + domainName +'invoice/getInvoiceTransactionOTP'
}

export const POST_Account_Transaction_DETAIL = {
  url: environment.siteUrl + domainName +'invoice/getInvoiceTransactionDetails?field=DEFAULT'
}

export const GET_Transaction_OTP = {
  url: environment.siteUrl + domainName +'order-payment'
}

export const POST_Internal_Staff = {
  url: environment.siteUrl + domainName +'fbB2BUser/validate-trade-account'
}

export const GET_Prodcut_Details =  ((productCode : any ) => {
  return {url: environment.siteUrl + domainName +'products/' + productCode };
})

export const GET_CartDetails = {
  url: environment.siteUrl + domainName +'users/current/carts?fields=DEFAULT'
}