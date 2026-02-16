export enum ActionType {
  CALL = 'CALL',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
}

export enum ActionOutcome {
  NO_ANSWER = 'NO_ANSWER',
  PROMISE_TO_PAY = 'PROMISE_TO_PAY',
  PAID = 'PAID',
  WRONG_NUMBER = 'WRONG_NUMBER',
}
