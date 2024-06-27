import { Prisma, PrismaClient } from "@prisma/client";
import { writeInfo } from "../utils/utils";

export class DataService {

    prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }
    
    initRun() {
        writeInfo("Initializing data")
        this.prisma.data.create({
            data: {
                lastRun: new Date(),
                previousSelectedVenue: null,
                accessToken: null
            }
        })
    }

    setPreviousSelectedVenue(id: string) {
        writeInfo("Setting previous selected venue")
        this.prisma.data.update({
            where: { id: 1 },
            data: { previousSelectedVenue: id }
        })
    }

    clearPreviousSelectedVenue() {
        writeInfo("Clearing previous selected venue")
        this.prisma.data.update({
            where: { id: 1 },
            data: { previousSelectedVenue: null }
        })
    }

    public async startRun(){
        writeInfo("Starting run")
        this.prisma.data.update({
            where: { id: 1 },
            data: { lastRun: new Date() }
        })        
    }

    public async getLastRun(){
        writeInfo("Getting last run")
        return this.prisma.data.findUnique({
            where: { id: 1 }
        })
    }

    public async getAccessToken(){
        writeInfo("Getting saved access token")
        const record = await this.prisma.data.findUnique({
            where: { id: 1 }
        })
        return record?.accessToken
    }
}