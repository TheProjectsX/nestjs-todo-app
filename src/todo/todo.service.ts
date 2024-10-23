import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto, UpdateTodoDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class TodoServices {
  constructor(private prismaService: PrismaService) {}

  // Retrieve All todo from Database

  async getAllTodo(userId: string) {
    return await this.prismaService.todo.findMany({
      where: { userId: userId },
    });
  }

  // Get a single Todo
  async getSingleTodoById(userId: string, todoId: string) {
    return await this.prismaService.todo.findFirst({
      where: { id: todoId, userId: userId },
    });
  }

  // Create a new Todo
  async createTodo(userId: string, body: CreateTodoDto) {
    body['userId'] = userId;
    return await this.prismaService.todo.create({ data: body });
  }

  // Update Todo
  async updateTodo(todoId: string, userId: string, body: UpdateTodoDto) {
    try {
      return await this.prismaService.todo.update({
        where: { id: todoId, userId: userId },
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
  async deleteTodo(userId: string, todoId: string) {
    try {
      return await this.prismaService.todo.delete({
        where: { id: todoId, userId: userId },
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
}
