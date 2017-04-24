export class Device {
  coreID: string;
  serialNumber: string;
  chargingDisabled: boolean;
}

export class DeviceDetail extends Device {
  events: EventLog[];
  powerData: PowerData[];
  wakeups: Wakeup[];
}

export class EventLog {
  level: string;
  userID: number;
  coreID: string;
  source: string;
  message: string;
  data: string;
  timestamp: string;
  loggerID: string;
}

export class PowerData {
  type: string;
  coreID: string;
  startTime: string;
  stopTime: string;
  voltage: Voltage[];
  count: number;
}

export class Voltage {
  batteryVoltage: number;
  powerInVoltage: number;
  timestamp: string;
}

export class Wakeup {
  wakeupID: number;
  temperatures: number[];
  userID: number;
  coreID: string;
  startTime: string;
  endTime: string;
  duration: number;
  target: number;
  targetSide: string;
  didFinishScan: boolean;
  localDate: string;
  localTime: string;
}