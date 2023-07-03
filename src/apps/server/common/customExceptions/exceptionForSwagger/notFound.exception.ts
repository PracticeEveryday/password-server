import { ApiProperty } from '@nestjs/swagger';

// NotFoundException 예시 입니다. 필요하면 복사해서 Swagger에 반영하세요
export class NotFoundException {
  @ApiProperty({ example: 404 })
  statusCode: number;
  @ApiProperty({ example: 'not found something' })
  title: string;
  @ApiProperty({ example: 'something을 찾을 수 없습니다.' })
  message: string;
}
