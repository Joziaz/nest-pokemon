import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { PokemonModule } from 'src/pokemon/pokemon.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [PokemonModule, SharedModule]
})
export class SeedModule { }
