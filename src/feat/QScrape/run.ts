import Inquirer from 'inquirer';
import { stdout } from 'process';

export async function QScrapeRun() {
  const answers = await Inquirer.prompt([
    {
      type: 'input',
      name: 'url',
      message: 'Enter the URL to scrape',
    },
  ]);

  stdout.write(answers.url);
  stdout.end();
}

export namespace QScrapeRun {}
