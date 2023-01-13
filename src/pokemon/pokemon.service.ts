import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

@Injectable()
export class PokemonService {

  private readonly defaultLimit: number

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.getOrThrow<number>("DEFAULT_LIMIT")
  }

  async create(createPokemonDto: CreatePokemonDto): Promise<CreatePokemonDto> {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)

      return pokemon;
    }
    catch (error) {

      this.handlerExceptions(error)
    }
  }

  findAll(paginationOptions: PaginationDto) {

    const { limit = this.defaultLimit, offset = 0 } = paginationOptions;

    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({ No: 1 })
      .select('-__v')
  }

  async findOne(term: string): Promise<Pokemon> {
    let pokemon: Pokemon;
    if (!isNaN(+term))
      pokemon = await this.pokemonModel.findOne({ no: term })

    if (isValidObjectId(term))
      pokemon = await this.pokemonModel.findById(term)

    if (!pokemon)
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() })

    if (!pokemon)
      throw new NotFoundException(`Pokemon with id, name or no ${term} not found`)

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemonModel = await this.findOne(term)
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase().trim();
    await pokemonModel.updateOne(updatePokemonDto);
    return { ...pokemonModel.toJSON(), ...updatePokemonDto }
  }

  async remove(term: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: term })

    if (deletedCount === 0)
      throw new NotFoundException(`Pokemon with id ${term} not found`)
  }

  private handlerExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon alredy exists in db ${JSON.stringify(error.keyValue)}`)
    }

    throw new InternalServerErrorException();
  }
}
