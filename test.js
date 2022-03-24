import test from 'ava';
// import execa from 'execa';
import { execSync } from 'child_process';

test('--version', async (t) => {
  const stdout = await execSync(`./cli.js --version`);
  t.is(stdout.indexOf('0.') === 0, true);
});

test('--help', async (t) => {
  const stdout = await execSync(`./cli.js --help`);
  t.is(stdout.indexOf('Usage') >= 0, true);
});
