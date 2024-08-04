import { Body, Controller, Post, Res } from '@nestjs/common';
import { PrismaClient,User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import userValidate from './user.validate';
import * as jwt from 'jsonwebtoken';

@Controller('users')
export class UsersController {
    private prisma;
    constructor(){
        this.prisma=new PrismaClient();
    }
    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }
    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    }
    @Post("login")
    async login(@Body() body,@Res() res){
        try {
            await userValidate.loginSchema.validate(body, { abortEarly: false }).catch(error=>{
                res.status(400).json({
                    error:error.errors[0]
                });
            });
            const user = await this.prisma.user.findFirst({
                where:{
                    email:body.email
                }
            });
            const validateHash=await this.comparePassword(body.password,user.password);
            if(!validateHash || user==null){
                res.status(404).json({
                    error:"Usuario invalido"
                });
            }else{
                delete user.password;
                const token = jwt.sign(user, process.env.SECRET, { expiresIn: '7h' });
                res.status(200).json({
                    user,
                    token
                });
            }
        } catch (error) {
            res.status(500).json({
                message:"Error al logearse"
            });
        }
        
    }
    @Post("register")
    async register(@Body() body,@Res() res){
        try {
            await userValidate.userSchema.validate(body, { abortEarly: false }).catch(error=>{
                res.status(400).json({
                    error:error.errors[0]
                });
            });
            const data:User=body;
            data.password=await this.hashPassword(data.password);
            const user = await this.prisma.user.create({
                data:data
            });
            if(user){
                res.status(200).json({
                    user,
                    message:"usuario creado"
                });
            }else{
                res.status(500).json({
                    message:"No se pudo crear el usuario"
                });
            }
        } catch (error) {
            res.status(500).json({
                message:"Error al crear el usuario"
            });
        }
    }
}
