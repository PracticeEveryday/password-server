import * as process from 'process';
import * as readline from 'readline';

import { Inject, Injectable } from '@nestjs/common';

import { ErrorCode } from '@apps/server/common/customExceptions/errorCode';
import ErrorMessage from '@apps/server/common/customExceptions/errorMessage';
import { CustomUnknownException } from '@apps/server/common/customExceptions/exception/unknown.exception';
import { ServerStatusEnum } from '@apps/server/common/enum/serverStatus.enum';

import { FinishScriptAboutProcessAboutResisterQuestions } from './docs/readline.docs';
import { InjectionToken } from '../mysql/repository/injectionToken';
import { PrequalificationRepository } from '../mysql/repository/prequalification.repository';
import { ServerInfoRepository } from '../mysql/repository/serverInfo.repository';

@Injectable()
export class ReadlineService {
  constructor(
    @Inject(InjectionToken.PREQUALIFICATION_REPOSITORY) private readonly prequalificationRepository: PrequalificationRepository,
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
        this.prequalificationRepository.create(pair.question, pair.answer);
      } catch (error) {
        console.log(error);
        throw new CustomUnknownException({
          title: 'sql error',
          errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
          errorMessage: ErrorMessage.COMMON.INTERNAL_SERVER_ERROR,
          raw: error,
        });
      }
      i++;
    }
    await this.serverInfoRepository.update(ServerStatusEnum.PENDING, 1);
  };

  // ------------------------------------------------------------------------------------------------------------
  //-- 서버 재시작 시 질문을 할 때 readline 프로세스
  /**
   * 사전 질문에 대해 물어보기
   * @param rl 터미널 readline
   * @param question 질문
   */
  private askPrequalification(rl: readline.Interface, question: string): Promise<string> {
    return new Promise((resolve) => {
      rl.question(
        `💬 사전에 등록한 질문을 모두 정확하게 맞추어야 서버가 시작됩니다!!\n🤯 해당 질문에 대해 답변해주세요: ${question}\n`,
        (answer) => {
          resolve(answer);
        },
      );
    });
  }

  /**
   * 서버를 시작하기 위한 사전 질문 프로세스
   * @param prequalificationArr 사전 질문지 배열
   */
  async processingAboutPrequalifications(prequalificationArr: { id: number; question: string; answer: string }[]) {
    const rl = this.getReadline();
    for (let i = 0; i < prequalificationArr.length; i++) {
      const answer = await this.askPrequalification(rl, prequalificationArr[i].question);

      if (answer !== prequalificationArr[i].answer) {
        console.log('😠 답변이 틀립니다 다시 시작해주세요.');
        rl.close();
        return false;
      } else {
        if (i === prequalificationArr.length - 1) {
          console.log('🥳 정답을 모두 맞췄습니다! 5초 후 서버가 시작됩니다!');
          this.sleep(5000);
          rl.close();
          return true;
        }
        console.log(`🤔 계속해서 문제를 풀어주세요 ${prequalificationArr.length - (i + 1)}문제 남았습니다!!\n`);
      }
    }
  }

  // private

  private sleep(ms: number): void {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
  }
}
