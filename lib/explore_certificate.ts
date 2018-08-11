/**
 * @module node_opcua_crypto
 */

import {  exploreCertificate } from "./crypto_explore_certificate";
import { readPEM } from "./crypto_utils";

const  assert = require("better-assert");

export type PublicKeyLength = 128 | 256 | 384 | 512 ;

/**
 * A structure exposing useful information about a certificate
 */
export interface CertificateInfo {
    /** the public key length in bits */
    publicKeyLength: PublicKeyLength;
    /** the date at which the certificate starts to be valid */
    notBefore: Date;
    /** the date after which the certificate is not valid any more */
    notAfter: Date;
}

/**
 * @method exploreCertificateInfo
 * returns useful information about the certificate such as public key length, start date and end of validity date
 * @param certificate the certificate to explore
 */
export function exploreCertificateInfo(certificate: Buffer | string): CertificateInfo {

    if (typeof certificate === "string") {
        certificate = readPEM(certificate);
    }
    assert(certificate instanceof Buffer);

    const certInfo = exploreCertificate(certificate);

    const data : CertificateInfo= {
        publicKeyLength: certInfo.tbsCertificate.subjectPublicKeyInfo.keyLength,
        notBefore:       certInfo.tbsCertificate.validity.notBefore,
        notAfter:        certInfo.tbsCertificate.validity.notAfter
    };
    if (!(data.publicKeyLength  === 512 || data.publicKeyLength === 384 || data.publicKeyLength === 256 || data.publicKeyLength === 128)) {
        throw new Error("Invalid public key length (expecting 128,256,384 or 512)" + data.publicKeyLength);
    }
    return data;
}
