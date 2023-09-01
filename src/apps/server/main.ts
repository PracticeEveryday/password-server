import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@apps/server/app.module';
import { ServerStatusEnum } from '@apps/server/common/enum/serverStatus.enum';
import { EnvService } from '@libs/env/env.service';
import { EnvEnum } from '@libs/env/envEnum';
import { MysqlService } from '@libs/mysql/mysql.service';
import { PreQualificationRepository } from '@libs/mysql/repository/preQualification.repository';
import { ServerInfoRepository } from '@libs/mysql/repository/serverInfo.repository';
import { InitTableArr } from '@libs/mysql/sql/initTablePassword';
import { ReadlineEndService } from '@libs/readline/readlineEnd.service';
import { ReadlineStartService } from '@libs/readline/readlineStart.service';
import { setupSwagger } from '@libs/swagger/swagger';
import { DateUtilService } from '@libs/util/date/dateUtil.service';

class Server {
  private readonly ROW_IDX = 0 as const;
  private readonly dateUtilService: DateUtilService;

  private readonly mysql: MysqlService;
  private readonly readlineEndService: ReadlineEndService;
  private readonly readlineStartService: ReadlineStartService;

  private readonly serverInfoRepository: ServerInfoRepository;
  private readonly preQualificationRepository: PreQualificationRepository;

  constructor() {
    this.mysql = new MysqlService(new EnvService(new ConfigService()));
    this.dateUtilService = new DateUtilService();

    this.serverInfoRepository = new ServerInfoRepository(this.mysql);
    this.preQualificationRepository = new PreQualificationRepository(this.mysql);

    this.readlineEndService = new ReadlineEndService(this.preQualificationRepository, this.serverInfoRepository);
    this.readlineStartService = new ReadlineStartService(this.preQualificationRepository, this.serverInfoRepository);
  }

  /**
   * 사전에 필요한 데이터와 테이블을 생성하는 함수입니다.
   */
  public async precondition(): Promise<void> {
    try {
      await this.mysql.parallelTransaction(InitTableArr);
    } catch (error) {
      console.error('🐳 SQL 테이블 만들 시 에러');
    }
  }

  /**
   * 처음 사전 질문을 입력한 뒤 하루가 지나면 다시 입력할 수 있도록 업데이트 하는 함수입니다.
   */
  public async timeValidation() {
    try {
      const selectResult = await this.serverInfoRepository.findById(1);

      const dateDiff = this.dateUtilService.diffDays(selectResult.updatedAt, new Date());

      if (dateDiff >= 1) {
        await this.serverInfoRepository.update(ServerStatusEnum.PENDING, 1);
      }
    } catch (error) {
      console.error('⌛확인 SQL 에러');
    }
  }

  /**
   * 서버를 시작하기 위해 질문할 내역과 답변을 입력하는 함수입니다.
   *
   */
  public askQuestions(): void {
    this.readlineStartService.processingQuestions();
  }

  /**
   * 서버를 시작하기 위해 질문에 답하는 함수입니다.
   *
   */
  public async confirmAboutPreQualifications(): Promise<boolean> {
    const totalPreQualifications = await this.preQualificationRepository.findAll();
    const preQualificationArr = totalPreQualifications[this.ROW_IDX] as unknown as { id: number; question: string; answer: string }[];

    return await this.readlineEndService.processingAboutPreQualifications(preQualificationArr);
  }

  /**
   * 질문에 대해 올바르게 답변했으면 서버를 시작하는 함수입니다.
   *
   */
  public async bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    setupSwagger(app);

    app.setGlobalPrefix('/api', { exclude: ['/'] });

    const envService = app.get(EnvService);
    const PORT = +envService.get(EnvEnum.PORT) || 3000;

    await app.listen(PORT);
  }

  /**
   * 최초 서버를 시작하는 메서드입니다.
   *
   */
  public async init(): Promise<void> {
    try {
      const serverInfo = await this.serverInfoRepository.findById(1);
      const flag = serverInfo.server_status;

      switch (flag) {
        case ServerStatusEnum.PENDING:
          await this.confirmAboutPreQualifications();
          await this.serverInfoRepository.update(ServerStatusEnum.ACTIVE, 1);

          await this.bootstrap();
          break;

        case ServerStatusEnum.ACTIVE:
          await this.timeValidation();
          await this.bootstrap();
          break;
      }
    } catch (error) {
      await this.precondition();
      this.askQuestions();
    }
  }
}

const server = new Server();
server.init();
