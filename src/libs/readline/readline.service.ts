import * as readline from 'readline';
import * as process from 'process';
import { Injectable } from '@nestjs/common';
import { MysqlService } from '../mysql/mysql.service';
import { UnknownException } from '../../apps/server/common/customExceptions/unknown.exception';
import { ServerStatusEnum } from '../../apps/server/common/enum/serverStatus.enum';

@Injectable()
export class ReadlineService {
  constructor(private readonly mysqlService: MysqlService) {}

  private getReadline() {
    return readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  public askQuestions(): void {
    const questionAnswerPairs = [];
    this.askQuestion(questionAnswerPairs);
  }

  async askAboutPrequalifications(prequalificationsArr: { id: number; question: string; answer: string }[]) {
    for (let i = 0; i < prequalificationsArr.length; i++) {
      let rl = this.getReadline();

      const answer = await this.askPrequalification(rl, prequalificationsArr[i].question);

      if (answer !== prequalificationsArr[i].answer) {
        console.log('😠 답변이 틀립니다 다시 시작해주세요.');
        rl.close();
        return false;
      } else {
        if (i === prequalificationsArr.length - 1) {
          console.log('🥳 정답을 모두 맞췄습니다! 5초 후 서버가 시작됩니다!');
          this.sleep(5000);
          rl.close();
          return true;
        }
        console.log(`🤔 계속해서 문제를 풀어주세요 ${prequalificationsArr.length - (i + 1)}문제 남았습니다!!\n`);
      }
    }
  }

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

  // private
  private askQuestion = (questionAnswerPairs: { question: string; answer: string }[]): void => {
    const rl = this.getReadline();

    rl.question('👨‍💻 질문을 입력해 주세요(❗exit을 입력하면 종료됩니다.): \n', (question) => {
      if (question.toLowerCase() === 'exit') {
        rl.close();

        this.processQuestionAnswerPairs(questionAnswerPairs);

        const key = `
          🥰 당신은 서버를 시작할 준비가 되었습니다!!!
          ✅ 작성한 질문과 대답을 까먹지 않도록 한 번 더 확인해주세요!!
          
          🛫 시작해 봅시다!!
          
      🔒       ,--------ι                                            🔓           
      🔒     / /| 0       ◝______________________                    🔓
      🔒    | | |  ▷      ====================    )                  🔓
      🔒     \\ \\| 0       ◞\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/'                   🔓
      🔒       '_______,'                                            🔓
        
          `;

        console.log(key);
        console.log('\t\t\t🙏 서버를 재시작 해주세요 :)');
        return;
      }

      rl.question('🙂 답변을 입력해주세요: \n', (answer) => {
        questionAnswerPairs.push({ question, answer });
        this.askQuestion(questionAnswerPairs);
      });
    });
  };

  private processQuestionAnswerPairs = (questionAnswerPairs: { question: string; answer: string }[]): void => {
    console.log('🚶 질문과 답변들: ');
    let i = 1;

    for (const pair of questionAnswerPairs) {
      console.log(`❓ Question ${i}: ${pair.question}`);
      console.log(`✅ Answer ${i}: ${pair.answer}`);
      console.log('-------------------------');

      try {
        this.mysqlService.connection.promise().query(`
          INSERT INTO password.prequalifications
            (id, question, answer, createdAt, updatedAt, deletedAt)
          VALUES(${i}, '${pair.question}', '${pair.answer}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null);
        `);
      } catch (error) {
        console.log(error);
        throw new UnknownException({
          title: 'sql error',
          message: 'DB에 데이터를 넣을 때 나는 에러입니다. 타입을 확인해주세요',
          raw: error,
        });
      }
      i++;
    }
    this.mysqlService.connection
      .promise()
      .query(`UPDATE password.server_infos SET server_status = '${ServerStatusEnum.PENDING}', updatedAt = CURRENT_TIMESTAMP WHERE id = 1`);
  };

  private sleep(ms: number): void {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
  }
}
