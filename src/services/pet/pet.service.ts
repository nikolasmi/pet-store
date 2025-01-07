import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddPetDto } from "src/dtos/pet/add.pet.dto";
import { EditPetDto } from "src/dtos/pet/edit.pet.dto";
import { Pet } from "src/entities/Pet";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";

interface FilterOptions {
    minPrice?: number;
    minAge?: number;
    type?: string;
    size?: string;
    availabe?: string;
}

@Injectable()
export class PetService {
    constructor(
        @InjectRepository(Pet)
        private readonly pet: Repository<Pet>
    ) { }

    async getAll(filters?: FilterOptions): Promise<Pet[] | ApiResponse> {
        const query = this.pet.createQueryBuilder('pet');

        if (filters.minPrice) {
            query.andWhere('pet.price >= :minPrice', { minPrice: filters.minPrice });
        }
        if (filters.minAge) {
            query.andWhere('pet.age >= :minAge', { minAge: filters.minAge });
        }
        if (filters.type) {
            query.andWhere('pet.type = :type', { type: filters.type });
        }
        if (filters.size) {
            query.andWhere('pet.size = :size', { size: filters.size });
        }
        if (filters.availabe) {
            query.andWhere('pet.availabe = :availabe', { availabe: filters.availabe });
        }

        try {
            return await query.getMany();
        } catch (error) {
            return new ApiResponse("error", -1003, "Failed to fetch pets.");
        }
    }

    getById(id: number): Promise<Pet | ApiResponse> {
        return this.pet.findOne({ where: { petId: id } });
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
                const response: ApiResponse = new ApiResponse("error", -1003, "Can not save pet");
            });
        });
    }

    async editById(id: number, data: EditPetDto): Promise<Pet | ApiResponse> {
        let pet = await this.pet.findOne({ where: { petId: id } });

        if (!pet) {
            return new ApiResponse("error", -1003);
        }

        if (data.age) pet.age = data.age;
        if (data.availabe) pet.availabe = data.availabe;
        if (data.description) pet.description = data.description;
        if (data.imagePath) pet.imagePath = data.imagePath;
        if (data.name) pet.name = data.name;
        if (data.origin) pet.origin = data.origin;
        if (data.price) pet.price = data.price;
        if (data.size) pet.size = data.size;
        if (data.type) pet.type = data.type;

        try {
            return await this.pet.save(pet);
        } catch (error) {
            return new ApiResponse("error", -1003, "Failed to update pet.");
        }
    }
}
