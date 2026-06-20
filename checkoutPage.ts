import { Page, Locator, expect } from '@playwright/test';
import BrowserActionImpl from '../utils/BrowserActionsImpl';
import { LocatorRegistry } from '../locators/registry/LocatorRegistry';
import { pageNameConstants } from '../constants/pageNameConstants';
import { LocatorFactory } from '../locators/registry/locatorTypes';
import { checkoutBasePage } from '../locators/base/checkoutPageLocators';
import { talbotsCheckoutPage } from '../locators/override/Talbots/checkoutPageLocators';
import { ann_taylorCheckoutPage } from '../locators/override/Ann_Taylor/checkoutPageLocators';

export const checkoutPageLocators = {

    ...checkoutBasePage,

    ...talbotsCheckoutPage,

    ...ann_taylorCheckoutPage
};

/**
 * Page Object Model for Checkout Page.
 */
export class CheckoutPage extends BrowserActionImpl {
    readonly page: Page;

    private readonly locators:
        typeof checkoutPageLocators;

    constructor(page: Page) {
        super();

        this.page = page;

        this.locators =
            LocatorRegistry.getLocators(
                pageNameConstants.CHECKOUTPAGE
            ) as typeof checkoutPageLocators;

        this.generateElementNamesForSelfHealing(this);
    }

    /**
      * Clicks Checkout as Guest button.
      */
    async checkoutAsGuest(): Promise<void> {

        await this.locators
            .checkoutAsGuestButton(this.page)
            .click();
    }

    /**
     * Click Checkout As Guest label/button.
     */
    async clickCheckoutAsGuest(): Promise<this> {

        await this.locators
            .checkoutAsGuestButton(this.page)
            .click();

        return this;
    }


    async enterShippingAddressDetails(
        firstName: string,
        lastName: string,
        email: string,
        address1: string,
        zipCode: string,
        city: string,
        state: string,
        phoneNumber: string,
        address2?: string
    ): Promise<this> {
        await this.type(
            this.locators.inpFirstName(this.page),
            firstName
        );

        await this.type(
            this.locators.inpLastName(this.page),
            lastName
        );

        await this.type(
            this.locators.inpEmailForOrderConfirmation(this.page),
            email
        );

        await this.type(
            this.locators.inpAddress1(this.page),
            address1
        );

        if (address2) {

            await this.type(
                this.locators.inpAddress2Optional(this.page),
                address2
            );
        }

        await this.type(
            this.locators.inpZIPCode(this.page),
            zipCode
        );

        await this.type(
            this.locators.inpCity(this.page),
            city
        );
        await this.selectDropdownByValue(
            this.locators.drpState(this.page),
            state
        );
        await this.type(
            this.locators.inpPhoneNumber(this.page),
            phoneNumber
        );
        return this;

    }
    async enterCreditCardDetails(
        nameOnCard: string,
        cardNumber: string,
        expirationMonth: string,
        expirationYear: string,
        securityCode: string
    ): Promise<this> {

        await this.type(
            this.locators.inpNameOnCard(this.page),
            nameOnCard
        );

        await this.clear(this.locators.inpCardNumber(this.page), "CC Number", true);
        await this.type(
            this.locators.inpCardNumber(this.page),
            cardNumber
        );

        await this.selectDropdownByValue(
            this.locators.drpCardExpirationMonth(this.page),
            expirationMonth
        );

        await this.selectDropdownByValue(
            this.locators.drpCardExpirationYear(this.page),
            expirationYear
        );

        await this.type(
            this.locators.inpCardNumber(this.page),
            cardNumber
        );

        await this.type(
            this.locators.inpCardSecurityNumber(this.page),
            securityCode
        );
        return this;
    }


    /**
     * enter value into PhoneNumber
     */
    async enterPhoneNumber(value: string): Promise<this> {

        const phoneNumberField =
            this.locators.inpPhoneNumber(this.page);
        if (await phoneNumberField.isVisible()) {
            await this.type(
                phoneNumberField,
                value
            );
        }
        return this;
    }

    async clickContinueShipping(): Promise<this> {

        await this.locators.btnContinueShipping(this.page).click();

        return this;
    }


    async clickPlaceOrder(): Promise<this> {
        const buttons =this.page.getByRole('button');
        const n = await buttons.count();
        for (let i = 0; i < n; i++) {
            console.log('BTN',i,JSON.stringify(await buttons.nth(i).textContent())?.trim());
        }
        const placeOrder = this.locators.lblPlaceOrder(this.page);
        await placeOrder.waitFor({ state: 'visible' });
        await placeOrder.scrollIntoViewIfNeeded();
        await placeOrder.click();

        return this;
    }

    async clickCreditCard(): Promise<this> {
        await this.locators.radCreditCard(this.page).click({ force: true });

        return this;
    }

    async enterSecurityCodeForRegisteredUser(securityCode: string): Promise<this> {
        await this.waitForElement(this.locators.inptCardSecurityNumberRegUser(this.page))
        await this.type(
            this.locators.inptCardSecurityNumberRegUser(this.page),
            securityCode
        );

        return this;
    }

    async clickContinueBilling(): Promise<this> {
        await this.waitForElement(this.locators.btnContinueBilling(this.page));

        await this.locators.btnContinueBilling(this.page).click();

        return this;
    }
}
