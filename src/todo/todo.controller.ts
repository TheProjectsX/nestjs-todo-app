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
  UseGuards,
} from '@nestjs/common';
import { TodoServices } from './todo.service';
import { CreateTodoDto, UpdateTodoDto } from './dto';
import { JwtCookieGuard } from 'src/guard';
import { GetUser } from 'src/decorator';

@Controller('todo')
@UseGuards(JwtCookieGuard)
export class TodoController {
  constructor(private todoServices: TodoServices) {}

  // Retrieve All todo from Database
  @Get('')
  @HttpCode(HttpStatus.OK)
  async getAllTodo(@GetUser('id') userId: string) {
    return await this.todoServices.getAllTodo(userId);
  }

  // Get a single Todo
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getSingleTodoById(
    @Param('id') todoId: string,
    @GetUser('id') userId: string,
  ) {
    const dbResult = await this.todoServices.getSingleTodoById(userId, todoId);
    if (!dbResult) {
      throw new NotFoundException('Todo Not Found');
    }
    return dbResult;
  }

  // Create a new Todo
  @Post()
  async createTodo(@Body() body: CreateTodoDto, @GetUser('id') userId: string) {
    return await this.todoServices.createTodo(userId, body);
  }

  // Update Todo
  @Put(':id')
  async updateTodo(
    @Param('id') todoId: string,
    @Body() body: UpdateTodoDto,
    @GetUser('id') userId: string,
  ) {
    return await this.todoServices.updateTodo(todoId, userId, body);
  }

  // Delete Todo
  @Delete(':id')
  async deleteTodo(@Param('id') todoId: string, @GetUser('id') userId: string) {
    return await this.todoServices.deleteTodo(userId, todoId);
  }
}
