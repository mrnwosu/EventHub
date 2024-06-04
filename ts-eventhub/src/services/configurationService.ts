import { Prisma, PrismaClient } from "@prisma/client";

export class DataService {

    prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async startRun(){
        this.prisma.data.update({
            where: { id: 1 },
            data: { lastRun: new Date() }
        })        
    }

    public async getLastRun(){
        return this.prisma.data.findUnique({
            where: { id: 1 }
        })
    }

    public async getAccessToken(){
        const record = await this.prisma.data.findUnique({
            where: { id: 1 }
        })
        return record?.accessToken
    }
}