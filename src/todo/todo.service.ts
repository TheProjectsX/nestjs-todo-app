import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto, UpdateTodoDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class TodoServices {
  constructor(private prismaService: PrismaService) {}

  // Retrieve All todo from Database
  async getAllTodo() {
    return await this.prismaService.todo.findMany();
  }

  // Get a single Todo
  async getSingleTodoById(todoId: string) {
    return await this.prismaService.todo.findFirst({ where: { id: todoId } });
  }

  // Create a new Todo
  async createTodo(body: CreateTodoDto) {
    return await this.prismaService.todo.create({ data: body });
  }

  // Update Todo
  async updateTodo(todoId: string, body: UpdateTodoDto) {
    try {
      return await this.prismaService.todo.update({
        where: { id: todoId },
        data: body,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Todo not Found');
      } else {
        throw error;
      }
    }
  }

  // Delete Todo
  async deleteTodo(todoId: string) {
    try {
      return await this.prismaService.todo.delete({ where: { id: todoId } });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Todo not Found');
      } else {
        throw error;
      }
    }
  }
}
