import { Command, CommandRunner, Option } from 'nest-commander';

import { AuthService } from '../auth.service';

@Command({
  name: 'generate-device-hash',
  description: 'Device hash header generator',
})
export class GenerateDeviceHashCommand extends CommandRunner {
  private userAgent: string = '';

  constructor(private readonly authService: AuthService) {
    super();
  }

  @Option({
    flags: '-u, --user-agent <userAgent>',
    description: 'User Agent for which to generate the device hash',
    required: true,
  })
  setUserAgent(val: string) {
    this.userAgent = val;
  }

  async run() {
    const deviceHash = this.authService.hashDevice(this.userAgent);

    console.log('Device Hash Generator');
    console.log(`User-Agent: ${this.userAgent}`);
    console.log(`✅ Device Hash: ${deviceHash}`);

    await Promise.resolve();
  }
}
