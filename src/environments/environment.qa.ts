// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
   siteUrl:
      'https://api.crre-fletcherb2-s1-public.model-t.cc.commerce.ondemand.com/',
    UIsiteURl: 'https://tst-fib2b.azurewebsites.net',
    auth0Domain: 'https://fi-test.au.auth0.com',
    auth0Audience: 'https://ecommerce.fletcher-insulation.com.au', // https://fi-test.au.auth0.com/api/v2/ // Old audience
    auth0Client_id: 'Gf0fsby0SmYp63hYQnivEvZL9EBYoDNz',
    auth0Client_secret: 'dC3e46urDKpKA9zy73fi0edFgskEUyVyfezEIB8mJx-nDmVfxKRUPlsvN6NIMNnY',
    logoutAuth0Domain: 'fi-test.au.auth0.com',
    paymentURL: 'https://uat-publicapi.paymentmanager.co.nz/ProcessCreditCard.aspx'

// Temporary point to D1
 // siteUrl:
 // 'https://api.crre-fletcherb2-d1-public.model-t.cc.commerce.ondemand.com/',
// UIsiteURl: 
// 'https://tst-fib2b.azurewebsites.net',
// auth0Domain: 'https://fi-dev.au.auth0.com',
// auth0Audience: 'https://fi-dev.au.auth0.com/api/v2/',
// auth0Client_id: '5P9KyuxJHI0vTqCjKdRs3QuWsN4N8XAq',
// auth0Client_secret: 'kK5sG2rwsU-Wc4mgmrQlPHxbYz3uZQPW55xYj3wf5PXf4mVOa6IcdcKBR_t832SR',
// logoutAuth0Domain: 'fi-dev.au.auth0.com',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.