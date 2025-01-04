import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { error } from "console";
import { Pet } from "src/entities/pet.entity";
import { resolve } from "path";
import { AddPetDto } from "src/dtos/pet/add.pet.dto";
import { EditPetDto } from "src/dtos/pet/edit.pet.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";

@Injectable()
export class PetService {
    constructor(
        @InjectRepository(Pet)
        private readonly pet: Repository<Pet>
    ) { }

    getAll(): Promise<Pet[] | ApiResponse> {
        return this.pet.find();
    }

    getById(id: number): Promise<Pet | ApiResponse> {
        return this.pet.findOne({where: {petId: id}});
    }

    add(data: AddPetDto): Promise<Pet | ApiResponse> {
        let newPet: Pet = new Pet();
        newPet.name = data.name;
        newPet.description = data.description;
        newPet.type = data.type;
        newPet.age = data.age;
        newPet.size = data.size;
        newPet.origin = data.origin;
        newPet.price = data.price;
        newPet.availabe = data.availabe;
        newPet.imagePath = data.imagePath;

        return new Promise((resolve) => {
            this.pet.save(newPet).then(data => resolve(data)).catch(error => {
                const response: ApiResponse = new ApiResponse("error", -1003, "Can not save pet")
            });
        });
    }

    async editById(id: number, data: EditPetDto): Promise<Pet | ApiResponse>{
        let pet = await this.pet.findOne({where: {petId: id}});
        
        if(!pet) {
            return new ApiResponse("error", -1003)
        }

        if(data.age) pet.age = data.age;
        if(data.availabe) pet.availabe = data.availabe;
        if(data.description) pet.description = data.description;
        if(data.imagePath) pet.imagePath = data.imagePath;
        if(data.name) pet.name = data.name;
        if(data.origin) pet.origin = data.origin;
        if(data.price) pet.price = data.price;
        if(data.size) pet.size = data.size;
        if(data.type) pet.type = data.type;

        try {
            return await this.pet.save(pet);
        } catch (error) {
            return new ApiResponse("error", -1003, "Failed to update pet.");
        }
    }
}