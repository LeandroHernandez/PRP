import { Email } from "app/services/sendEmail/send-email.service";

export interface IEducationalUnit {
  uid: string;
  clubId: string;
  name: string;
  email: Email;
  plan?: number;
  country: string;
  city: string;
  address: string;
  logo?: string;
  levels?: Array<string>;
  state: boolean;
  phoneNumber: number;
}
