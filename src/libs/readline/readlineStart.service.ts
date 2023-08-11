import * as process from 'process';
import * as readline from 'readline';

import { Inject, Injectable } from '@nestjs/common';

import ErrorResponse from '@apps/server/common/customExceptions/errorResponse';
import { CustomUnknownException } from '@apps/server/common/customExceptions/exception/unknown.exception';
import { ServerStatusEnum } from '@apps/server/common/enum/serverStatus.enum';

import { FinishScriptAboutProcessAboutResisterQuestions } from './docs/readline.docs';
import { InjectionToken } from '../mysql/repository/injectionToken';
import { PreQualificationRepository } from '../mysql/repository/preQualification.repository';
import { ServerInfoRepository } from '../mysql/repository/serverInfo.repository';

@Injectable()
export class ReadlineStartService {
  constructor(
    @Inject(InjectionToken.PRE_QUALIFICATION_REPOSITORY) private readonly preQualificationRepository: PreQualificationRepository,
    @Inject(InjectionToken.SERVER_INFO_REPOSITORY) private readonly serverInfoRepository: ServerInfoRepository,
  ) {}

  /**
   * 터미널에서 연결하는 readline 생성하기
   */
  private getReadline() {
    return readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * 질문지 만들기
   */
  public processingQuestions(): void {
    const questionAnswerPairs = [];
    this.processAboutResisterQuestions(questionAnswerPairs);
  }

  /**
   * 등록할 문제에 대해 물어보기
   * @param questionAnswerPairs 질문과 답변 배열
   */
  private processAboutResisterQuestions = (questionAnswerPairs: { question: string; answer: string }[]): void => {
    const rl = this.getReadline();
    rl.question('👨‍💻 질문을 입력해 주세요(❗exit을 입력하면 종료됩니다.): \n', async (question) => {
      if (question.toLowerCase() === 'exit') {
        rl.close();
        this.processSaveQuestionAnswerPairs(questionAnswerPairs);

        console.log(FinishScriptAboutProcessAboutResisterQuestions);
        console.log('\t\t\t🙏 서버를 재시작 해주세요 :)');
        return;
      } else {
        rl.close();
      }

      const answer: string = await new Promise((resolve) => {
        const rl2 = this.getReadline();
        rl2.question('🙂 답변을 입력해주세요: \n', (answer) => {
          resolve(answer);
          rl2.close();
        });
      });

      questionAnswerPairs.push({ question, answer });
      this.processAboutResisterQuestions(questionAnswerPairs);
    });
  };

  /**
   * 질문, 답변을 저장하는 프로세스
   * @param questionAnswerPairs 질문 답변 배열
   */
  private processSaveQuestionAnswerPairs = async (questionAnswerPairs: { question: string; answer: string }[]): Promise<void> => {
    console.log('🚶 질문과 답변들: ');
    let i = 1;

    for (const pair of questionAnswerPairs) {
      console.log(`❓ Question ${i}: ${pair.question}`);
      console.log(`✅ Answer ${i}: ${pair.answer}`);
      console.log('-------------------------');

      try {
        this.preQualificationRepository.create(pair.question, pair.answer);
      } catch (error) {
        console.log(error);
        throw new CustomUnknownException({
          errorResponse: ErrorResponse.COMMON.INTERNAL_SERVER_ERROR,
          raw: error,
        });
      }
      i++;
    }
    await this.serverInfoRepository.update(ServerStatusEnum.PENDING, 1);
  };
}
