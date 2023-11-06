import { NotAcceptableException } from '@nestjs/common';

export const NormalizePhoneNumber = (): PropertyDecorator => {
  return (target: NonNullable<unknown>, propertyKey: string | symbol) => {
    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    let phoneNumberValue: string;

    // Getter function
    const getter = function () {
      return phoneNumberValue;
    };

    // Setter function
    const setter = function (newPhoneNumber: string) {
      // Normalisation du numéro de téléphone
      let cleanedNumber: string = newPhoneNumber.replace(/\D/g, '');

      if (cleanedNumber.startsWith('+243')) {
        cleanedNumber = '0' + cleanedNumber.slice(4);
      } else if (cleanedNumber.startsWith('243')) {
        cleanedNumber = '0' + cleanedNumber.slice(3);
      } else if (!cleanedNumber.startsWith('0')) {
        phoneNumberValue = newPhoneNumber;
        return;
      }

      if (cleanedNumber.length > 9) {
        throw new NotAcceptableException();
      }

      phoneNumberValue = cleanedNumber;
    };

    // Redéfinir la propriété avec le nouveau getter et setter
    Object.defineProperty(target, propertyKey, {
      ...descriptor,
      get: getter,
      set: setter,
    });
  };
};
