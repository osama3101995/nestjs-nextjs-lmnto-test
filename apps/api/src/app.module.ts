import { Module } from '@nestjs/common';
import 'dotenv/config';
import { CasesModule } from './modules/cases/cases.module';
import { ConfigModule } from '@nestjs/config';
import { PdfModule } from './modules/pdf/pdf.module';
import { RulesModule } from './modules/rules/rules.module';
import { ActionsModule } from './modules/actions/actions.module';
import { envValidationSchema } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { AssignmentService } from './modules/assignment/assignment.service';
import { AssignmentController } from './modules/assignment/assignment.controller';
import { AssignmentModule } from './modules/assignment/assignment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: [
        process.env.NODE_ENV === 'development' ? '.env.local' : '.env',
      ],      
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: true,
      }, 
    }),
    CasesModule,
    PrismaModule,
    ActionsModule,
    RulesModule,
    PdfModule,
    AssignmentModule,

  ],
  controllers: [AssignmentController],
  providers: [AssignmentService],
})
export class AppModule {}
