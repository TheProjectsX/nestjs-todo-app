import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TodoServices } from './todo.service';
import { CreateTodoDto, UpdateTodoDto } from './dto';

@Controller('todo')
export class TodoController {
  constructor(private todoServices: TodoServices) {}

  // Retrieve All todo from Database
  @Get('')
  @HttpCode(HttpStatus.OK)
  async getAllTodo() {
    return await this.todoServices.getAllTodo();
  }

  // Get a single Todo
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getSingleTodoById(@Param('id') todoId: string) {
    const dbResult = await this.todoServices.getSingleTodoById(todoId);
    if (!dbResult) {
      throw new NotFoundException('Todo Not Found');
    }
    return dbResult;
  }

  // Create a new Todo
  @Post()
  async createTodo(@Body() body: CreateTodoDto) {
    return await this.todoServices.createTodo(body);
  }

  // Update Todo
  @Put(':id')
  async updateTodo(@Param('id') todoId: string, @Body() body: UpdateTodoDto) {
    return await this.todoServices.updateTodo(todoId, body);
  }

  // Delete Todo
  @Delete(':id')
  async deleteTodo(@Param('id') todoId: string) {
    return await this.todoServices.deleteTodo(todoId);
  }
}
