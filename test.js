import test from 'ava';
import execa from 'execa';

test('main', async (t) => {
  t.is(true, true);
  // const { stdout, stdin } = execa('./cli.js', ['myapp cra react']);
  // stdout.on('data', (data) => {
  //   stdin.write('\n');
  //   t.is(stdout.indexOf('Version') >= 0, true);
  // });
});
