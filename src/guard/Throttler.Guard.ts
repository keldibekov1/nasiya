import {
  ThrottlerGuard,
  ThrottlerException,
} from '@nestjs/throttler';
import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: import('@nestjs/throttler').ThrottlerLimitDetail
  ): Promise<void> {
    throw new ThrottlerException('Juda kop sorov! Keyinroq urinib koring.');
  }
}
