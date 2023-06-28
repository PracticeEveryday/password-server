import { Injectable } from '@nestjs/common';
import * as readline from 'readline';
import * as process from 'process';

@Injectable()
export class ReadlineService {
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
      }
    };

    askQuestion();
  }
}
