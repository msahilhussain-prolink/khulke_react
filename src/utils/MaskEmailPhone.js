import { SENDTYPE } from "./Constant";

export const MaskEmailPhone = (emailOrPhone = '', type = SENDTYPE.EMAIL) => {
    if (type === SENDTYPE.EMAIL) {
        const [name, domain] = emailOrPhone.split('@');
        const { length: len } = name;
        let maskedName = ""
        if (name.length > 3) {
            maskedName = '*****' + name[len - 3] + name[len - 2] + name[len - 1];
        } else {
            maskedName = name;
        }
        const mastDomain = domain[0] + domain[1] + domain[2] + '******'
        const maskedEmail = maskedName + '@' + mastDomain;
        return maskedEmail;
    } else if (type === SENDTYPE.PHONENUMBER) {
        const number = emailOrPhone.split("");
        let startNum = "";
        const { length: len } = number;
        for (let i = 0; i < 5; i++) {
            startNum += number[i];
        }
        const maskNumber = startNum + '******' + number[len - 2] + number[len - 1];
        return maskNumber;
    }
    return emailOrPhone
}