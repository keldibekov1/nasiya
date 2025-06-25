import { Get, Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(data: CreateAuthDto) {
    const user = await this.prisma.user.findUnique({
      where:{username:data.username}
    })
    if (!user) {
      throw new UnauthorizedException("Username yoki password xato")
      
    }
    const isMatch = await bcrypt.compare(data.password,user.password)
     if (!isMatch) {
      throw new UnauthorizedException("Username yoki password xato")
      
    }
    const role = user.role
    const token = this.jwtService.sign({id:user.id,username:user.username,role:user.role})
    
    return {token,role};
  }


  async getMe(userId:string) {
    const user = await this.prisma.user.findUnique({
      where:{id:userId}
    })
    
    if (!user) {
      throw new NotFoundException('User topilmadi');
    }
 
  return user;
}
}
