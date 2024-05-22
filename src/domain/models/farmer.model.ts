export class FarmerModel {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    fields?: { name: string; location: string }[];
}
