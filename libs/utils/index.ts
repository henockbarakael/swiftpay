import { NotAcceptableException, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
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
): { success: boolean; message: string } => {
  const vodacom = ['81', '82', '83'];
  const airtel = ['99', '98', '97'];
  const orange = ['84', '85', '89', '80'];
  const africell = ['90', '91'];
  const operatorId = phoneNumber.substring(0, 2);

  // Supprimer les caractères non numériques du numéro de téléphone
  const cleanedNumber = phoneNumber.replace(/\D/g, '');

  if (service.toLowerCase() === 'airtel') {
    if (airtel.indexOf(operatorId) !== -1) {
      return { success: true, message: "Numéro de téléphone valide pour le service Airtel." };
    }
  } else if (service.toLowerCase() === 'orange') {
    if (orange.indexOf(operatorId) !== -1) {
      return { success: true, message: "Numéro de téléphone valide pour le service Orange." };
    }
  } else if (service.toLowerCase() === 'vodacom') {
    if (vodacom.indexOf(operatorId) !== -1) {
      return { success: true, message: "Numéro de téléphone valide pour le service Vodacom." };
    }
  } else if (service.toLowerCase() === 'africell') {
    if (africell.indexOf(operatorId) !== -1) {
      return { success: true, message: "Numéro de téléphone valide pour le service Africell." };
    }
  }

  return { success: false, message: "Numéro de téléphone invalide pour l'opérateur spécifié." };
};

export const generateUuid = () => {
  return v4();
};

export const normalizePhoneNumber = (phoneNumber: string): string => {
  const validPrefixes =
    /^(?:\+?0?243|00243|0243)?(81|82|83|99|98|97|80|84|85|89|90|91|081|082|083|099|098|097|080|084|085|089|090|091)(\d{7})$/;
  const cleanedNumber = phoneNumber.replace(/\D/g, '');
  const match = cleanedNumber.match(validPrefixes);
  if (match) {
     return match[1].replace(/^0/, '') + match[2];
  }

  const errorMessage = "Le numéro de téléphone fourni n'est pas valide.";
  throw new HttpException({
    success: false,
    message: errorMessage,
  }, HttpStatus.NOT_ACCEPTABLE);
};
