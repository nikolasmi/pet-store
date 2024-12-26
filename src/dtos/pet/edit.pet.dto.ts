export class EditPetDto {
    name: string;
    description: string;
    type: string;
    age: number;
    size: string;
    origin: string;
    price: number;
    availabe?: "dostupno" | "nedostupno";
    imagePath: string
}