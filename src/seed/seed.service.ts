import { Inject, Injectable } from '@nestjs/common';
import { PokeAPIResponse } from './interfaces/PokeAPIResponse';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { FetchAdapter } from 'src/shared/services/fetch-adapter';


@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly httpService: FetchAdapter
  ) { }

  async executeSeed(): Promise<string> {
    await this.pokemonModel.deleteMany({})
    const { results } = await this.httpService.get<PokeAPIResponse>("")
    const pokemons: CreatePokemonDto[] = results.map((pokemon) => {
      const segments = pokemon.url.split('/')
      const no: number = +segments[segments.length - 2]

      const dto = new CreatePokemonDto()
      dto.name = pokemon.name
      dto.no = no
      return dto
    })

    this.pokemonModel.insertMany(pokemons)

    return "Seed Executed"
  }
}


