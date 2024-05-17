export class OrderResponseModel {
    code: string;
    placed: string;
    status: string;
    statusDisplay: string;
    deleiveryDate: string;
    deliveryAddress: {
        firstName: string;
        lastName: string;
        line1: string;
        line2: string;
        town: string;
        region: {
            isocode: string;
            isocodeShort: string;
            countryIso: string;
            name: string;
        }

        district
        phone
        cellphone
        email
        country: {
            isocode: string;
            name: string
        }

    }
    shippingAddress: boolean;
    defaultAddress: boolean;
    visibleInAddressBook: boolean;
    formattedAddress: string;
    contactAddress: boolean;
    companyAddress: boolean;
}
