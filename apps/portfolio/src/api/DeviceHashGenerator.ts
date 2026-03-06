export class DeviceHashGenerator {
  private userAgent: string;

  constructor() {
    this.userAgent = navigator.userAgent;
  }

  public async generateHash(): Promise<string> {
    const data = new TextEncoder().encode(this.userAgent);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
}
