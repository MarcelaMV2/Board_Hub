import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameResolver } from './game.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Category } from 'src/category/entities/category.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Category]), CloudinaryModule],
  providers: [GameResolver, GameService],
  exports: [TypeOrmModule],
})
export class GameModule {}
