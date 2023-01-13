import { Module } from '@nestjs/common';
import { FetchAdapter } from './services/fetch-adapter';

@Module({
    providers: [FetchAdapter],
    exports: [FetchAdapter]
})
export class SharedModule {}
