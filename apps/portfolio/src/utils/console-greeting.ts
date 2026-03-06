export function printConsoleGreeting() {
  console.log(
    `%c
   _   _                                  _
  | | | | ___ _   _   _   _  ___  _   _  | |
  | |_| |/ _ \\ | | | | | | |/ _ \\| | | | | |
  |  _  |  __/ |_| | | |_| | (_) | |_| | |_|
  |_| |_|\\___|\\__, |  \\__, |\\___/ \\__,_| (_)
              |___/   |___/
  `,
    'color: #6366f1; font-weight: bold',
  );
  console.log(
    '%c👋 Hey, curious dev! Thanks for peeking under the hood.',
    'font-size: 14px; color: #a5b4fc',
  );
  console.log(
    '%c🚀 Built with React 19, NestJS 11, TypeScript & lots of ☕',
    'font-size: 12px; color: #94a3b8',
  );
  console.log(
    '%c💬 Want to get in touch? Scroll down to the Contact section!',
    'font-size: 12px; color: #94a3b8',
  );
}
