export class EventLog {
  user: User;
  device: Device;
  level: string;
  source: string;
  message: string;
  data: string;
  timestamp: string;
  loggerID: string;
}

export class User {
    userID: number;
    name: string;
    sideOfBed: string;
    isPrimaryUser: boolean;    
}

export class Device {
    coreID: string;
    serialNumber: string;
}