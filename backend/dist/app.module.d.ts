import { OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
export declare class AppModule implements OnModuleInit {
    private readonly appService;
    constructor(appService: AppService);
    onModuleInit(): void;
}
