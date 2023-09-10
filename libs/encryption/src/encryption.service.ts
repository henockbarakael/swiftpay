import { Injectable } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import * as CryptoJS from 'crypto-js'
@Injectable()
export class EncryptionService {
    constructor(private readonly configService: ConfigService) {}
    decrypt(value: string, staticIv = false): string {
        if (staticIv) {
            const iv = CryptoJS.enc.Hex.parse(this.configService.get('PII_SECRET'));
            const key = CryptoJS.enc.Hex.parse(this.configService.get('PII_SECRET'));

            return CryptoJS.AES.decrypt(value, key, {
                iv,
            }).toString(CryptoJS.enc.Utf8);
        } else {
            return CryptoJS.AES.decrypt(
                value,
                this.configService.get('PII_SECRET'),
            ).toString(CryptoJS.enc.Utf8);
        }
    }

    encrypt(value: string, staticIv = false): string {
        if (staticIv) {
            const iv = CryptoJS.enc.Hex.parse(this.configService.get('PII_SECRET'));
            const key = CryptoJS.enc.Hex.parse(this.configService.get('PII_SECRET'));

            return CryptoJS.AES.encrypt(value, key, { iv }).toString();
        } else {
            return CryptoJS.AES.encrypt(
                value,
                this.configService.get('PII_SECRET'),
            ).toString();
        }
    }
}
