import { v4 } from 'uuid';

export const isObjectsEqual = (obj1: unknown, obj2: unknown): boolean => {
  let isEqual = false;
  const obj1Keys = Object.keys(obj1).sort();
  const obj2Keys = Object.keys(obj2).sort();
  if (obj1Keys.length !== obj2Keys.length) {
    return isEqual;
  } else {
    const areEqual = obj1Keys.every((key, index) => {
      const objValue1 = obj1[key];
      const objValue2 = obj2[obj2Keys[index]];
      return objValue1 === objValue2;
    });
    if (areEqual) {
      isEqual = true;
      return isEqual;
    } else {
      return isEqual;
    }
  }
};

export const referenceGenerator = (): string => {
  const uuid = v4().split('-');
  const today = new Date();

  const year = today.getFullYear().toString().slice(2);
  const month = today.getMonth();
  const day = today.getDate();
  const minutes = today.getMinutes();
  const seconds = today.getUTCSeconds();
  const millis = today.getMilliseconds();

  const part1 = uuid[1];
  const part2 = uuid[2];
  const part3 = uuid[3];

  return `SWY${year}${part1}${month}${part2}${day}${part3}${minutes}${seconds}${millis}FT`;
};

export const checkValidOperator = (
  phoneNumber: string,
  service: string,
): boolean => {
  const vodacom = ['81', '82', '83'];
  const airtel = ['99', '98', '97'];
  const orange = ['84', '85', '86'];
  const africell = ['90'];
  const operatorId = phoneNumber.slice(4, 6);

  if (service.toLowerCase() === 'airtel') {
    if (airtel.indexOf(operatorId) != -1) {
      return true;
    }
  } else if (service.toLowerCase() === 'orange') {
    if (orange.indexOf(operatorId) != -1) {
      return true;
    }
  } else if (service.toLowerCase() === 'vodacom') {
    if (vodacom.indexOf(operatorId) != -1) {
      return true;
    }
  } else if (service.toLowerCase() === 'africell') {
    if (africell.indexOf(operatorId) != -1) {
      return true;
    }
  }
  return false;
};

export const generateUuid = () => {
  return v4();
};

export const normalizePhoneNumber = (phoneNumber: string): string => {
  // Remove non-numeric characters
  let cleanedNumber: string = phoneNumber.replace(/\D/g, '');

  // Check if the number starts with "+243", "243", or "0"
  if (cleanedNumber.startsWith('+243')) {
    // Replace the "+243" prefix with "0"
    cleanedNumber = '0' + cleanedNumber.slice(4);
  } else if (cleanedNumber.startsWith('243')) {
    // Replace the "243" prefix with "0"
    cleanedNumber = '0' + cleanedNumber.slice(3);
  } else if (!cleanedNumber.startsWith('0')) {
    // The number doesn't match any of the expected prefixes
    return phoneNumber;
  }

  // Check if the number has more than 9 digits
  if (cleanedNumber.length > 9) {
    return phoneNumber;
  }

  // The number is in the expected format and has a maximum length of 9 digits
  return cleanedNumber;
};
