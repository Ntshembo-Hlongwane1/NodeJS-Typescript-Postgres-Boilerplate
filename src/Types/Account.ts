import { AccountType } from './AccountType';

export type Account =
  | {
      id: number;
      universityName: string;
      email: string;
      address: string;
      password: string;
      verified: boolean;
      firstName: string;
      lastName: string;
      accountType: AccountType.SchoolAdmin;
    }
  | {
      id: number;
      email: string;
      address: string;
      password: string;
      verified: boolean;
      firstName: string;
      lastName: string;
      accountType: AccountType.STUDENT;
    };
