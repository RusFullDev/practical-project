import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, JwtFromRequestFunction, Strategy } from "passport-jwt";
import { JwtPayload, JwtPayloadWithRefreshToken } from "src/auth/types";


export const cookieExtractor:JwtFromRequestFunction = (req:Request)=>{
    if(req&&req.cookies){
        return req.cookies['refresh_token']
    }
    return null
}

@Injectable()
export class RefreshTokenFromCookieStrategy extends PassportStrategy(Strategy,"refresh-jwt"){
    constructor(){
        super({
            jwtFromRequest:cookieExtractor,
            secretOrKey:process.env.REFRESH_TOKEN_KEY,
            passReqToCallback:true
        })
    }
    validate(req:Request,payload:JwtPayload):JwtPayloadWithRefreshToken{
        const refreshToken = req.cookies.refresh_token
        console.log("Hello from cookie");
        if(!refreshToken){
            throw new ForbiddenException("Refresh token notogri")
        }
        return {...payload,refreshToken}
    }
}