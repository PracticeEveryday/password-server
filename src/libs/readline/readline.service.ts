import * as readline from 'readline';
import * as process from 'process';
import { Injectable } from '@nestjs/common';
import { MysqlService } from '../mysql/mysql.service';
import { UnknownException } from '../../apps/server/common/customExceptions/unknown.exception';

@Injectable()
export class ReadlineService {
  constructor(private readonly mysqlService: MysqlService) {}

  public askQuestions() {
    const questionAnswerPairs = [];
    this.askQuestion(questionAnswerPairs);
  }

  private askQuestion = (questionAnswerPairs) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('👨‍💻 질문을 입력해 주세요(❗exit을 입력하면 종료됩니다.): \n', (question) => {
      if (question.toLowerCase() === 'exit') {
        rl.close();

        this.processQuestionAnswerPairs(questionAnswerPairs);

        const key = `
          🥰 You can ready!
          ✅ Double-check the questions you've written
          
          🛫 Let's go!
          
      🔒       ,--------ι                                            🔓           
      🔒     / /| 0       ◝______________________                    🔓
      🔒    | | |  ▷      ====================    )                  🔓
      🔒     \\ \\| 0       ◞\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/'                   🔓
      🔒       '_______,'                                            🔓
        
          `;

        console.log(key);
        console.log('\t\t\t🙏 Plz Restart Server');
        return;
      }

      rl.question('🙂 답변을 입력해주세요: \n', (answer) => {
        questionAnswerPairs.push({ question, answer });
        this.askQuestion(questionAnswerPairs);
      });
    });
  };

  private processQuestionAnswerPairs = (questionAnswerPairs) => {
    console.log('🚶 질문과 답변들: ');
    let i = 1;
    for (const pair of questionAnswerPairs) {
      console.log(`❓ Question ${i}: ${pair.question}`);
      console.log(`✅ Answer ${i}: ${pair.answer}`);
      console.log('-------------------------');

      i++;
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
    }
    this.mysqlService.connection.promise().query(`
          UPDATE password.is_firsts SET is_first = 1 WHERE id = 1
        `);
  };
}
