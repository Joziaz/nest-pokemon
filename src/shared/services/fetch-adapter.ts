import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { HttpAdapter } from "../interfaces/http-adapter.interface";

@Injectable()
export class FetchAdapter implements HttpAdapter {

    async get<T>(url: string): Promise<T> {
        try {
            const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=800")
            if (!response.ok)
                throw new InternalServerErrorException();

            const result: T = await response.json()
            return result
        } catch (error) {
            console.log({...error})
            throw new InternalServerErrorException();
        }
    }

}