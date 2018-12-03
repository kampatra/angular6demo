import { AbstractControl } from "@angular/forms";

export class CustomValidators {
    static emailDomain(domainName: string) {
        return (control: AbstractControl): { [key: string]: any } | null {
            const email: string = control.value;
            const domain = email.substring(email.lastIndexOf('@') + 1);
            if (email === '' || domain.toLowerCase() === domainName) {
                return null;
            } else {
                return { 'emailDomain': true };
            }
        };
    }
    static matchEmails(group: AbstractControl): { [key: string]: any } | null {
        const emailControl = group.get('email');
        const confirmEmailControl = group.get('confirmEmail');
        if (emailControl.value === confirmEmailControl.value || emailControl.pristine) {
            return null;
        } else {
            return { 'emailMismatch': true };
        }
    };

}