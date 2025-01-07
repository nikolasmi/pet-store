import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { AddPetDto } from "src/dtos/pet/add.pet.dto";
import { EditPetDto } from "src/dtos/pet/edit.pet.dto";
import { Pet } from "src/entities/Pet";
import { ApiResponse } from "src/misc/api.response.class";
import { PetService } from "src/services/pet/pet.service";

@Controller('api/pet')
export class PetController {
    constructor(
        private petService: PetService
    ) {}

    @Get()
    getAll(
        @Query('minPrice') minPrice?: number,
        @Query('minAge') minAge?: number,
        @Query('type') type?: string,
        @Query('size') size?: string,
        @Query('availabe') availabe?: string,
    ): Promise<Pet[] | ApiResponse> {
        return this.petService.getAll({ minPrice, minAge, type, size, availabe });
    }

    @Get(':id')
    getById(@Param('id') petId: number): Promise<Pet | ApiResponse>{
        return new Promise(async(resolve) => {
            let pet = await this.petService.getById(petId);
            if(petId === null){
                resolve(new ApiResponse("error", -1003, "can not find pet"));    
            }
            resolve(pet);
        });
    }

    @Post()
    add( @Body() data: AddPetDto): Promise<Pet | ApiResponse>{
        return this.petService.add(data)
    }

    @Put(':id')
    edit(@Param('id') id: number, @Body() data: EditPetDto): Promise<Pet | ApiResponse> {
        return this.petService.editById(id, data);        
    }
    
}