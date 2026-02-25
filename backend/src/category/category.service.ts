import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryInput: CreateCategoryInput): Promise<Category> {
    const newCategory = this.categoryRepository.create(createCategoryInput);
    return await this.categoryRepository.save(newCategory);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category)
      throw new NotFoundException('La categoria no se encuentra registrada');
    return category;
  }

  async update(
    id: string,
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    const category = await this.categoryRepository.preload(updateCategoryInput);
    if (!category)
      throw new NotFoundException('No se encontro a la categoria registrada');
    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<Category> {
    const category = await this.findOne(id);
    this.categoryRepository.softRemove(category);
    return category;
  }
}
