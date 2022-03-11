import Events from 'events';

import { StrictEventEmitter } from 'nest-emitter';
interface AppEvents {
  registerMail: (user: any) => void;
  registerUserByCultureAdmin: (user: any) => void;
  deletedUserByCultureAdmin: (user: any) => void;
  forgotPasswordMail: (userToken: any) => void;
  confirmMail: (business: any) => void;
  confirmBusinessEmployeeMail: (business: any) => void;
  confirmMailPromoter: (promoter: any) => void;
  invitePromoterMail: (promoter: any) => void;
  informFollowers: (
    users: any,
    url: string,
    event: any,
    business: any,
    type: string,
  ) => void;
  informFollowersForUpdate: (
    users: any,
    url: string,
    event: any,
    business: any,
  ) => void;
  followBusiness: (business: any) => void;
  contactUsForm: (data: any) => void;
  reserveYourPlaceEvent: (data: any) => void;
  reserveYourPlaceDeal: (data: any) => void;
}

export type EventEmitter = StrictEventEmitter<Events.EventEmitter, AppEvents>;
