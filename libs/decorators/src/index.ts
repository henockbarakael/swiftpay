import { normalizePhoneNumber } from '../../utils';

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
      phoneNumberValue = normalizePhoneNumber(newPhoneNumber);
    };

    // Redéfinir la propriété avec le nouveau getter et setter
    Object.defineProperty(target, propertyKey, {
      ...descriptor,
      get: getter,
      set: setter,
    });
  };
};
