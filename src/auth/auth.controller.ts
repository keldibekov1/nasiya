import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, ResetPasswordDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtAuthGuard } from 'src/guard/auth.guard';
import { UpdateMeDto } from './dto/UpdateMeDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getMe(@Request() req) {
    return this.authService.getMe(req.user.id);
  }
  @UseGuards(JwtAuthGuard)
@Patch('/me')
updateMe(@Request() req, @Body() updateData: UpdateMeDto) {
  return this.authService.updateMe(req.user.id, updateData);
}

  @UseGuards(JwtAuthGuard)
  @Patch('/reset-password')
  resetPassword(@Body() newPasswordDto: ResetPasswordDto, @Request() req) {
    const userId = req.user.id;
    return this.authService.resetPassword(userId, newPasswordDto.password);
  }
}
