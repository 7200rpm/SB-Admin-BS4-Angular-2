export class Customer {
  userID: number;
  name: string;
  isPrimaryUser: boolean;
  device: CustomerDevice;
  coreID: string;
  serialNumber: string;
  wakeupCount: number;
}

export class CustomerDevice {
  coreID: string;
  serialNumber: string;
}

export class CustomerDetail extends Customer {
  secondaryUser: Customer;
  wakeups: Wakeup[];
  eventLog: EventLog[];
  alarms: Alarm[];
}

export class EventLog {
  userID: number;
  level: string;
  coreID: number;
  source: string;
  message: string;
  timestamp: string;
  loggerID: string;
}

export class Alarm {
  userID: number;
  isActive: boolean;
  localTime: string;
  onSunday: boolean;
  onMonday: boolean;
  onTuesday: boolean;
  onWednesday: boolean;
  onThursday: boolean;
  onFriday: boolean;
  onSaturday: boolean;
}

export class Wakeup {
  userID: number;
  coreID: string;
  startTime: string;
  endTime: string;
  duration: number;
  targetSide: string;
  didFinshScan: boolean;
  localDate: string;
  localTime: string;
  temperatures: number[];
}
