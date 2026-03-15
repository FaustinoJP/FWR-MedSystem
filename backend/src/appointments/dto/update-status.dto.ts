import { IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsIn([
    'SCHEDULED',
    'CHECKED_IN',
    'IN_TRIAGE',
    'IN_CONSULTATION',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW',
  ])
  status:
    | 'SCHEDULED'
    | 'CHECKED_IN'
    | 'IN_TRIAGE'
    | 'IN_CONSULTATION'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'NO_SHOW';
}