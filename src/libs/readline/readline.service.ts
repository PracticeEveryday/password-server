import { Injectable } from '@nestjs/common';
import * as readline from 'readline';
import * as process from 'process';
import { MysqlService } from '../mysql/mysql.service';
import { initTablePassword } from '../mysql/sql/initTablePassword';

@Injectable()
export class ReadlineService {
  constructor(private readonly mysqlService: MysqlService) {}

  public askQuestions() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const questionAnswerPairs = [];

    const askQuestion = () => {
      rl.question('👨‍💻질문을 입력해 주세요(❗exit을 입력하면 종료됩니다.): \n', (question) => {
        if (question.toLowerCase() === 'exit') {
          rl.close();
          processQuestionAnswerPairs();
          const key2 = `
          
      🔒       ,--------ι                                            🔓           
      🔒     / /| 0       ◝______________________                    🔓
      🔒    | | |  ▷      ====================    )                  🔓
      🔒     \\ \\| 0       ◞\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/'                   🔓
      🔒       '_______,'                                            🔓
        
          `;
          console.log(key2);
          console.log('🙏 서버를 재시작 해주세요');
          return;
        }

        rl.question('🙂답변을 입력해주세요: \n', (answer) => {
          questionAnswerPairs.push({ question, answer });
          askQuestion();
        });
      });
    };

    const processQuestionAnswerPairs = () => {
      console.log('🚶 질문과 답변들:');
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
        }
      }
    };

    askQuestion();
  }
}
